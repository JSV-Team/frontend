import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import './NoInterestsModal.css';

const NoInterestsModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleAddInterests = () => {
    // Get current user ID from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== "undefined") {
      try {
        const user = JSON.parse(storedUser);
        // Navigate to profile edit page with user ID
        navigate(`/profile/${user.user_id}/edit`);
      } catch (err) {
        console.error('Failed to parse user data:', err);
        // Fallback: try to navigate to profile without ID
        navigate('/profile');
      }
    } else {
      // If no user data, navigate to home
      navigate('/');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="no-interests-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="no-interests-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Icon */}
            <div className="modal-icon-container">
              <motion.div
                className="modal-icon"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 8V12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 16H12.01"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            </div>

            {/* Content */}
            <div className="modal-content">
              <h2 className="modal-title">Thêm Sở Thích Của Bạn</h2>
              <p className="modal-description">
                Để tìm được người phù hợp nhất, bạn cần thêm ít nhất một sở thích vào hồ sơ.
                Điều này giúp chúng tôi kết nối bạn với những người có cùng đam mê!
              </p>

              {/* Features */}
              <div className="modal-features">
                <div className="feature-item">
                  <span className="feature-text">Tìm người cùng sở thích</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="modal-actions">
              <button
                className="btn-modal btn-primary"
                onClick={handleAddInterests}
              >
                Thêm Sở Thích Ngay
              </button>
              <button
                className="btn-modal btn-secondary"
                onClick={onClose}
              >
                Để Sau
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NoInterestsModal;
