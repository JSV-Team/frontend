import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatePost from '../../components/Post/CreatePost';
import PendingApproval from '../../components/ListWaitingApproval/PendingApproval';
import PendingGroups from '../../components/ListWaitingGroup/PendingGroup';
import NotificationsWidget from '../../components/NotificationsWidget/NotificationsWidget';
import useListPost from '../../hooks/useListPost';
import useNotifications from '../../hooks/useNotifications';
import useCurrentUser, { useCurrentUserId } from '../../hooks/useCurrentUser';
import { Activity, Clock, Settings, Star, MessageSquare, Bell, ChevronRight, MoreHorizontal } from 'lucide-react';
import { motion } from 'motion/react';
import activityService from '../../services/activityService';
import apiConfig from '../../config/apiConfig';
import { buildAvatarUrl } from '../../services/profileService';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const currentUser = useCurrentUser(); // Auto-updates when user changes
  const CURRENT_USER_ID = useCurrentUserId();
  const [reload, setReload] = useState(0);
  const [pendingReload, setPendingReload] = useState(0);
  const [joiningIds, setJoiningIds] = useState(new Set()); // track đang loading join
  const [activeMenuId, setActiveMenuId] = useState(null); // track post menu đang mở

  // FIX: truyền reload vào hook để re-fetch sau khi tạo bài
  const { posts, loading, error } = useListPost(reload);
  const { notifications, unreadCount } = useNotifications(CURRENT_USER_ID);

  const reloadPosts = () => setReload(prev => prev + 1);

  const handleDeletePost = async (activityId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) return;

    try {
      await activityService.deleteActivity(activityId, currentUserId);
      alert('Đã xóa bài viết thành công');
      reloadPosts();
    } catch (err) {
      console.error('Lỗi khi xóa bài viết:', err);
      alert('Lỗi: ' + (err.message || 'Không thể xóa bài viết'));
    }
  };

  const handleJoinPost = async (activityId) => {
    if (joiningIds.has(activityId)) return; // đang xử lý rồi

    setJoiningIds(prev => new Set(prev).add(activityId));
    try {
      const data = await activityService.joinActivity(activityId, CURRENT_USER_ID);

      if (data.message && data.message.includes('thành công')) {
        alert('Đã gửi yêu cầu tham gia! Chờ chủ hoạt động duyệt.');
        setPendingReload(prev => prev + 1);
      } else {
        alert(data.message || 'Tham gia thất bại');
      }
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

  const handleMessageHost = async (hostId, activityId) => {
    if (hostId === CURRENT_USER_ID) return;

    // Kiểm tra quyền nhắn tin (chỉ khi có activityId)
    if (activityId) {
      try {
        const checkRes = await fetch('/api/chat/check-can-message-host', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ activityId, userId: CURRENT_USER_ID }),
        });
        const checkData = await checkRes.json();

        if (!checkRes.ok || !checkData.canMessage) {
          alert(checkData.message || 'Bạn cần được duyệt tham gia hoạt động mới có thể nhắn tin cho host');
          return;
        }
      } catch (err) {
        console.error('Lỗi kiểm tra quyền nhắn tin:', err);
        alert('Lỗi: ' + err.message);
        return;
      }
    }

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
          {/* Left Sidebar - Pending Groups & Approvals */}
          <aside className="home-sidebar">
            {/* <NotificationsWidget userId={CURRENT_USER_ID} /> */}
            <PendingApproval reload={pendingReload} />
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
                        <div className="avatar-container" onClick={() => navigate(`/profile/${post.user_id}`)} style={{ cursor: 'pointer' }}>
                          <div className="avatar-inner">
                            <img
                              src={buildAvatarUrl(post.avatar_url) || 'https://i.pravatar.cc/150?img=1'}
                              alt={post.username || 'User'}
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        </div>
                        <div className="user-info">
                          <div className="user-info-top">
                            <h2
                              onClick={() => navigate(`/profile/${post.user_id}`)}
                              style={{ cursor: 'pointer' }}
                              className="clickable-username"
                            >
                              {post.full_name || post.username || 'Người dùng'}
                            </h2>
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
                            src={buildAvatarUrl(post.image_url)}
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
                          <button
                            className="action-btn message-btn"
                            onClick={() => handleMessageHost(post.user_id, post.status_id)}
                          >
                            Nhắn tin
                          </button>
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
