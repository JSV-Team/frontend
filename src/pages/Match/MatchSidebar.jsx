// MatchSidebar - Optional sidebar component for match history and statistics
// Displays recent matches and match statistics
import React from 'react';
import { motion } from 'motion/react';

function MatchSidebar({ matchData, queueInfo }) {
  // Calculate compatibility percentage from match data
  const getCompatibilityPercentage = () => {
    if (!matchData) return 0;
    
    // If interestScore is provided (0-100)
    if (matchData.interestScore !== undefined) {
      return Math.round(matchData.interestScore);
    }
    
    // Calculate from common interests
    if (matchData.commonInterests && matchData.commonInterests.length > 0) {
      // Assume user has some interests, calculate percentage
      // This is a rough estimate - ideally should know total user interests
      const commonCount = matchData.commonInterests.length;
      // Estimate: if 3+ common interests = high compatibility
      return Math.min(100, Math.round((commonCount / 3) * 100));
    }
    
    return 0;
  };

  const compatibilityPercentage = getCompatibilityPercentage();

  return (
    <motion.div
      className="match-sidebar"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {/* Recent Matches Section */}
      <div className="sidebar-section">
        <h3 className="sidebar-section-title">Lịch Sử Ghép Đôi</h3>
        <div className="recent-matches-list">
          <p className="sidebar-empty-message">
            Chưa có lịch sử ghép đôi
          </p>
        </div>
      </div>

      {/* Match Statistics Section */}
      <div className="sidebar-section">
        <h3 className="sidebar-section-title">Thống Kê</h3>
        <div className="match-stats">
          <div className="stat-item">
            <span className="stat-label">Tổng Ghép Đôi</span>
            <span className="stat-value">{queueInfo?.queueSize || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Tỷ Lệ Phù Hợp</span>
            <span className="stat-value">{compatibilityPercentage}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default MatchSidebar;
