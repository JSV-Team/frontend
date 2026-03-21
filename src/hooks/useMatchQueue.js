// useMatchQueue - Queue management hook for interest-based matching
// Manages queue state, Socket.IO events, wait time counter, and timeout handling
import { useState, useCallback, useEffect, useRef } from 'react';

const MATCH_TIMEOUT = 120; // 120 seconds timeout

function useMatchQueue(socket) {
  // Queue state: idle | searching | matched | timeout | error
  const [queueState, setQueueState] = useState('idle');
  
  // Queue info
  const [queueInfo, setQueueInfo] = useState({
    queueSize: 0,
    estimatedWaitTime: null,
    waitTime: 0,
    joinedAt: null,
  });
  
  // Match data
  const [matchData, setMatchData] = useState(null);
  
  // Error state
  const [error, setError] = useState(null);
  
  // Timeout reference
  const timeoutRef = useRef(null);
  const waitTimeIntervalRef = useRef(null);

  // 4.2.2.1 Manage queue state - Join queue
  const joinQueue = useCallback(() => {
    if (!socket?.connected) {
      setError('Socket not connected');
      return;
    }

    setQueueState('searching');
    setError(null);
    setQueueInfo(prev => ({
      ...prev,
      joinedAt: Date.now(),
      waitTime: 0,
    }));

    // Emit join event to server with callback
    socket.emit('match:join', {}, (response) => {
      if (response.success) {
        setQueueInfo(prev => ({
          ...prev,
          queueSize: response.queueSize || 0,
          estimatedWaitTime: response.estimatedWaitTime || null,
        }));
      } else {
        setQueueState('error');
        setError(response.error || 'Failed to join queue');
      }
    });
  }, [socket]);

  // 4.2.2.1 Manage queue state - Cancel queue
  const cancelQueue = useCallback(() => {
    if (!socket?.connected) {
      setError('Socket not connected');
      return;
    }

    // Clear timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Clear wait time interval
    if (waitTimeIntervalRef.current) {
      clearInterval(waitTimeIntervalRef.current);
    }

    setQueueState('idle');
    setQueueInfo({
      queueSize: 0,
      estimatedWaitTime: null,
      waitTime: 0,
      joinedAt: null,
    });
    setMatchData(null);
    setError(null);

    // Emit cancel event to server with callback
    socket.emit('match:cancel', {}, (response) => {
      if (!response.success) {
        setError(response.error || 'Failed to cancel queue');
      }
    });
  }, [socket]);

  // 4.2.2.2 Handle Socket.IO events - match:joined
  const handleMatchJoined = useCallback((data) => {
    setQueueState('searching');
    setQueueInfo(prev => ({
      ...prev,
      queueSize: data.queueSize || 0,
      estimatedWaitTime: data.estimatedWaitTime || null,
      joinedAt: Date.now(),
      waitTime: 0,
    }));
    setError(null);

    // Set timeout for 120 seconds
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setQueueState('timeout');
      setError('No suitable match found. Please try again later.');
    }, MATCH_TIMEOUT * 1000);
  }, []);

  // 4.2.2.2 Handle Socket.IO events - match:queue_update
  const handleQueueUpdate = useCallback((data) => {
    setQueueInfo(prev => ({
      ...prev,
      queueSize: data.queueSize || 0,
    }));
  }, []);

  // 4.2.2.2 Handle Socket.IO events - match:found
  const handleMatchFound = useCallback((data) => {
    // Clear timeout when match found
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Clear wait time interval
    if (waitTimeIntervalRef.current) {
      clearInterval(waitTimeIntervalRef.current);
    }

    setQueueState('matched');
    setMatchData({
      matchedUser: data.matchedUser,
      interestScore: data.interestScore,
      commonInterests: data.commonInterests,
      conversationId: data.conversationId,
    });
    setError(null);
  }, []);

  // 4.2.2.2 Handle Socket.IO events - match:timeout
  const handleMatchTimeout = useCallback((data) => {
    // Clear timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Clear wait time interval
    if (waitTimeIntervalRef.current) {
      clearInterval(waitTimeIntervalRef.current);
    }

    setQueueState('timeout');
    setError(data.suggestion || 'No suitable match found');
  }, []);

  // 4.2.2.2 Handle Socket.IO events - match:cancelled
  const handleMatchCancelled = useCallback(() => {
    // Clear timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Clear wait time interval
    if (waitTimeIntervalRef.current) {
      clearInterval(waitTimeIntervalRef.current);
    }

    setQueueState('idle');
    setQueueInfo({
      queueSize: 0,
      estimatedWaitTime: null,
      waitTime: 0,
      joinedAt: null,
    });
    setMatchData(null);
    setError(null);
  }, []);

  // 4.2.2.2 Handle Socket.IO events - match:error
  const handleMatchError = useCallback((data) => {
    // Clear timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Clear wait time interval
    if (waitTimeIntervalRef.current) {
      clearInterval(waitTimeIntervalRef.current);
    }

    setQueueState('error');
    setError(data.error || 'An error occurred');
  }, []);

  // 4.2.2.2 Setup Socket.IO event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('match:joined', handleMatchJoined);
    socket.on('match:queue_update', handleQueueUpdate);
    socket.on('match:found', handleMatchFound);
    socket.on('match:timeout', handleMatchTimeout);
    socket.on('match:cancelled', handleMatchCancelled);
    socket.on('match:error', handleMatchError);

    return () => {
      socket.off('match:joined', handleMatchJoined);
      socket.off('match:queue_update', handleQueueUpdate);
      socket.off('match:found', handleMatchFound);
      socket.off('match:timeout', handleMatchTimeout);
      socket.off('match:cancelled', handleMatchCancelled);
      socket.off('match:error', handleMatchError);
    };
  }, [socket, handleMatchJoined, handleQueueUpdate, handleMatchFound, handleMatchTimeout, handleMatchCancelled, handleMatchError]);

  // 4.2.2.3 Implement wait time counter - Update every second
  useEffect(() => {
    if (queueState !== 'searching' || !queueInfo.joinedAt) return;

    if (waitTimeIntervalRef.current) {
      clearInterval(waitTimeIntervalRef.current);
    }

    waitTimeIntervalRef.current = setInterval(() => {
      setQueueInfo(prev => ({
        ...prev,
        waitTime: Math.floor((Date.now() - prev.joinedAt) / 1000),
      }));
    }, 1000);

    return () => {
      if (waitTimeIntervalRef.current) {
        clearInterval(waitTimeIntervalRef.current);
      }
    };
  }, [queueState, queueInfo.joinedAt]);

  // 4.2.2.4 Implement timeout handling - Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (waitTimeIntervalRef.current) {
        clearInterval(waitTimeIntervalRef.current);
      }
    };
  }, []);

  // Clear match data
  const clearMatch = useCallback(() => {
    setMatchData(null);
    setQueueState('idle');
    setQueueInfo({
      queueSize: 0,
      estimatedWaitTime: null,
      waitTime: 0,
      joinedAt: null,
    });
  }, []);

  return {
    // Queue state
    queueState,
    
    // Queue info
    queueInfo,
    
    // Match data
    matchData,
    
    // Error state
    error,
    
    // Actions
    joinQueue,
    cancelQueue,
    clearMatch,
  };
}

export default useMatchQueue;