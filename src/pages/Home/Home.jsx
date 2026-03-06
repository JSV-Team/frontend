import { useState } from 'react';
import CreatePost from '../../components/Post/CreatePost';
import PendingGroups from '../../components/ListWaitingGroup/PendingGroup';
import useListPost from '../../hooks/useListPost';
import useNotifications from '../../hooks/useNotifications';
import { Activity, Clock, Settings, Star, MessageSquare, Bell, ChevronRight, MoreHorizontal } from 'lucide-react';
import { motion } from 'motion/react';
import './Home.css';

const CURRENT_USER_ID = 2; // Tạm thời hardcode, thay bằng auth sau

function Home() {
  const [reload, setReload] = useState(0);
  const [pendingReload, setPendingReload] = useState(0);
  const [joiningIds, setJoiningIds] = useState(new Set()); // track đang loading join

  // FIX: truyền reload vào hook để re-fetch sau khi tạo bài
  const { posts, loading, error } = useListPost(reload);
  const { notifications, unreadCount } = useNotifications(CURRENT_USER_ID);

  const reloadPosts = () => setReload(prev => prev + 1);

  const handleJoinPost = async (activityId) => {
    if (joiningIds.has(activityId)) return; // đang xử lý rồi

    setJoiningIds(prev => new Set(prev).add(activityId));
    try {
      const response = await fetch('/api/activities/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activityId, userId: CURRENT_USER_ID }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Tham gia thất bại');
        return;
      }

      alert('Đã gửi yêu cầu tham gia! Chờ chủ hoạt động duyệt.');
      setPendingReload(prev => prev + 1);
    } catch (err) {
      console.error('Join error:', err);
      alert('Lỗi kết nối: ' + err.message);
    } finally {
      setJoiningIds(prev => {
        const s = new Set(prev);
        s.delete(activityId);
        return s;
      });
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'Vừa xong';
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    return `${Math.floor(diff / 86400)} ngày trước`;
  };

  return (
    <div className="home-container">
      <div className="home-main">
        <div className="home-layout">
          {/* Left Sidebar - Pending Groups */}
          <aside className="home-sidebar">
            <PendingGroups reload={pendingReload} />
          </aside>

          {/* Right Content - Posts Feed */}
          <div className="home-content">
            <CreatePost onPostCreated={reloadPosts} />

            <div className="posts-section">
              {loading && <p className="loading">Đang tải...</p>}
              {error && <p className="error">{error}</p>}
              {!loading && !error && posts.length === 0 && (
                <p className="no-posts">Chưa có bài viết nào</p>
              )}

              {console.log('Posts in Home:', posts)}
              {posts.map((post) => {
                const isOwner = post.user_id === CURRENT_USER_ID;
                const isJoining = joiningIds.has(post.status_id);

                return (
                  <div key={post.status_id} className="post-card">
                    <div className="post-header">
                      <div className="post-user">
                        <div className="avatar-container">
                          <div className="avatar-inner">
                            <img
                              src={post.avatar_url || 'https://i.pravatar.cc/150?img=1'}
                              alt={post.username || 'User'}
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        </div>
                        <div className="user-info">
                          <div className="user-info-top">
                            <h2>{post.full_name || post.username || 'Người dùng'}</h2>
                            <span className="dot-separator">•</span>
                            <span className="post-time">{getTimeAgo(post.created_at)}</span>
                          </div>
                          <div className="user-info-bottom">
                            <span className="user-badge">{post.category || 'HOẠT ĐỘNG'}</span>
                            <span className="dot-separator">•</span>
                            <span className="online-dot" />
                          </div>
                        </div>
                      </div>
                      <button className="more-button">
                        <MoreHorizontal size={24} />
                      </button>
                    </div>

                    {/* Post info */}
                    <div className="post-content-wrapper">
                      <div className="post-text-content">
                        <h3 className="post-title">{post.content || 'Hoạt động'}</h3>
                        {post.extra_content && (
                          <p className="post-description">{post.extra_content}</p>
                        )}
                      </div>

                      {post.image_url && (
                        <div className="post-media-container">
                          {/* Failsafe: Nếu bắt đầu bằng /uploads thì dùng full URL đến backend */}
                          {console.log('Rendering image:', post.image_url)}
                          <img
                            src={post.image_url.startsWith('http') ? post.image_url : `http://localhost:3001${post.image_url}`}
                            alt="Post"
                            className="post-media-img"
                          />
                          <button className="floating-comment-btn">
                            <MessageSquare size={24} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Post meta: địa điểm, số người (nếu có) */}
                    {(post.location || post.max_participants) && (
                      <div className="post-optional-meta">
                        {post.location && <span>📍 {post.location}</span>}
                        {post.max_participants && <span>👥 Tối đa {post.max_participants} người</span>}
                        {post.duration_minutes && <span>⏱ {post.duration_minutes} phút</span>}
                      </div>
                    )}

                    {/* Post Stats */}
                    <div className="post-stats">
                      <div className="stats-left">
                        <Star size={16} className="star-icon" />
                        <span>{post.interested_count || 12} người quan tâm</span>
                      </div>
                      <div className="stats-right">
                        <span>{post.comment_count || 5} bình luận</span>
                      </div>
                    </div>

                    <div className="post-actions-divider" />

                    <div className="post-actions-bar">
                      {/* Chủ bài không thấy nút Tham gia */}
                      {isOwner ? (
                        <span className="post-creator-label">✓ Bài viết của bạn</span>
                      ) : (
                        <button
                          className="action-btn join-btn"
                          onClick={() => handleJoinPost(post.status_id)}
                          disabled={isJoining}
                        >
                          {isJoining ? 'Đang gửi...' : 'Tham gia'}
                        </button>
                      )}
                      <button className="action-btn message-btn">Nhắn tin</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <div className="floating-chat-btn">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="chat-button"
        >
          <MessageSquare size={28} />
          <span className="floating-chat-btn-tooltip">Khung chat</span>
        </motion.button>
      </div>
    </div>
  );
}

export default Home;
