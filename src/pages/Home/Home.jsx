import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatePost from '../../components/Post/CreatePost';
import PendingGroups from '../../components/ListWaitingGroup/PendingGroup';
import useListPost from '../../hooks/useListPost';
import useNotifications from '../../hooks/useNotifications';
import { Activity, Clock, Settings, Star, MessageSquare, Bell, ChevronRight, MoreHorizontal } from 'lucide-react';
import { motion } from 'motion/react';
import './Home.css';

// Helper func lấy user ID từ danh sách Auth (localStorage)
const getUserId = () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const userObj = JSON.parse(storedUser);
      return userObj?.user_id || userObj?.id || null;
    } catch (e) {
      console.error("Error parsing user from localStorage", e);
    }
  }
  return null;
};
function Home() {
  const navigate = useNavigate();
  const userString = localStorage.getItem('user');
  const currentUser = userString ? JSON.parse(userString) : null;
  const CURRENT_USER_ID = currentUser?.user_id;
  const [reload, setReload] = useState(0);
  const [pendingReload, setPendingReload] = useState(0);
  const [joiningIds, setJoiningIds] = useState(new Set()); // track đang loading join
  const [activeMenuId, setActiveMenuId] = useState(null); // track post menu đang mở

  // FIX: truyền reload vào hook để re-fetch sau khi tạo bài
  const { posts, loading, error } = useListPost(reload);
  const currentUserId = getUserId();
  const { notifications, unreadCount } = useNotifications(currentUserId);

  const reloadPosts = () => setReload(prev => prev + 1);

  const handleDeletePost = async (activityId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) return;

    try {
      const response = await fetch(`/api/activities/${activityId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      alert('Đã xóa bài viết thành công');
      reloadPosts();
    } catch (err) {
      console.error('Lỗi khi xóa bài viết:', err);
      alert('Lỗi: ' + err.message);
    }
  };

  const handleJoinPost = async (activityId) => {
    if (joiningIds.has(activityId)) return; // đang xử lý rồi

    setJoiningIds(prev => new Set(prev).add(activityId));
    try {
      const response = await fetch('/api/activities/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activityId, userId: getUserId() }),
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

  const handleMessageHost = async (hostId) => {
    if (hostId === CURRENT_USER_ID) return;
    try {
      const response = await fetch('/api/chat/private', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partnerId: hostId, userId: CURRENT_USER_ID }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      navigate('/friends', { state: { openChatId: data.conversation_id } });
    } catch (err) {
      console.error('Lỗi tạo chat riêng:', err);
      alert('Lỗi: ' + err.message);
    }
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
                const isOwner = post.user_id === getUserId();
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
                      <div className="post-options-container" style={{ position: 'relative' }}>
                        <button
                          className="more-button"
                          onClick={() => setActiveMenuId(activeMenuId === post.status_id ? null : post.status_id)}
                        >
                          <MoreHorizontal size={24} />
                        </button>

                        {activeMenuId === post.status_id && isOwner && (
                          <div className="post-options-menu" style={{
                            position: 'absolute',
                            right: 0,
                            top: '100%',
                            background: 'white',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            zIndex: 10,
                            padding: '8px 0',
                            minWidth: '150px'
                          }}>
                            <button
                              className="post-option-item"
                              style={{
                                width: '100%',
                                padding: '8px 16px',
                                textAlign: 'left',
                                background: 'transparent',
                                border: 'none',
                                color: '#dc3545',
                                cursor: 'pointer',
                                fontSize: '14px'
                              }}
                              onClick={() => {
                                setActiveMenuId(null);
                                handleDeletePost(post.status_id);
                              }}
                            >
                              Xóa bài viết
                            </button>
                          </div>
                        )}
                        {/* Ẩn menu khi click ra ngoài (đơn giản hóa bằng cách thu menu lại nếu bấm vào chính nó lần nữa ở trên) */}
                      </div>
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
                    <div className="post-actions-divider" />

                    <div className="post-actions-bar">
                      {/* Chủ bài không thấy nút Tham gia */}
                      {isOwner ? (
                        <span className="post-creator-label">✓ Bài viết của bạn</span>
                      ) : (
                        <>
                          <button
                            className="action-btn join-btn"
                            onClick={() => handleJoinPost(post.status_id)}
                            disabled={isJoining}
                          >
                            {isJoining ? 'Đang gửi...' : 'Tham gia'}
                          </button>
                          <button className="action-btn message-btn" onClick={() => handleMessageHost(post.user_id)}>Nhắn tin</button>
                        </>
                      )}
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
