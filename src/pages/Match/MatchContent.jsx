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
  onGoToProfile,
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
            className={`match-error-notification ${error.includes('cập nhật') ? 'blocking-error' : ''}`}
            initial={{ opacity: 0, y: -20, scale: 0.95, x: "-50%" }}
            animate={{ opacity: 1, y: "-50%", scale: 1, x: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 }, x: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)' 
            }}
          >
            <div className="error-icon">
              <AlertCircle size={24} />
            </div>
            <div className="error-content-wrapper">
              <div className="error-content">
                <span className="error-message">{error}</span>
              </div>
              
              {error.includes('cập nhật') && (
                <button 
                  className="btn-fix-error"
                  onClick={onGoToProfile}
                >
                  Cập Nhật Ngay
                </button>
              )}
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
