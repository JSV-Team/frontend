import { useState } from 'react';
import CreatePost from '../../components/Post/CreatePost';
import PendingGroups from '../../components/ListWaitingGroup/PendingGroup';
import useListPost from '../../hooks/useListPost';
import { Activity, Clock, Settings, Star, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import './Home.css';

const CURRENT_USER_ID = 2; // Tạm thời hardcode, thay bằng auth sau

function Home() {
  const [reload, setReload] = useState(0);
  const [pendingReload, setPendingReload] = useState(0);
  const [joiningIds, setJoiningIds] = useState(new Set()); // track đang loading join

  // FIX: truyền reload vào hook để re-fetch sau khi tạo bài
  const { posts, loading, error } = useListPost(reload);

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
      // FIX: reload cả danh sách pending sau khi join
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
        {/* Left Sidebar */}
        <aside className="home-sidebar">

          {/* FIX: Dùng PendingGroups thực thay vì skeleton hardcode */}
          <PendingGroups reload={pendingReload} />
        </aside>

        {/* Main Feed */}
        <div className="home-content">
          <CreatePost onPostCreated={reloadPosts} />

          <div className="posts-section">
            {loading && <p className="loading">Đang tải...</p>}
            {error && <p className="error">{error}</p>}
            {!loading && !error && posts.length === 0 && (
              <p className="no-posts">Chưa có bài viết nào</p>
            )}

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
                        <h2>
                          {post.full_name || post.username || 'Người dùng'}
                          <span className="user-badge">Hoạt động</span>
                          <span className="online-dot" />
                        </h2>
                        <span className="post-time">{getTimeAgo(post.created_at)}</span>
                      </div>
                    </div>
                    <button className="star-button">
                      <Star size={32} />
                    </button>
                  </div>

                  {/* Post info */}
                  <div className="post-media">
                    {post.image_url ? (
                      <img src={post.image_url} alt="Post" />
                    ) : (
                      <span className="post-placeholder">{post.content || 'Hoạt động'}</span>
                    )}
                  </div>

                  {post.extra_content && (
                    <p className="post-content-text">{post.extra_content}</p>
                  )}

                  {/* Post meta: địa điểm, số người */}
                  {(post.location || post.max_participants) && (
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem', justifyContent: 'center' }}>
                      {post.location && <span>📍 {post.location}</span>}
                      {post.max_participants && <span>👥 Tối đa {post.max_participants} người</span>}
                      {post.duration_minutes && <span>⏱ {post.duration_minutes} phút</span>}
                    </div>
                  )}

                  <div className="post-actions">
                    {/* FIX: Chủ bài không thấy nút Tham gia */}
                    {isOwner ? (
                      <span className="post-creator-label">✓ Bài viết của bạn</span>
                    ) : (
                      <button
                        className="btn-join"
                        onClick={() => handleJoinPost(post.status_id)}
                        disabled={isJoining}
                      >
                        {isJoining ? 'Đang gửi...' : 'Tham gia'}
                      </button>
                    )}
                    <button className="btn-message">Nhắn tin</button>
                  </div>
                </div>
              );
            })}
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
