// MatchCard - Card component displaying matched user information
// Shows avatar, user info, interest score, common interests, and action buttons
import React from 'react';
import { motion } from 'motion/react';
import { Heart, User, MessageCircle } from 'lucide-react';

function MatchCard({
  matchedUser,
  interestScore,
  commonInterests,
  onMessage,
  onViewProfile,
}) {
  return (
    <motion.div
      className="match-card"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Avatar Section */}
      <div className="match-card-avatar-section">
        <motion.div
          className="match-avatar-container"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <div className="match-avatar-inner">
            <img
              src={matchedUser.avatar_url || '/default-avatar.png'}
              alt={matchedUser.username}
              className="match-avatar-image"
            />
          </div>
          <div className="match-avatar-border" />
        </motion.div>

        {/* Interest Score Badge */}
        <motion.div
          className="interest-score-badge"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <Heart className="score-icon" size={16} fill="currentColor" />
          <span className="score-value">{Math.round(interestScore || 0)}%</span>
        </motion.div>
      </div>

      {/* User Info Section */}
      <div className="match-card-info">
        <h2 className="match-username">{matchedUser.username}</h2>
        <p className="match-fullname">{matchedUser.full_name}</p>
        {matchedUser.bio && (
          <p className="match-bio">{matchedUser.bio}</p>
        )}
      </div>

      {/* Common Interests Section */}
      {commonInterests && commonInterests.length > 0 && (
        <div className="match-interests-section">
          <h3 className="interests-title">Sở Thích Chung</h3>
          <div className="common-interests-list">
            {commonInterests.map((interest, index) => (
              <motion.span
                key={interest.interest_id || index}
                className="interest-tag"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05, duration: 0.2 }}
              >
                {interest.name || interest}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="match-actions">
        <motion.button
          className="btn btn-primary btn-message"
          onClick={onMessage}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <MessageCircle size={18} />
          <span>Nhắn Tin Ngay</span>
        </motion.button>

        <motion.button
          className="btn btn-secondary btn-profile"
          onClick={onViewProfile}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <User size={18} />
          <span>Xem Profile</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

export default MatchCard;
