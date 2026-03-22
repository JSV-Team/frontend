// EmptyState - Initial state when user hasn't started searching
// Displays illustration, title, description, and start button
import React from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

function EmptyState({ isLoading, isConnected, onJoinQueue }) {
  return (
    <motion.div
      className="match-empty-state"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Icon */}
      <motion.div
        className="empty-state-icon"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Heart size={60} />
      </motion.div>

      {/* Title */}
      <h2 className="empty-state-title">Sẵn Sàng Tìm Người Ghép Đôi?</h2>

      {/* Description */}
      <p className="empty-state-description">
        Nhấn nút bên dưới để tham gia hàng đợi và tìm kiếm những người có cùng sở thích với bạn
      </p>

      {/* Start Button */}
      <motion.button
        className="btn-start-matching"
        onClick={onJoinQueue}
        disabled={isLoading || !isConnected}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        {isLoading ? 'Đang kết nối...' : 'Tìm Người Ghép Đôi'}
      </motion.button>

      {/* Connection status */}
      {!isConnected && (
        <motion.p
          className="connection-status-warning"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          ⚠️ Đang kết nối với máy chủ...
        </motion.p>
      )}
    </motion.div>
  );
}

export default EmptyState;
