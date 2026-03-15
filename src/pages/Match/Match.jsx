import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Heart, Search, Clock, MessageCircle, Sparkles, UserCheck, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import matchService from '../../services/matchService';
import './Match.css';

const getUserId = () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try { return JSON.parse(storedUser)?.user_id || null; }
    catch { return null; }
  }
  return null;
};

function Match() {
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [searching, setSearching] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [noMatch, setNoMatch] = useState(false);
  const [error, setError] = useState('');

  const fetchStatus = useCallback(async () => {
    try {
      const data = await matchService.getStatus();
      if (data.message) {
        setError(data.message);
      } else {
        setStatus(data);
        setError('');
      }
    } catch {
      setError('Không thể tải trạng thái');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Socket.IO: Listen for match:found
  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;

    const socket = io('http://localhost:3001', {
      auth: { userId },
    });

    socket.on('match:found', (data) => {
      setMatchResult(data);
      setSearching(false);
      fetchStatus();
    });

    return () => socket.disconnect();
  }, [fetchStatus]);

  const handleToggle = async () => {
    if (toggling) return;
    setToggling(true);
    setError('');
    try {
      if (status?.is_matching_enabled) {
        await matchService.disableMatching();
      } else {
        await matchService.enableMatching();
      }
      await fetchStatus();
    } catch {
      setError('Không thể thay đổi trạng thái');
    } finally {
      setToggling(false);
    }
  };

  const handleEndMatch = async () => {
    if (toggling) return;
    setToggling(true);
    setError('');
    try {
      await matchService.endMatch();
      await fetchStatus();
      setMatchResult(null);
      setNoMatch(false);
    } catch {
      setError('Lỗi khi kết thúc ghép đôi');
    } finally {
      setToggling(false);
    }
  };

  const handleFindMatch = async () => {
    if (searching) return;
    setSearching(true);
    setMatchResult(null);
    setNoMatch(false);
    setError('');
    try {
      const result = await matchService.findMatch();
      if (!result.ok) {
        setError(result.message);
        setSearching(false);
        return;
      }
      if (result.data) {
        setMatchResult(result.data);
      } else {
        setNoMatch(true);
      }
    } catch {
      setError('Lỗi khi tìm kiếm');
    } finally {
      setSearching(false);
    }
  };

  const handleChat = () => {
    if (matchResult?.conversation_id) {
      navigate('/friends', { state: { openChatId: matchResult.conversation_id } });
    }
  };

  const handleReset = () => {
    setMatchResult(null);
    setNoMatch(false);
    setError('');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Chưa có';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="match-page">
        <div className="match-inner" style={{ textAlign: 'center', paddingTop: '4rem' }}>
          <div className="match-spinner" style={{ margin: '0 auto' }}></div>
          <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="match-page">
      <div className="match-inner">
        {/* Hero Header */}
        <motion.div
          className="match-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="match-hero-icon">
            <Sparkles size={32} />
          </div>
          <h1>Ghép đôi kết bạn</h1>
          <p>Tìm và kết nối với những người có cùng sở thích, mở rộng mạng lưới bạn bè của bạn</p>
        </motion.div>

        {/* Toggle Card */}
        <motion.div
          className="match-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="match-toggle-row">
            <div className="match-toggle-info">
              <span className="match-toggle-label">Chế độ ghép đôi</span>
              <span className="match-toggle-desc">
                {status?.is_matching_enabled ? 'Đang bật — bạn có thể được ghép đôi' : 'Đang tắt — bật để bắt đầu kết nối'}
              </span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={status?.is_matching_enabled || false}
                onChange={handleToggle}
                disabled={toggling}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {/* Status Details */}
          <div className="match-status-info">
            <div className="match-status-item">
              <span className={`status-dot ${status?.is_matching_enabled ? 'active' : 'inactive'}`}></span>
              <span>Trạng thái: {status?.is_matching_enabled ? 'Sẵn sàng ghép đôi' : 'Chưa kích hoạt'}</span>
            </div>
            <div className="match-status-item">
              <Clock size={14} />
              <span>Ghép đôi lần cuối: {formatDate(status?.last_matched_at)}</span>
            </div>
            {status?.is_in_active_match && (
              <div className="match-status-item">
                <UserCheck size={14} />
                <span>Bạn đang trong một cuộc ghép đôi</span>
                <button
                  className="match-action-btn secondary"
                  style={{ marginLeft: '1rem', padding: '0.25rem 0.6rem', fontSize: '0.75rem', height: 'auto', background: 'var(--color-bg-tertiary)', color: 'var(--color-text-primary)' }}
                  onClick={handleEndMatch}
                  disabled={toggling}
                >
                  Kết thúc
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Find Match Card */}
        <motion.div
          className="match-card match-find-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <button
            className={`match-find-btn ${searching ? 'searching' : ''}`}
            onClick={handleFindMatch}
            disabled={!status?.is_matching_enabled || searching || status?.is_in_active_match}
          >
            {searching ? (
              <>
                <span className="match-spinner"></span>
                Đang tìm kiếm...
              </>
            ) : (
              <>
                <Search size={20} />
                Tìm bạn ghép đôi
              </>
            )}
          </button>

          {!status?.is_matching_enabled && (
            <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Hãy bật chế độ ghép đôi để bắt đầu tìm kiếm
            </p>
          )}
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            className="match-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', color: '#EF4444', fontWeight: 600 }}
          >
            <WifiOff size={20} style={{ marginBottom: '0.5rem' }} />
            <p>{error}</p>
          </motion.div>
        )}

        {/* Match Result */}
        <AnimatePresence>
          {matchResult && (
            <motion.div
              className="match-result-card"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div className="match-result-icon">🎉</div>
              <h3 className="match-result-title">Ghép đôi thành công!</h3>
              <p className="match-result-text">
                Bạn đã được kết nối. Hãy bắt đầu trò chuyện ngay!
              </p>

              <div className="match-result-actions">
                <button className="match-action-btn primary" onClick={handleChat}>
                  <MessageCircle size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                  Nhắn tin ngay
                </button>
                <button className="match-action-btn secondary" onClick={handleReset}>
                  Đóng
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* No Match */}
        <AnimatePresence>
          {noMatch && !matchResult && (
            <motion.div
              className="match-no-result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p>😔 Không tìm thấy người phù hợp lúc này. Hãy thử lại sau!</p>
              <button
                className="match-action-btn secondary"
                style={{ marginTop: '0.75rem', display: 'inline-block' }}
                onClick={handleReset}
              >
                Thử lại
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Match;
