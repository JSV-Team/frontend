// SearchingState - State when user is in queue looking for a match
// Displays loading animation, queue info, user interests, and cancel button
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

function SearchingState({
  queueInfo,
  userInterests,
  isLoading,
  onCancelQueue,
}) {
  // Local timer state
  const [waitTime, setWaitTime] = useState(0);

  // Update wait time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setWaitTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format wait time to MM:SS
  const formatWaitTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      className="match-searching-state"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Heartbeat ECG Animation */}
      <div className="heartbeat-container">
        <svg
          className="heartbeat-svg"
          viewBox="0 0 200 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M 0,50 L 40,50 L 45,30 L 50,70 L 55,40 L 60,50 L 200,50"
            stroke="var(--primary-color, #e91e63)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 1, 0],
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.4, 0.6, 1]
            }}
          />
        </svg>
      </div>

      {/* Status Text */}
      <motion.p
        className="searching-status-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        Đang tìm kiếm người phù hợp...
      </motion.p>

      {/* Queue Info */}
      <motion.div
        className="queue-info"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        {/* Queue Size */}
        <div className="queue-info-item">
          <div className="queue-info-label">Người Đang Chờ</div>
          <div className="queue-info-value">{queueInfo.queueSize || 0}</div>
        </div>

        {/* Wait Time */}
        <div className="queue-info-item">
          <div className="queue-info-label">Thời Gian Chờ</div>
          <div className="queue-info-value">
            {formatWaitTime(waitTime)}
          </div>
        </div>

        {/* Estimated Time */}
        {queueInfo.estimatedWaitTime && (
          <div className="queue-info-item">
            <div className="queue-info-label">Thời Gian Dự Kiến</div>
            <div className="queue-info-value">
              {Math.ceil(queueInfo.estimatedWaitTime / 60)}s
            </div>
          </div>
        )}
      </motion.div>

      {/* User Interests */}
      {userInterests && userInterests.length > 0 && (
        <motion.div
          className="user-interests-section"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <p className="interests-section-label">Sở Thích Của Bạn</p>
          <div className="user-interests-tags">
            {userInterests.map((interest, index) => (
              <motion.span
                key={interest.interest_id || index}
                className="interest-tag"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05, duration: 0.2 }}
              >
                {interest.name || interest}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Cancel Button */}
      <motion.button
        className="btn-cancel-matching"
        onClick={onCancelQueue}
        disabled={isLoading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <X size={18} />
        <span>Hủy Tìm Kiếm</span>
      </motion.button>
    </motion.div>
  );
}

export default SearchingState;
