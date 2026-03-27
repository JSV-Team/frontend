// MatchSidebar - Optional sidebar component for match history and statistics
// Displays recent matches and match statistics
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { matchService } from '../../services/matchService';
import { buildAvatarUrl } from '../../services/profileService';


function MatchSidebar({ matchData, queueInfo }) {
  const [matchHistory, setMatchHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [totalMatches, setTotalMatches] = useState(0);
  const navigate = useNavigate();

  console.log('🎨 [MatchSidebar] Component rendered');
  console.log('   matchData:', matchData);
  console.log('   queueInfo:', queueInfo);

  // Fetch match history on component mount
  useEffect(() => {
    console.log('🔄 [MatchSidebar] useEffect triggered');
    
    const fetchMatchHistory = async () => {
      try {
        setIsLoadingHistory(true);
        console.log('🔍 [MatchSidebar] Fetching match history...');
        
        // Check if user is logged in
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        console.log('   Token exists:', !!token);
        console.log('   User exists:', !!user);
        
        if (!token) {
          console.error('❌ [MatchSidebar] No token found!');
          return;
        }
        
        const response = await matchService.getMatchHistory();
        
        console.log('📦 [MatchSidebar] API Response:', response);
        
        if (response.success && response.data) {
          console.log('✅ [MatchSidebar] Match history loaded:', response.data.length, 'matches');
          console.log('   Data:', response.data);
          setMatchHistory(response.data);
          setFilteredHistory(response.data);
          setTotalMatches(response.data.length);
        } else {
          console.log('⚠️ [MatchSidebar] No match history data');
          console.log('   Response:', response);
        }
      } catch (error) {
        console.error('❌ [MatchSidebar] Error fetching match history:', error);
        console.error('   Error details:', error.message, error.stack);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchMatchHistory();
  }, []);

  // Handle search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredHistory(matchHistory);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = matchHistory.filter(match => {
      const fullName = (match.matched_full_name || '').toLowerCase();
      const username = (match.matched_username || '').toLowerCase();
      return fullName.includes(query) || username.includes(query);
    });
    
    setFilteredHistory(filtered);
  }, [searchQuery, matchHistory]);

  // Calculate compatibility percentage from match data
  const getCompatibilityPercentage = () => {
    // If we have match history with scores, calculate average
    if (matchHistory && matchHistory.length > 0) {
      const scoresWithValues = matchHistory
        .map(m => m.match_score)
        .filter(score => score != null && score > 0);
      
      if (scoresWithValues.length > 0) {
        const average = scoresWithValues.reduce((sum, score) => sum + score, 0) / scoresWithValues.length;
        return Math.round(average);
      }
    }
    
    // Fallback to current match data if available
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

  // Navigate to user profile
  const handleViewProfile = (userId) => {
    console.log('🔍 Navigating to profile:', userId);
    navigate(`/profile/${userId}`);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

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
        
        {/* Search Bar */}
        {matchHistory.length > 0 && (
          <div className="match-search-container">
            <input
              type="text"
              className="match-search-input"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="match-search-icon">🔍</span>
          </div>
        )}

        <div className="recent-matches-list">
          {isLoadingHistory ? (
            <p className="sidebar-empty-message">Đang tải...</p>
          ) : filteredHistory.length === 0 ? (
            <p className="sidebar-empty-message">
              {searchQuery ? 'Không tìm thấy kết quả' : 'Chưa có lịch sử ghép đôi'}
            </p>
          ) : (
            filteredHistory.map((match) => (
              <div 
                key={match.match_id} 
                className="recent-match-item"
                onClick={() => handleViewProfile(match.matched_user_id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="match-avatar">
                  {match.matched_avatar_url ? (
                    <img 
                      src={buildAvatarUrl(match.matched_avatar_url)} 
                      alt={match.matched_username}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="match-avatar-placeholder"
                    style={{ display: match.matched_avatar_url ? 'none' : 'flex' }}
                  >
                    {match.matched_full_name?.charAt(0) || match.matched_username?.charAt(0) || '?'}
                  </div>
                </div>
                <div className="match-info">
                  <div className="match-name">
                    {match.matched_full_name || match.matched_username}
                  </div>
                  <div className="match-time">
                    {formatDate(match.created_at)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Match Statistics Section */}
      <div className="sidebar-section">
        <h3 className="sidebar-section-title">Thống Kê</h3>
        <div className="match-stats">
          <div className="stat-item">
            <span className="stat-label">Tổng Ghép Đôi</span>
            <span className="stat-value">{totalMatches}</span>
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
