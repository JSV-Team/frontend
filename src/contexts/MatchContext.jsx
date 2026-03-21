// MatchContext - Global state management for interest-based matching
import { createContext, useContext, useState, useCallback } from 'react';

const MatchContext = createContext();

export const useMatch = () => {
  const context = useContext(MatchContext);
  if (!context) {
    throw new Error('useMatch must be used within a MatchProvider');
  }
  return context;
};

// Match states
export const MATCH_STATES = {
  EMPTY: 'empty',       // Initial state - no search
  SEARCHING: 'searching', // User is in queue looking for match
  FOUND: 'match_found',   // Match has been found
};

export const MatchProvider = ({ children }) => {
  // Queue state: 'empty' | 'searching' | 'match_found'
  const [matchState, setMatchState] = useState(MATCH_STATES.EMPTY);

  // Match data when a match is found
  const [matchedUser, setMatchedUser] = useState(null);
  const [interestScore, setInterestScore] = useState(null);
  const [commonInterests, setCommonInterests] = useState([]);
  const [conversationId, setConversationId] = useState(null);

  // User interests (for display during search)
  const [userInterests, setUserInterests] = useState([]);

  // Queue info
  const [queueSize, setQueueSize] = useState(0);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState(0);
  const [waitTime, setWaitTime] = useState(0);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Join the matching queue
  const joinQueue = useCallback(async (interests) => {
    setIsLoading(true);
    setError(null);
    setUserInterests(interests || []);
    setMatchState(MATCH_STATES.SEARCHING);
    setWaitTime(0);
    setIsLoading(false);
  }, []);

  // Cancel the search
  const cancelSearch = useCallback(() => {
    setMatchState(MATCH_STATES.EMPTY);
    setMatchedUser(null);
    setInterestScore(null);
    setCommonInterests([]);
    setConversationId(null);
    setQueueSize(0);
    setEstimatedWaitTime(0);
    setWaitTime(0);
    setError(null);
  }, []);

  // Handle match found event from Socket.IO
  const handleMatchFound = useCallback((matchData) => {
    const {
      matchedUser: user,
      interestScore: score,
      commonInterests: interests,
      conversationId: convId,
    } = matchData;

    setMatchedUser(user);
    setInterestScore(score);
    setCommonInterests(interests || []);
    setConversationId(convId);
    setMatchState(MATCH_STATES.FOUND);
  }, []);

  // Update queue info
  const updateQueueInfo = useCallback((info) => {
    if (info.queueSize !== undefined) {
      setQueueSize(info.queueSize);
    }
    if (info.estimatedWaitTime !== undefined) {
      setEstimatedWaitTime(info.estimatedWaitTime);
    }
    if (info.waitTime !== undefined) {
      setWaitTime(info.waitTime);
    }
  }, []);

  // Increment wait time (called by a timer)
  const incrementWaitTime = useCallback(() => {
    setWaitTime((prev) => prev + 1);
  }, []);

  // Clear match and start new search
  const clearMatch = useCallback(() => {
    setMatchedUser(null);
    setInterestScore(null);
    setCommonInterests([]);
    setConversationId(null);
    setMatchState(MATCH_STATES.EMPTY);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Set error
  const setMatchError = useCallback((errorMessage) => {
    setError(errorMessage);
  }, []);

  const value = {
    // Match state
    matchState,
    setMatchState,
    isMatchState: (state) => matchState === state,

    // Match data
    matchedUser,
    setMatchedUser,
    interestScore,
    setInterestScore,
    commonInterests,
    setCommonInterests,
    conversationId,
    setConversationId,

    // User interests
    userInterests,
    setUserInterests,

    // Queue info
    queueSize,
    setQueueSize,
    estimatedWaitTime,
    setEstimatedWaitTime,
    waitTime,
    setWaitTime,

    // Loading and error
    isLoading,
    setIsLoading,
    error,
    setError: setMatchError,
    clearError,

    // Actions
    joinQueue,
    cancelSearch,
    handleMatchFound,
    updateQueueInfo,
    incrementWaitTime,
    clearMatch,
  };

  return (
    <MatchContext.Provider value={value}>
      {children}
    </MatchContext.Provider>
  );
};

export default MatchContext;