// MatchHeader - Header section for the Match page
// Displays title and description
import React from 'react';
import { motion } from 'motion/react';

function MatchHeader() {
  return (
    <motion.div
      className="match-header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="match-header-title">Tìm Người Ghép Đôi</h1>
      <p className="match-header-description">
        Kết nối với những người có cùng sở thích và bắt đầu cuộc trò chuyện mới
      </p>
    </motion.div>
  );
}

export default MatchHeader;
