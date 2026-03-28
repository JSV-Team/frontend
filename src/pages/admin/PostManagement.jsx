import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Search, Eye, CheckCircle, Trash2, Image as ImageIcon,
  AlertTriangle, Clock, MapPin, Tag, User, Star, X, AlignLeft, Users
} from 'lucide-react';
import apiConfig from '../../config/apiConfig';
import { buildAvatarUrl } from '../../services/profileService';


const PostManagement = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('search');
    if (q) {
      setSearchQuery(q);
    }
  }, [location.search]);

  // Mock data fallback if backend is empty
  const mockActivities = [
    {
      id: 1,
      user: 'Nguyễn Văn A',
      time: '31 phút trước',
      title: 'Tìm bạn chơi bóng đá f8',
      tags: ['Thể thao'],
      isFeatured: true,
      category: 'Thể thao',
      status: 'published',
      reports: 0,
      image: null
    },
    {
      id: 2,
      user: 'Trần Thị B',
      time: '2 giờ trước',
      title: 'Nhóm học tiếng Anh cuối tuần',
      tags: ['Học tập'],
      isFeatured: false,
      category: 'Học tập',
      status: 'published',
      reports: 2,
      image: null
    },
    {
      id: 3,
      user: 'Lê Văn C',
      time: '5 giờ trước',
      title: 'Đi phượt Đà Lạt tháng 4',
      tags: ['Du lịch', 'Khám phá'],
      isFeatured: false,
      category: 'Du lịch',
      status: 'pending',
      reports: 0,
      image: null
    },
    {
      id: 4,
      user: 'Phạm Minh Bốn',
      time: '1 ngày trước',
      title: 'Workshop lập trình React',
      tags: ['Công nghệ', 'Lập trình'],
      isFeatured: false,
      category: 'Công nghệ',
      status: 'removed',
      reports: 12,
      image: null
    }
  ];

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiConfig.BASE_API}/admin/activities`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success && result.data && result.data.length > 0) {
        setActivities(result.data);
      } else {
        setActivities(mockActivities);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
      setActivities(mockActivities);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    if (val.trim()) {
      const filtered = activities
        .filter(act => act.title.toLowerCase().includes(val.toLowerCase()))
        .slice(0, 5); // Limit to 5 suggestions
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (title) => {
    setSearchQuery(title);
    setShowSuggestions(false);
  };

  const handleStatusChange = async (id, newStatus) => {
    // Confirm action before proceeding
    const actionText = newStatus === 'published' ? 'khôi phục' : (newStatus === 'removed' ? 'gỡ' : 'duyệt');
    if (!window.confirm(`Bạn có chắc chắn muốn ${actionText} bài viết này không?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiConfig.BASE_API}/admin/activities/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const result = await response.json();
      if (result.success) {
        // Update local state to move the item
        setActivities(prev => prev.map(act =>
          act.id === id ? { ...act, status: newStatus } : act
        ));
      }
    } catch (error) {
      console.error("Error updating status:", error);
      // Fallback: update local state anyway if it's mock
      setActivities(prev => prev.map(act =>
        act.id === id ? { ...act, status: newStatus } : act
      ));
    }
  };

  const filteredActivities = activities.filter(act => {
    const status = (act.status || 'pending').toLowerCase();
    const tab = activeTab.toLowerCase();

    let matchesTab = false;
    if (tab === 'all') matchesTab = true;
    else if (tab === 'published') matchesTab = (status === 'published' || status === 'active' || status === 'approved');
    else if (tab === 'removed') matchesTab = (status === 'removed' || status === 'deleted');

    const searchText = searchQuery.toLowerCase();
    const matchesSearch = act.title.toLowerCase().includes(searchText) ||
      (act.user && act.user.toLowerCase().includes(searchText));
    return matchesTab && matchesSearch;
  });

  return (
    <div className="post-management">
      <div className="dashboard-header">
        <h2 style={{ fontSize: '24px', fontWeight: '850', marginBottom: '4px', color: '#1e293b' }}>Quản lý Bài viết</h2>
        <p style={{ color: 'var(--admin-text-muted)', margin: 0 }}>Duyệt và quản lý các hoạt động trong hệ thống 👋</p>
      </div>

      <div className="admin-filters" style={{ marginTop: '24px' }}>
        <div className="filter-tabs">
          {['All', 'Published', 'Removed'].map(tab => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'All' ? 'Tất cả' : (tab === 'Published' ? 'Đã đăng' : 'Đã gỡ')}
            </button>
          ))}
        </div>

        <div className="admin-search" style={{ position: 'relative' }}>
          <Search size={18} color="var(--admin-text-muted)" />
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />

          {showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions">
              {suggestions.map(s => (
                <div
                  key={s.id}
                  className="suggestion-item"
                  onClick={() => selectSuggestion(s.title)}
                >
                  <Search size={14} style={{ marginRight: '10px' }} />
                  <span>{s.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="post-grid">
        {filteredActivities.map(act => {
          const status = (act.status || 'pending').toLowerCase();
          const isRemoved = status === 'removed' || status === 'deleted';
          const isPublished = status === 'published' || status === 'active' || status === 'approved';

          return (
            <div key={act.id} className="post-card-premium">
              <div className="post-card__image" style={{
                background: (act.image_url || (act.images && act.images[0])) 
                  ? `url(${buildAvatarUrl(act.image_url || act.images[0])}) center/cover no-repeat` 
                  : 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
                position: 'relative',
                height: '200px'
              }}>
                {!(act.image_url || (act.images && act.images[0])) && <ImageIcon size={44} color="#94a3b8" />}
                <div className={`status-badge-premium ${isPublished ? 'published' : 'removed'}`}>
                  {isPublished ? 'Đang hoạt động' : 'Đã gỡ bỏ'}
                </div>
              </div>

              <div className="post-card__content">
                <div className="author-row">
                  <div className="avatar-mini" style={{
                    background: act.avatar_url 
                      ? `url(${buildAvatarUrl(act.avatar_url)}) center/cover no-repeat, linear-gradient(135deg, #6366f1, #3b82f6)` 
                      : 'linear-gradient(135deg, #6366f1, #3b82f6)'
                  }}>
                  </div>
                  <div className="author-info">
                    <h5 className="author-name">{act.user || 'Người dùng'}</h5>
                    <div className="post-time">
                       <Clock size={12} /> {act.time || 'Vừa xong'}
                    </div>
                  </div>
                </div>

                <h4 className="post-title-modern" title={act.title}>{act.title}</h4>

                <div className="tag-container-modern">
                  {(act.tags || ['Hoạt động']).slice(0, 2).map((tag, idx) => (
                    <span key={idx} className={`modern-tag ${(tag === 'Hoạt động' || tag === 'Activity') ? 'active' : ''}`}>{tag}</span>
                  ))}
                  {act.reports > 0 && (
                    <span className="modern-tag report">
                      <AlertTriangle size={12} /> {act.reports}
                    </span>
                  )}
                </div>
              </div>

              <div className="post-card__actions-premium">
                <button
                  className="btn-premium btn-view-more"
                  onClick={() => setSelectedPost(act)}
                >
                  <Eye size={18} /> Chi tiết
                </button>

                {isRemoved ? (
                  <button
                    className="btn-premium btn-restore-action"
                    onClick={() => handleStatusChange(act.id, 'published')}
                    title="Khôi phục bài viết"
                  >
                    <CheckCircle size={18} />
                  </button>
                ) : (
                  <button
                    className="btn-premium btn-remove-action"
                    onClick={() => handleStatusChange(act.id, 'removed')}
                    title="Gỡ bài viết"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal View Post (Giữ nguyên logic cũ nhưng cập nhật style nếu cần) */}
      {selectedPost && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px'
        }} onClick={() => setSelectedPost(null)}>
          <div style={{
            background: 'white', borderRadius: '32px', width: '100%', maxWidth: '680px', maxHeight: '90vh',
            overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative', animation: 'modalSlideUp 0.3s ease-out'
          }} onClick={e => e.stopPropagation()}>

            <div style={{
              height: (selectedPost.image_url || (selectedPost.images && selectedPost.images[0])) ? '300px' : '150px',
              background: (selectedPost.image_url || (selectedPost.images && selectedPost.images[0]))
                ? `url(${buildAvatarUrl(selectedPost.image_url || selectedPost.images[0])}) center/cover` : '#f1f5f9',
              position: 'relative', borderTopLeftRadius: '32px', borderTopRightRadius: '32px'
            }}>
              <button onClick={() => setSelectedPost(null)} className="close-modal-premium">
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', gap: '16px' }}>
                <div style={{
                  width: '60px', height: '60px', borderRadius: '20px',
                  background: selectedPost.avatar_url ? `url(${buildAvatarUrl(selectedPost.avatar_url)}) center/cover` : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  boxShadow: '0 8px 16px rgba(59, 130, 246, 0.2)'
                }} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#1e293b' }}>
                    {selectedPost.user || 'Người dùng ẩn danh'}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', fontSize: '14px', color: '#64748b' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} /> {selectedPost.time || 'vừa xong'}
                    </span>
                    <span style={{ 
                      background: (selectedPost.status || 'pending').toLowerCase() === 'published' ? '#dcfce7' : '#fee2e2', 
                      color: (selectedPost.status || 'pending').toLowerCase() === 'published' ? '#10b981' : '#ef4444', 
                      padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase'
                    }}>
                      {(selectedPost.status || 'pending').toLowerCase() === 'published' ? 'Đang hiển thị' : 'Đã gỡ'}
                    </span>
                  </div>
                </div>
              </div>

              <h2 style={{ fontSize: '26px', fontWeight: '850', color: '#0f172a', marginBottom: '16px', lineHeight: '1.4' }}>
                {selectedPost.title}
              </h2>

              {selectedPost.content && (
                <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '20px', marginBottom: '24px', border: '1px solid #eef2f6' }}>
                  <p style={{ margin: 0, color: '#334155', lineHeight: '1.7', whiteSpace: 'pre-wrap', fontSize: '15.5px' }}>{selectedPost.content}</p>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div className="modal-info-box">
                  <MapPin size={20} color="#3b82f6" />
                  <div>
                    <div className="label">Vị trí</div>
                    <div className="value">{selectedPost.location || 'Bất kỳ đâu'}</div>
                  </div>
                </div>
                <div className="modal-info-box">
                  <Tag size={20} color="#10b981" />
                  <div>
                    <div className="label">Chủ đề</div>
                    <div className="value">{selectedPost.category || 'Hoạt động'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .post-card-premium {
          background: #fff;
          border-radius: 28px;
          border: 1px solid #f1f5f9;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
        }
        .post-card-premium:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 40px -10px rgba(0,0,0,0.1);
          border-color: #e2e8f0;
        }
        .status-badge-premium {
          position: absolute;
          top: 16px; right: 16px;
          padding: 6px 14px;
          border-radius: 99px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          backdrop-filter: blur(8px);
        }
        .status-badge-premium.published { background: rgba(220, 252, 231, 0.9); color: #10b981; }
        .status-badge-premium.removed { background: rgba(254, 226, 226, 0.9); color: #ef4444; }

        .post-card__content { padding: 24px; flex: 1; }
        .author-row { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        .avatar-mini { width: 40px; height: 40px; border-radius: 12px; }
        .author-name { margin: 0; font-size: 15px; font-weight: 700; color: #1e293b; }
        .post-time { font-size: 12px; color: #94a3b8; display: flex; align-items: center; gap: 4px; }
        
        .post-title-modern {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 16px 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          height: 50px;
        }

        .tag-container-modern { display: flex; flex-wrap: wrap; gap: 8px; }
        .modern-tag {
          padding: 4px 12px; border-radius: 8px; font-size: 12px; font-weight: 600;
          background: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0;
        }
        .modern-tag.active { 
          background: #dcfce7; color: #16a34a; border-color: #bbf7d0; 
        }
        .modern-tag.report { background: #fee2e2; color: #ef4444; border-color: #fecaca; display: flex; align-items: center; gap: 4px; }

        .post-card__actions-premium {
          padding: 16px 24px;
          background: #f8fafc;
          border-top: 1px solid #f1f5f9;
          display: flex; gap: 12px;
        }
        .btn-premium {
          height: 44px; border-radius: 14px; border: none; font-weight: 700; font-size: 13px;
          display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: all 0.2s;
        }
        .btn-view-more { flex: 1; background: #fff; color: #1e293b; border: 1px solid #e2e8f0; }
        .btn-view-more:hover { background: #f1f5f9; border-color: #cbd5e1; transform: scale(1.02); }
        
        .btn-remove-action { width: 44px; background: #fee2e2; color: #ef4444; }
        .btn-remove-action:hover { background: #fecaca; transform: scale(1.05); }
        
        .btn-restore-action { width: 44px; background: #dcfce7; color: #10b981; }
        .btn-restore-action:hover { background: #bbf7d0; transform: scale(1.05); }

        .modal-info-box {
          display: flex; align-items: center; gap: 12px; background: #f8fafc; padding: 16px; border-radius: 16px; border: 1px solid #eef2f6;
        }
        .modal-info-box .label { font-size: 11px; color: #94a3b8; font-weight: 700; text-transform: uppercase; }
        .modal-info-box .value { font-size: 14px; color: #1e293b; font-weight: 700; }

        .close-modal-premium {
          position: absolute; top: 20px; right: 20px; width: 40px; height: 40px;
          background: rgba(255,255,255,0.9); border: none; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1); z-index: 20; color: #1e293b;
        }

        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default PostManagement;
