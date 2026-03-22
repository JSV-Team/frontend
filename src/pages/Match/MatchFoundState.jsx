// MatchFoundState - State when a match has been found
// Displays match card with animations and action buttons
import React from 'react';
import { motion } from 'motion/react';
import MatchCard from './MatchCard';

function MatchFoundState({
  matchData,
  isLoading,
  onMessageMatch,
  onViewProfile,
  onClearMatch,
}) {
  // Extract match data from either matchData object or context properties
  const matchedUser = matchData?.matchedUser;
  const interestScore = matchData?.interestScore;
  const commonInterests = matchData?.commonInterests || [];

  if (!matchedUser) {
    return null;
  }

  return (
    <motion.div
      className="match-found-state"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Celebration animation background */}
      <motion.div
        className="match-celebration-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="celebration-particle"
            initial={{ opacity: 0, scale: 0, y: 0 }}
            animate={{
              opacity: [1, 0],
              scale: [0, 1, 0],
              y: [-20, -100],
              x: Math.random() * 100 - 50,
            }}
            transition={{
              duration: 2,
              delay: i * 0.1,
              ease: 'easeOut',
            }}
          >
            ❤️
          </motion.div>
        ))}
      </motion.div>

      {/* Match found title */}
      <motion.h2
        className="match-found-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        🎉 Tìm Thấy Người Ghép Đôi!
      </motion.h2>

      {/* Match card */}
      <MatchCard
        matchedUser={matchedUser}
        interestScore={interestScore}
        commonInterests={commonInterests}
        onMessage={onMessageMatch}
        onViewProfile={onViewProfile}
      />

      {/* New search button */}
      <motion.button
        className="btn-new-search"
        onClick={onClearMatch}
        disabled={isLoading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.3 }}
      >
        Tìm Người Khác
      </motion.button>
    </motion.div>
  );
}

export default MatchFoundState;
