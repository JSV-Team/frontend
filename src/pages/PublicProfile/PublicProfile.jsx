import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { profileService } from '../../services/profileService';
import { postService } from '../../services/postService';
import { activityService } from '../../services/activityService';
import { chatService } from '../../services/chatService';
import './PublicProfile.css';

export default function PublicProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const myId = storedUser.user_id || storedUser.id;
  
  const [profile, setProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [userActivities, setUserActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // State for logged-in user interests to calculate commonalities
  const [myInterests, setMyInterests] = useState([]);
  
  // Current user's DailyStatus (if any)
  const [hasStory, setHasStory] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'Vừa xong';
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 84600) return `${Math.floor(diff / 3600)} giờ trước`;
    return `${Math.floor(diff / 86400)} ngày trước`;
  };

  const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Fetch public profile with myId for mutual context
        const targetProfile = await profileService.getPublicProfile(userId, myId);
        setProfile(targetProfile);
        setHasStory(targetProfile.has_story || false);
        
        // 2. Fetch user's posts
        try {
          console.log("Fetching posts for userId:", userId);
          const posts = await postService.getPostsByUserId(userId);
          console.log("Fetched posts:", posts);
          setUserPosts(posts || []);
        } catch (pErr) {
          console.error("Error fetching user posts:", pErr);
          setUserPosts([]);
        }

        // 3. Fetch user's activities
        try {
          const activities = await activityService.getUserActivities(userId);
          setUserActivities(activities || []);
        } catch (aErr) {
          console.error("Error fetching user activities:", aErr);
          setUserActivities([]);
        }

        // 4. Fetch logged-in user's interests for comparison
        if (myId) {
          try {
            const mine = await profileService.getInterests(myId);
            setMyInterests(mine.map(i => typeof i === 'string' ? i : i.name));
          } catch (iErr) {
            console.error("Error fetching my interests:", iErr);
          }
        }

        setError(null);
      } catch (err) {
        console.error("Error loading public profile:", err);
        setError("Không thể tải thông tin người dùng này.");
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const handleStartChat = async (targetId = userId) => {
    if (!myId) {
      alert("Vui lòng đăng nhập để thực hiện chức năng này.");
      return;
    }

    try {
      const conv = await chatService.getOrInitPrivateChat(myId, targetId);
      if (conv && conv.conversation_id) {
        navigate('/friends', { state: { openChatId: conv.conversation_id } });
      }
    } catch (err) {
      console.error("Lỗi khi mở cuộc trò chuyện:", err);
      alert("Đã có lỗi xảy ra khi tạo cuộc hội thoại.");
    }
  };

  const handleJoinActivity = async (activityId) => {
    if (!myId) {
      alert("Vui lòng đăng nhập để tham gia hoạt động.");
      return;
    }

    try {
      setIsJoining(true);
      const data = await activityService.joinActivity(activityId, myId);
      
      if (data.message && data.message.includes('thành công')) {
        alert("Đã gửi yêu cầu tham gia! Chờ chủ hoạt động duyệt.");
      } else {
        alert(data.message || "Không thể gửi yêu cầu tham gia.");
      }
    } catch (err) {
      console.error("Lỗi khi tham gia hoạt động:", err);
      alert(err.message || "Lỗi kết nối khi gửi yêu cầu.");
    } finally {
      setIsJoining(false);
    }
  };

  // Calculate common interests
  const commonInterests = useMemo(() => {
    if (!profile || !profile.interests) return [];
    const targetInterests = profile.interests.map(i => typeof i === 'string' ? i : i.name);
    return targetInterests.filter(i => myInterests.includes(i));
  }, [profile, myInterests]);

  const matchPercentage = useMemo(() => {
    if (!profile || !profile.interests?.length || !myInterests.length) return 0;
    
    // Use Sørensen–Dice coefficient for better mutual matching
    // Formula: (2 * |A ∩ B|) / (|A| + |B|)
    const commonCount = commonInterests.length;
    const totalPossible = profile.interests.length + myInterests.length;
    
    return Math.round((2 * commonCount / totalPossible) * 100);
  }, [commonInterests, profile, myInterests]);

  if (loading) return <div className="pp-loading">Đang tải hồ sơ...</div>;
  if (error) return <div className="pp-error">{error}</div>;
  if (!profile) return <div className="pp-error">Người dùng không tồn tại.</div>;

  return (
    <div className="pp-container">
      {/* 1. Header Section */}
      <div className="pp-header">
        <div className="pp-cover" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1557683311-eac922347aa1?q=80&w=2029&auto=format&fit=crop')` }}></div>
        
        <div className="pp-header-content">
          <div className="pp-avatar-section">
            <div className={`pp-avatar-ring ${hasStory ? 'active-story' : ''}`}>
               <img 
                 src={profile.avatar_url ? (profile.avatar_url.startsWith('http') ? profile.avatar_url : `http://127.0.0.1:3001${profile.avatar_url}`) : 'https://i.pravatar.cc/150'} 
                 alt="Avatar" 
                 className="pp-avatar-img"
               />
               {hasStory && <div className="pp-story-indicator">Story</div>}
            </div>
            <div className="pp-user-info">
              <h1 className="pp-fullname">{profile.full_name}</h1>
              <p className="pp-username">@{profile.username}</p>
              <div className="pp-rep-badge">
                <span className="pp-rep-icon">🏆</span> Uy tín: {profile.reputation_score || 0}
              </div>
            </div>
          </div>

          <div className="pp-actions">
            <button className="pp-btn pp-btn-primary pp-btn-message" onClick={() => handleStartChat()}>Nhắn tin</button>
          </div>
        </div>
      </div>

      {/* 2. Main Body Section */}
      <div className="pp-body">
        <div className="pp-tabs">
          <button className={`pp-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Tổng quan</button>
          <button className={`pp-tab ${activeTab === 'activities' ? 'active' : ''}`} onClick={() => setActiveTab('activities')}>Hoạt động</button>
          <button className={`pp-tab ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => setActiveTab('posts')}>Bài viết</button>
        </div>

        <div className="pp-tab-content">
          {activeTab === 'overview' && (
            <div className="pp-overview">
              {/* Common Interests Section */}
              <div className="pp-card pp-match-card">
                <div className="pp-card-title">Độ tương hợp</div>
                <div className="pp-match-meter">
                  <div className="pp-meter-bg">
                    <div className="pp-meter-fill" style={{ width: `${matchPercentage}%` }}></div>
                  </div>
                  <span className="pp-match-label">{matchPercentage}% Match</span>
                </div>
                {commonInterests.length > 0 ? (
                  <p className="pp-match-text">
                    Bạn và {profile.full_name} đều thích: <b>{commonInterests.join(', ')}</b>
                  </p>
                ) : (
                  <p className="pp-match-text">Hãy thử tìm hiểu xem bạn và {profile.full_name} có chung sở thích nào không nhé!</p>
                )}
              </div>

              {/* Bio & Details */}
              <div className="pp-card">
                <div className="pp-card-title">Tiểu sử</div>
                <p className="pp-bio">{profile.bio || "Người dùng này chưa cập nhật tiểu sử."}</p>
                <div className="pp-details-grid">
                   <div className="pp-detail-item">📍 {profile.location || "Chưa cập nhật địa điểm"}</div>
                   <div className="pp-detail-item">🎂 {profile.dob ? new Date(profile.dob).toLocaleDateString('vi-VN') : "Chưa cập nhật ngày sinh"}</div>
                   <div className="pp-detail-item">📅 Đã tham gia: {new Date(profile.created_at).toLocaleDateString('vi-VN')}</div>
                </div>
              </div>

              {/* Interests Cloud */}
              <div className="pp-card">
                <div className="pp-card-title">Sở thích</div>
                <div className="pp-interests">
                  {profile.interests?.map((interest, idx) => (
                    <span 
                      key={idx} 
                      className={`pp-interest-chip ${myInterests.includes(typeof interest === 'string' ? interest : interest.name) ? 'common' : ''}`}
                    >
                      {typeof interest === 'string' ? interest : interest.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="pp-activities">
               {userActivities.length > 0 ? (
                 <div className="pp-activities-grid">
                   {userActivities.map(activity => (
                     <div key={activity.status_id || activity.activity_id} className="pp-activity-card">
                       <div className="pp-activity-badge">ĐANG THAM GIA</div>
                       <div className="pp-activity-content">
                         <h4 className="pp-activity-title">{activity.content || activity.title}</h4>
                         <div className="pp-activity-details">
                            {activity.location && <span>📍 {activity.location}</span>}
                            {activity.duration_minutes && <span>⏱ {activity.duration_minutes} phút</span>}
                            <span>👥 {activity.participant_count || 0}/{activity.max_participants || '--'}</span>
                         </div>
                         <p className="pp-activity-desc">{activity.extra_content || activity.description || ''}</p>
                       </div>
                       <button className="pp-activity-view-btn" onClick={() => setSelectedActivity(activity)}>Xem chi tiết</button>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="pp-empty-state">Người dùng này chưa tham gia hoạt động nào.</div>
               )}
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="pp-posts">
               {userPosts.length > 0 ? (
                 <div className="pp-posts-feed">
                   {userPosts.map(post => {
                     // Determine if it's an activity or a status based on type
                     const isActivity = post.type === 'activity';
                     
                     return (
                       <div key={post.id} className="post-card">
                         <div className="post-header">
                           <div className="post-user">
                             <div className="avatar-container">
                               <div className="avatar-inner">
                                 <img
                                   src={profile.avatar_url ? (profile.avatar_url.startsWith('http') ? profile.avatar_url : `http://127.0.0.1:3001${profile.avatar_url}`) : 'https://i.pravatar.cc/150'}
                                   alt={profile.username}
                                 />
                               </div>
                             </div>
                             <div className="user-info">
                               <div className="user-info-top">
                                 <h2>{profile.full_name}</h2>
                                 <span className="dot-separator">•</span>
                                 <span className="post-time">{getTimeAgo(post.time)}</span>
                               </div>
                               <div className="user-info-bottom">
                                 <span className="user-badge">{isActivity ? 'HOẠT ĐỘNG' : 'TRẠNG THÁI'}</span>
                                 <span className="dot-separator">•</span>
                                 <span className="online-dot" />
                               </div>
                             </div>
                           </div>
                         </div>

                         <div className="post-content-wrapper">
                           <div className="post-text-content">
                             <h3 className="post-title">{post.title}</h3>
                             {post.desc && <p className="post-description">{post.desc}</p>}
                           </div>

                           {post.image && (
                             <div className="post-media-container">
                               <img
                                 src={post.image.startsWith('http') ? post.image : `http://127.0.0.1:3001${post.image}`}
                                 alt="Post content"
                                 className="post-media-img"
                               />
                             </div>
                           )}
                         </div>

                         {isActivity && (post.location || post.maxParticipants) && (
                           <div className="post-optional-meta">
                             {post.location && <span>📍 {post.location}</span>}
                             {post.maxParticipants && <span>👥 Tối đa {post.maxParticipants} người</span>}
                             {post.duration && <span>⏱ {post.duration} phút</span>}
                           </div>
                         )}

                         <div className="post-actions-divider" />

                          <div className="post-actions-bar">
                            {isActivity ? (
                              <>
                                {(myId && myId.toString() === post.user_id?.toString()) ? (
                                  <span className="post-creator-label">✓ Bài viết của bạn</span>
                                ) : (
                                  <button 
                                    className="action-btn join-btn" 
                                    onClick={() => handleJoinActivity(post.id)}
                                    disabled={isJoining}
                                  >
                                    {isJoining ? 'Đang gửi...' : 'Tham gia'}
                                  </button>
                                )}
                                <button className="action-btn message-btn" onClick={() => handleStartChat(post.user_id)}>Nhắn tin</button>
                              </>
                            ) : (
                              <button className="action-btn message-btn" style={{ flex: 1 }}>Bày tỏ cảm xúc</button>
                            )}
                          </div>
                       </div>
                     );
                   })}
                 </div>
               ) : (
                 <div className="pp-empty-state">Người dùng chưa đăng bài viết nào.</div>
               )}
            </div>
          )}
        </div>
      </div>

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <div className="pp-modal-overlay" onClick={() => setSelectedActivity(null)}>
          <div className="pp-modal" onClick={e => e.stopPropagation()}>
            <button className="pp-modal-close" onClick={() => setSelectedActivity(null)}>✕</button>
            
            <div className="pp-modal-header">
              <div className="pp-activity-badge" style={{ marginBottom: '0.5rem' }}>HOẠT ĐỘNG</div>
              <h2 className="pp-modal-title">{selectedActivity.content || selectedActivity.title}</h2>
            </div>

            <div className="pp-modal-body">
              {(selectedActivity.extra_content || selectedActivity.description) && (
                <p className="pp-modal-desc">{selectedActivity.extra_content || selectedActivity.description}</p>
              )}

              <div className="pp-modal-meta">
                {selectedActivity.location && (
                  <div className="pp-modal-meta-item">
                    <span className="pp-modal-meta-icon">📍</span>
                    <div>
                      <div className="pp-modal-meta-label">Địa điểm</div>
                      <div className="pp-modal-meta-value">{selectedActivity.location}</div>
                    </div>
                  </div>
                )}
                {selectedActivity.duration_minutes && (
                  <div className="pp-modal-meta-item">
                    <span className="pp-modal-meta-icon">⏱</span>
                    <div>
                      <div className="pp-modal-meta-label">Thời lượng</div>
                      <div className="pp-modal-meta-value">{selectedActivity.duration_minutes} phút</div>
                    </div>
                  </div>
                )}
                <div className="pp-modal-meta-item">
                  <span className="pp-modal-meta-icon">👥</span>
                  <div>
                    <div className="pp-modal-meta-label">Số người tham gia</div>
                    <div className="pp-modal-meta-value">{selectedActivity.participant_count || 0} / {selectedActivity.max_participants || '∞'}</div>
                  </div>
                </div>
                {selectedActivity.created_at && (
                  <div className="pp-modal-meta-item">
                    <span className="pp-modal-meta-icon">📅</span>
                    <div>
                      <div className="pp-modal-meta-label">Ngày đăng</div>
                      <div className="pp-modal-meta-value">{new Date(selectedActivity.created_at).toLocaleDateString('vi-VN')}</div>
                    </div>
                  </div>
                )}
              </div>

              {selectedActivity.image_url && (
                <div className="pp-modal-image">
                  <img 
                    src={selectedActivity.image_url.startsWith('http') ? selectedActivity.image_url : `http://127.0.0.1:3001${selectedActivity.image_url}`}
                    alt="Activity"
                  />
                </div>
              )}
            </div>

            <div className="pp-modal-footer">
              <button 
                className="pp-btn pp-btn-primary"
                onClick={() => {
                  handleJoinActivity(selectedActivity.activity_id || selectedActivity.status_id);
                }}
                disabled={isJoining}
              >
                {isJoining ? 'Đang gửi...' : 'Tham gia hoạt động'}
              </button>
              <button 
                className="pp-btn pp-btn-secondary"
                onClick={() => {
                  handleStartChat(selectedActivity.creator_id || selectedActivity.user_id || userId);
                  setSelectedActivity(null);
                }}
              >
                Nhắn tin người tổ chức
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
