// useMatchSocket.test.js - Unit tests for Socket.IO hook
// Tests cover connection setup, event handlers, reconnection logic, and error handling

import { renderHook, act, waitFor } from '@testing-library/react';
import useMatchSocket from './useMatchSocket';

// Mock socket.io-client
jest.mock('socket.io-client', () => {
  const mockSocket = {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
    connected: false,
  };

  return {
    io: jest.fn(() => mockSocket),
  };
});

describe('useMatchSocket', () => {
  let mockSocket;

  beforeEach(() => {
    jest.clearAllMocks();
    const { io } = require('socket.io-client');
    mockSocket = io();
  });

  describe('4.2.1.1 Setup Socket.IO connection', () => {
    it('should establish Socket.IO connection with userId and token', async () => {
      const userId = 123;
      const token = 'test-token';

      renderHook(() => useMatchSocket(userId, token));

      await waitFor(() => {
        expect(require('socket.io-client').io).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            auth: { userId, token },
            transports: ['websocket', 'polling'],
            reconnection: true,
          })
        );
      });
    });

    it('should not connect if userId is missing', () => {
      renderHook(() => useMatchSocket(null, 'token'));

      expect(require('socket.io-client').io).not.toHaveBeenCalled();
    });

    it('should not connect if token is missing', () => {
      renderHook(() => useMatchSocket(123, null));

      expect(require('socket.io-client').io).not.toHaveBeenCalled();
    });

    it('should not create duplicate connections', async () => {
      const userId = 123;
      const token = 'test-token';

      mockSocket.connected = true;

      renderHook(() => useMatchSocket(userId, token));

      await waitFor(() => {
        expect(require('socket.io-client').io).not.toHaveBeenCalled();
      });
    });

    it('should configure reconnection with exponential backoff', async () => {
      const userId = 123;
      const token = 'test-token';

      renderHook(() => useMatchSocket(userId, token));

      await waitFor(() => {
        expect(require('socket.io-client').io).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
          })
        );
      });
    });
  });

  describe('4.2.1.2 Implement connection handlers', () => {
    it('should handle connect event and update connection state', async () => {
      const userId = 123;
      const token = 'test-token';

      const { result } = renderHook(() => useMatchSocket(userId, token));

      // Simulate connect event
      await act(async () => {
        const connectHandler = mockSocket.on.mock.calls.find(
          call => call[0] === 'connect'
        )[1];
        connectHandler();
      });

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true);
        expect(result.current.error).toBeNull();
        expect(result.current.reconnectAttempts).toBe(0);
      });
    });

    it('should handle disconnect event and update connection state', async () => {
      const userId = 123;
      const token = 'test-token';

      const { result } = renderHook(() => useMatchSocket(userId, token));

      // First connect
      await act(async () => {
        const connectHandler = mockSocket.on.mock.calls.find(
          call => call[0] === 'connect'
        )[1];
        connectHandler();
      });

      // Then disconnect
      await act(async () => {
        const disconnectHandler = mockSocket.on.mock.calls.find(
          call => call[0] === 'disconnect'
        )[1];
        disconnectHandler('client namespace disconnect');
      });

      await waitFor(() => {
        expect(result.current.isConnected).toBe(false);
      });
    });

    it('should handle match:joined event', async () => {
      const userId = 123;
      const token = 'test-token';

      const { result } = renderHook(() => useMatchSocket(userId, token));

      const joinedData = {
        queueSize: 5,
        estimatedWaitTime: 45,
      };

      await act(async () => {
        const joinedHandler = mockSocket.on.mock.calls.find(
          call => call[0] === 'match:joined'
        )[1];
        joinedHandler(joinedData);
      });

      await waitFor(() => {
        expect(result.current.queueState.status).toBe('searching');
        expect(result.current.queueState.queueSize).toBe(5);
        expect(result.current.queueState.estimatedWaitTime).toBe(45);
      });
    });

    it('should handle match:queue_update event', async () => {
      const userId = 123;
      const token = 'test-token';

      const { result } = renderHook(() => useMatchSocket(userId, token));

      // First join queue
      await act(async () => {
        const joinedHandler = mockSocket.on.mock.calls.find(
          call => call[0] === 'match:joined'
        )[1];
        joinedHandler({ queueSize: 5, estimatedWaitTime: 45 });
      });

      // Then update queue
      await act(async () => {
        const updateHandler = mockSocket.on.mock.calls.find(
          call => call[0] === 'match:queue_update'
        )[1];
        updateHandler({ queueSize: 4 });
      });

      await waitFor(() => {
        expect(result.current.queueState.queueSize).toBe(4);
      });
    });

    it('should handle match:found event', async () => {
      const userId = 123;
      const token = 'test-token';

      const { result } = renderHook(() => useMatchSocket(userId, token));

      const matchData = {
        matchedUser: {
          user_id: 456,
          username: 'john_doe',
          full_name: 'John Doe',
          avatar_url: 'https://example.com/avatar.jpg',
          bio: 'Love hiking',
        },
        interestScore: 75,
        commonInterests: [
          { interest_id: 1, name: 'Hiking' },
          { interest_id: 2, name: 'Photography' },
        ],
        conversationId: 'conv-123',
      };

      await act(async () => {
        const foundHandler = mockSocket.on.mock.calls.find(
          call => call[0] === 'match:found'
        )[1];
        foundHandler(matchData);
      });

      await waitFor(() => {
        expect(result.current.queueState.status).toBe('matched');
        expect(result.current.matchData).toEqual({
          matchedUser: matchData.matchedUser,
          interestScore: matchData.interestScore,
          commonInterests: matchData.commonInterests,
          conversationId: matchData.conversationId,
        });
      });
    });

    it('should handle match:timeout event', async () => {
      const userId = 123;
      const token = 'test-token';

      const { result } = renderHook(() => useMatchSocket(userId, token));

      const timeoutData = {
        waitedTime: 120,
        suggestion: 'Try expanding your interests',
      };

      await act(async () => {
        const timeoutHandler = mockSocket.on.mock.calls.find(
          call => call[0] === 'match:timeout'
        )[1];
        timeoutHandler(timeoutData);
      });

      await waitFor(() => {
        expect(result.current.queueState.status).toBe('timeout');
        expect(result.current.error).toBe('Try expanding your interests');
      });
    });

    it('should handle match:cancelled event', async () => {
      const userId = 123;
      const token = 'test-token';

      const { result } = renderHook(() => useMatchSocket(userId, token));

      // First join queue
      await act(async () => {
        const joinedHandler = mockSocket.on.mock.calls.find(
          call => call[0] === 'match:joined'
        )[1];
        joinedHandler({ queueSize: 5, estimatedWaitTime: 45 });
      });

      // Then cancel
      await act(async () => {
        const cancelledHandler = mockSocket.on.mock.calls.find(
          call => call[0] === 'match:cancelled'
        )[1];
        cancelledHandler({ message: 'Cancelled' });
      });

      await waitFor(() => {
        expect(result.current.queueState.status).toBe('idle');
        expect(result.current.queueState.queueSize).toBe(0);
      });
    });

    it('should handle match:error event', async () => {
      const userId = 123;
      const token = 'test-token';

      const { result } = renderHook(() => useMatchSocket(userId, token));

      const errorData = {
        error: 'User not found',
        code: 'USER_NOT_FOUND',
      };

      await act(async () => {
        const errorHandler = mockSocket.on.mock.calls.find(
          call => call[0] === 'match:error'
        )[1];
        errorHandler(errorData);
      });

      await waitFor(() => {
        expect(result.current.queueState.status).toBe('error');
        expect(result.current.error).toBe('User not found');
      });
    });
  });

  describe('4.2.1.3 Implement reconnection logic', () => {
    it('should handle connect_error and increment reconnect attempts', async () => {
      const userId = 123;
      const token = 'test-token';

      const { result } = renderHook(() => useMatchSocket(userId, token));

      const error = new Error('Connection failed');

      await act(async () => {
        const errorHandler = mockSocket.on.mock.calls.find(
          call => call[0] === 'connect_error'
        )[1];
        errorHandler(error);
      });

      await waitFor(() => {
        expect(result.current.reconnectAttempts).toBe(1);
        expect(result.current.error).toBe('Connection failed');
      });
    });

    it('should reset reconnect attempts on successful connection', async () => {
      const userId = 123;
      const token = 'test-token';

      const { result } = renderHook(() => useMatchSocket(userId, token));

      // First fail
      await act(async () => {
        const errorHandler = mockSocket.on.mock.calls.find(
          call => call[0] === 'connect_error'
        )[1];
        errorHandler(new Error('Connection failed'));
      });

      // Then succeed
      await act(async () => {
        const connectHandler = mockSocket.on.mock.calls.find(
          call => call[0] === 'connect'
        )[1];
        connectHandler();
      });

      await waitFor(() => {
        expect(result.current.reconnectAttempts).toBe(0);
        expect(result.current.isConnected).toBe(true);
      });
    });

    it('should update wait time every second when searching', async () => {
      jest.useFakeTimers();
      const userId = 123;
      const token = 'test-token';

      const { result } = renderHook(() => useMatchSocket(userId, token));

      // Join queue
      await act(async () => {
        const joinedHandler = mockSocket.on.mock.calls.find(
          call => call[0] === 'match:joined'
        )[1];
        joinedHandler({ queueSize: 5, estimatedWaitTime: 45 });
      });

      // Advance time by 3 seconds
      await act(async () => {
        jest.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        expect(result.current.queueState.waitTime).toBeGreaterThanOrEqual(2);
      });

      jest.useRealTimers();
    });
  });

  describe('4.2.1.4 Implement error handling', () => {
    it('should handle socket import failure', async () => {
      const userId = 123;
      const token = 'test-token';

      // Mock import failure
      jest.doMock('socket.io-client', () => {
        throw new Error('Failed to load Socket.IO');
      });

      const { result } = renderHook(() => useMatchSocket(userId, token));

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
      });
    });

    it('should handle joinQueue when socket not connected', async () => {
      const userId = 123;
      const token = 'test-token';

      const { result } = renderHook(() => useMatchSocket(userId, token));

      mockSocket.connected = false;

      await act(async () => {
        result.current.joinQueue();
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Socket not connected');
      });
    });

    it('should handle cancelQueue when socket not connected', async () => {
      const userId = 123;
      const token = 'test-token';

      const { result } = renderHook(() => useMatchSocket(userId, token));

      mockSocket.connected = false;

      await act(async () => {
        result.current.cancelQueue();
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Socket not connected');
      });
    });

    it('should emit match:join event with correct payload', async () => {
      const userId = 123;
      const token = 'test-token';

      mockSocket.connected = true;

      const { result } = renderHook(() => useMatchSocket(userId, token));

      await act(async () => {
        result.current.joinQueue();
      });

      expect(mockSocket.emit).toHaveBeenCalledWith('match:join', {
        userId,
        token,
      });
    });

    it('should emit match:cancel event with correct payload', async () => {
      const userId = 123;
      const token = 'test-token';

      mockSocket.connected = true;

      const { result } = renderHook(() => useMatchSocket(userId, token));

      await act(async () => {
        result.current.cancelQueue();
      });

      expect(mockSocket.emit).toHaveBeenCalledWith('match:cancel', {
        userId,
      });
    });

    it('should disconnect socket and cleanup on unmount', async () => {
      const userId = 123;
      const token = 'test-token';

      const { unmount } = renderHook(() => useMatchSocket(userId, token));

      unmount();

      expect(mockSocket.disconnect).toHaveBeenCalled();
    });

    it('should clear match data when clearMatch is called', async () => {
      const userId = 123;
      const token = 'test-token';

      const { result } = renderHook(() => useMatchSocket(userId, token));

      // Set match data
      await act(async () => {
        const foundHandler = mockSocket.on.mock.calls.find(
          call => call[0] === 'match:found'
        )[1];
        foundHandler({
          matchedUser: { user_id: 456 },
          interestScore: 75,
          commonInterests: [],
          conversationId: 'conv-123',
        });
      });

      // Clear match
      await act(async () => {
        result.current.clearMatch();
      });

      await waitFor(() => {
        expect(result.current.matchData).toBeNull();
        expect(result.current.queueState.status).toBe('idle');
      });
    });

    it('should send ping to keep connection alive', async () => {
      const userId = 123;
      const token = 'test-token';

      mockSocket.connected = true;

      const { result } = renderHook(() => useMatchSocket(userId, token));

      await act(async () => {
        result.current.sendPing();
      });

      expect(mockSocket.emit).toHaveBeenCalledWith('match:ping');
    });
  });

  describe('Edge cases and integration', () => {
    it('should handle rapid join and cancel', async () => {
      const userId = 123;
      const token = 'test-token';

      mockSocket.connected = true;

      const { result } = renderHook(() => useMatchSocket(userId, token));

      await act(async () => {
        result.current.joinQueue();
        result.current.cancelQueue();
      });

      expect(mockSocket.emit).toHaveBeenCalledTimes(2);
    });

    it('should maintain queue state across multiple updates', async () => {
      const userId = 123;
      const token = 'test-token';

      const { result } = renderHook(() => useMatchSocket(userId, token));

      // Join queue
      await act(async () => {
        const joinedHandler = mockSocket.on.mock.calls.find(
          call => call[0] === 'match:joined'
        )[1];
        joinedHandler({ queueSize: 10, estimatedWaitTime: 60 });
      });

      // Update queue size
      await act(async () => {
        const updateHandler = mockSocket.on.mock.calls.find(
          call => call[0] === 'match:queue_update'
        )[1];
        updateHandler({ queueSize: 9 });
      });

      // Update again
      await act(async () => {
        const updateHandler = mockSocket.on.mock.calls.find(
          call => call[0] === 'match:queue_update'
        )[1];
        updateHandler({ queueSize: 8 });
      });

      await waitFor(() => {
        expect(result.current.queueState.queueSize).toBe(8);
        expect(result.current.queueState.estimatedWaitTime).toBe(60);
      });
    });
  });
});
