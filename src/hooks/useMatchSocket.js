// useMatchSocket - Socket.IO hook for real-time match events
// Manages Socket.IO connection setup, event handlers, reconnection logic, and error handling
import { useState, useEffect, useCallback, useRef } from 'react';

const SOCKET_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3001';
const RECONNECTION_DELAY = 1000;
const RECONNECTION_DELAY_MAX = 5000;
const RECONNECTION_ATTEMPTS = 5;

function useMatchSocket(userId, token) {
  // Connection state
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  
  // Queue state
  const [queueState, setQueueState] = useState({
    status: 'idle', // idle | searching | matched | timeout | error
    queueSize: 0,
    estimatedWaitTime: null,
    joinedAt: null,
    waitTime: 0,
  });
  
  // Match state
  const [matchData, setMatchData] = useState(null);
  
  // Error state
  const [error, setError] = useState(null);
  
  // Socket reference
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  // Setup Socket.IO connection
  const setupConnection = useCallback(() => {
    if (!userId || !token) {
      console.log('⏸️ Skipping socket setup - missing userId or token');
      return;
    }
    if (socketRef.current?.connected) {
      console.log('✅ Socket already connected, reusing connection');
      return;
    }

    console.log('🔌 Setting up socket connection for user:', userId);

    // Dynamic import for socket.io-client
    import('socket.io-client').then(({ io }) => {
      try {
        const socket = io(SOCKET_URL, {
          auth: { userId, token },
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionDelay: RECONNECTION_DELAY,
          reconnectionDelayMax: RECONNECTION_DELAY_MAX,
          reconnectionAttempts: RECONNECTION_ATTEMPTS,
        });

        console.log('📡 Socket instance created, waiting for connection...');

        // Connection event handler
        socket.on('connect', () => {
          setIsConnected(true);
          setReconnectAttempts(0);
          setError(null);
          console.log('✅ Match socket connected:', socket.id);
        });

        // Disconnection event handler
        socket.on('disconnect', (reason) => {
          setIsConnected(false);
          console.log('❌ Match socket disconnected:', reason);
          
          // If disconnected due to server namespace disconnect, don't try to reconnect
          if (reason === 'io server disconnect') {
            socket.connect();
          }
        });

        // Connection error handler
        socket.on('connect_error', (error) => {
          console.error('❌ Socket connection error:', error);
          setReconnectAttempts(prev => prev + 1);
          setError(error.message || 'Connection error');
        });

        // match:joined event handler - User successfully joined queue
        socket.on('match:joined', (data) => {
          setQueueState(prev => ({
            ...prev,
            status: 'searching',
            queueSize: data.queueSize,
            estimatedWaitTime: data.estimatedWaitTime,
            joinedAt: Date.now(),
          }));
          setError(null);
        });

        // match:queue_update event handler - Queue size updated
        socket.on('match:queue_update', (data) => {
          setQueueState(prev => ({
            ...prev,
            queueSize: data.queueSize,
          }));
        });

        // match:found event handler - Match found
        socket.on('match:found', (data) => {
          console.log('🎉 match:found event received:', data);
          
          setQueueState(prev => ({
            ...prev,
            status: 'matched',
          }));
          setMatchData({
            matchedUser: data.matchedUser,
            interestScore: data.score || data.interestScore || 0,
            commonInterests: data.commonInterests,
            conversationId: data.conversationId,
          });
          setError(null);
        });

        // match:timeout event handler - Queue timeout
        socket.on('match:timeout', (data) => {
          setQueueState(prev => ({
            ...prev,
            status: 'timeout',
          }));
          setError(data.suggestion || 'No suitable match found');
        });

        // match:cancelled event handler - Queue cancelled
        socket.on('match:cancelled', (data) => {
          setQueueState(prev => ({
            ...prev,
            status: 'idle',
            queueSize: 0,
            estimatedWaitTime: null,
            joinedAt: null,
            waitTime: 0,
          }));
          setMatchData(null);
          setError(null);
        });

        // match:error event handler - Error occurred
        socket.on('match:error', (data) => {
          setError(data.error || 'An error occurred');
          setQueueState(prev => ({
            ...prev,
            status: 'error',
          }));
        });

        socketRef.current = socket;
        console.log('✅ Socket setup complete');
      } catch (err) {
        console.error('Failed to setup Socket.IO connection:', err);
        setError(err.message || 'Failed to setup connection');
      }
    }).catch(err => {
      console.error('Failed to import socket.io-client:', err);
      setError('Failed to load Socket.IO client');
    });
  }, [userId, token]);

  // Join queue
  const joinQueue = useCallback(() => {
    if (!socketRef.current?.connected) {
      setError('Socket not connected');
      return;
    }
    
    console.log('🚀 Emitting match:join event for user:', userId);
    
    socketRef.current.emit('match:join', {}, (response) => {
      console.log('📥 Received match:join response:', response);
      
      if (response && response.success) {
        setQueueState(prev => ({
          ...prev,
          status: 'searching',
          queueSize: response.queueSize || 0,
          estimatedWaitTime: response.estimatedWaitTime || null,
        }));
        setError(null);
      } else {
        setQueueState(prev => ({
          ...prev,
          status: 'error',
        }));
        setError(response?.error || 'Failed to join queue');
      }
    });
  }, [userId, token]);

  // Cancel queue
  const cancelQueue = useCallback(() => {
    if (!socketRef.current?.connected) {
      setError('Socket not connected');
      return;
    }
    
    socketRef.current.emit('match:cancel', { userId }, (response) => {
      if (response.success) {
        setQueueState(prev => ({
          ...prev,
          status: 'idle',
          queueSize: 0,
          estimatedWaitTime: null,
        }));
        setError(null);
      } else {
        setError(response.error || 'Failed to cancel queue');
      }
    });
  }, [userId]);

  // Send heartbeat ping to keep connection alive
  const sendPing = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('match:ping');
    }
  }, []);

  // Disconnect socket
  const disconnect = useCallback(() => {
    console.log('🔌 Disconnecting socket...');
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      setQueueState({
        status: 'idle',
        queueSize: 0,
        estimatedWaitTime: null,
        joinedAt: null,
        waitTime: 0,
      });
      setMatchData(null);
      console.log('✅ Socket disconnected and cleaned up');
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
  }, []);

  // Clear match data
  const clearMatch = useCallback(() => {
    setMatchData(null);
    setQueueState(prev => ({
      ...prev,
      status: 'idle',
      queueSize: 0,
      estimatedWaitTime: null,
      joinedAt: null,
      waitTime: 0,
    }));
  }, []);

  // Setup connection on mount
  useEffect(() => {
    console.log('🎬 useMatchSocket mount effect - userId:', userId, 'token:', token ? 'present' : 'missing');
    setupConnection();
    return () => {
      console.log('🧹 useMatchSocket cleanup effect');
      disconnect();
    };
  }, [setupConnection, disconnect]);

  // Update wait time every second when searching
  useEffect(() => {
    if (queueState.status !== 'searching' || !queueState.joinedAt) return;

    const interval = setInterval(() => {
      setQueueState(prev => ({
        ...prev,
        waitTime: Math.floor((Date.now() - prev.joinedAt) / 1000),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [queueState.status, queueState.joinedAt]);

  // Send heartbeat ping every 30 seconds when searching
  useEffect(() => {
    if (queueState.status !== 'searching') return;

    const interval = setInterval(() => {
      sendPing();
    }, 30000);

    return () => clearInterval(interval);
  }, [queueState.status, sendPing]);

  return {
    // Connection state
    isConnected,
    reconnectAttempts,
    
    // Queue state
    queueState,
    
    // Match data
    matchData,
    
    // Error state
    error,
    
    // Actions
    joinQueue,
    cancelQueue,
    sendPing,
    clearMatch,
    disconnect,
    
    // Socket reference (for advanced usage)
    socket: socketRef.current,
  };
}

export default useMatchSocket;