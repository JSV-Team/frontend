// MatchContent - Main content area that renders different states
// Handles: empty state, searching state, match found state
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, X } from 'lucide-react';
import EmptyState from './EmptyState';
import SearchingState from './SearchingState';
import MatchFoundState from './MatchFoundState';
import { MATCH_STATES } from '../../contexts/MatchContext';

function MatchContent({
  matchState,
  queueInfo,
  matchData,
  userInterests,
  isLoading,
  error,
  isConnected,
  onJoinQueue,
  onCancelQueue,
  onMessageMatch,
  onViewProfile,
  onClearMatch,
  onClearError,
}) {
  return (
    <motion.div
      className="match-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="wait">
        {/* Error notification */}
        {error && (
          <motion.div
            className="match-error-notification"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="error-icon">
              <AlertCircle size={20} />
            </div>
            <div className="error-content">
              <span className="error-message">{error}</span>
            </div>
            <button
              className="error-close-btn"
              onClick={onClearError}
              aria-label="Close error"
            >
              <X size={18} />
            </button>
          </motion.div>
        )}

        {/* Empty state - initial state */}
        {matchState === MATCH_STATES.EMPTY && (
          <EmptyState
            key="empty-state"
            isLoading={isLoading}
            isConnected={isConnected}
            onJoinQueue={onJoinQueue}
          />
        )}

        {/* Searching state - user is in queue */}
        {matchState === MATCH_STATES.SEARCHING && (
          <SearchingState
            key="searching-state"
            queueInfo={queueInfo}
            userInterests={userInterests}
            isLoading={isLoading}
            onCancelQueue={onCancelQueue}
          />
        )}

        {/* Match found state - match has been found */}
        {matchState === MATCH_STATES.FOUND && (
          <MatchFoundState
            key="match-found-state"
            matchData={matchData}
            isLoading={isLoading}
            onMessageMatch={onMessageMatch}
            onViewProfile={onViewProfile}
            onClearMatch={onClearMatch}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default MatchContent;
