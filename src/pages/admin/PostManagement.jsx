import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Search, Eye, CheckCircle, Trash2, Image as ImageIcon,
  AlertTriangle, Clock, MapPin, Tag, User, Star, X, AlignLeft, Users
} from 'lucide-react';
import apiConfig from '../../config/apiConfig';

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
    else if (tab === 'pending') matchesTab = (status === 'pending');
    else if (tab === 'removed') matchesTab = (status === 'removed' || status === 'deleted');

    const searchText = searchQuery.toLowerCase();
    const matchesSearch = act.title.toLowerCase().includes(searchText) ||
      (act.user && act.user.toLowerCase().includes(searchText));
    return matchesTab && matchesSearch;
  });

  return (
    <div className="post-management">
      <div className="dashboard-header">
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>Quản lý Bài viết</h2>
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
          const isPending = status === 'pending';
          const isPublished = status === 'published' || status === 'active' || status === 'approved';

          return (
            <div key={act.id} className="post-card">
              <div className="post-card__image" style={{
                backgroundImage: act.image_url ? `url(${act.image_url.startsWith('http') ? act.image_url : apiConfig.API_URL + act.image_url})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}>
                {!act.image_url && <ImageIcon size={40} />}
                <div className={`post-card__status ${isPublished ? 'published' : (isPending ? 'pending' : 'removed')}`}>
                  {isPublished ? 'Đã đăng' : (isPending ? 'Chờ duyệt' : 'Đã gỡ')}
                </div>
              </div>

              <div className="post-card__content">
                <div className="post-card__author">
                  <div className="avatar">
                    {(act.user || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="meta">
                    <h5>{act.user || 'Ẩn danh'}</h5>
                    <span>{act.time || 'Vừa xong'}</span>
                  </div>
                </div>

                <h4 className="post-card__title">{act.title}</h4>

                <div className="post-card__tags">
                  {(act.tags || ['Hoạt động']).map((tag, idx) => (
                    <span key={idx} className="tag-pill">{tag}</span>
                  ))}
                  {act.isFeatured && (
                    <Star size={16} fill="#f59e0b" color="#f59e0b" style={{ marginLeft: '4px' }} />
                  )}
                  {act.reports > 0 && (
                    <span className="report-counter" style={{ marginLeft: '8px' }}>
                      <AlertTriangle size={12} /> {act.reports} báo cáo
                    </span>
                  )}
                </div>
              </div>

              <div className="post-card__actions">
                <button 
                  className="action-btn-full btn-view"
                  onClick={() => setSelectedPost(act)}
                >
                  <Eye size={16} /> Xem
                </button>

                {isRemoved ? (
                  <button
                    className="action-btn-full btn-approve"
                    onClick={() => handleStatusChange(act.id, 'published')}
                  >
                    Khôi phục
                  </button>
                ) : (
                  isPending && (
                    <button
                      className="action-btn-full btn-approve"
                      onClick={() => handleStatusChange(act.id, 'published')}
                    >
                      Duyệt
                    </button>
                  )
                )}

                {!isRemoved && (
                  <button
                    className="action-btn-full btn-remove"
                    title="Gỡ bài viết"
                    onClick={() => handleStatusChange(act.id, 'removed')}
                  >
                    <Trash2 size={16} /> Gỡ
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal View Post */}
      {selectedPost && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '20px'
        }} onClick={() => setSelectedPost(null)}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '650px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative',
            animation: 'modalSlideUp 0.3s ease-out'
          }} onClick={e => e.stopPropagation()}>
            
            {/* Header image (if any) */}
            <div style={{
              width: '100%',
              height: (selectedPost.image || selectedPost.image_url) ? '250px' : '100px',
              background: (selectedPost.image || selectedPost.image_url) 
                ? `url(${(selectedPost.image || selectedPost.image_url).startsWith('http') ? (selectedPost.image || selectedPost.image_url) : apiConfig.API_URL + (selectedPost.image || selectedPost.image_url)}) center/cover`
                : 'linear-gradient(135deg, #f6f8fd 0%, #f1f5f9 100%)',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              position: 'relative'
            }}>
              <button 
                onClick={() => setSelectedPost(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(255,255,255,0.9)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s'
                }}>
                <X size={20} color="#334155" />
              </button>
            </div>

            <div style={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontWeight: 'bold',
                  fontSize: '20px',
                  marginRight: '16px',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                }}>
                  {(selectedPost.user || selectedPost.full_name || 'U').split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>
                    {selectedPost.user || selectedPost.full_name || selectedPost.username || 'Người dùng ẩn danh'}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px', fontSize: '14px', color: '#64748b' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} /> {selectedPost.time || new Date(selectedPost.created_at).toLocaleString('vi-VN') || 'Vừa xong'}
                    </span>
                    {(selectedPost.status || 'pending').toLowerCase() === 'published' ? (
                      <span style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>Đã đăng</span>
                    ) : (selectedPost.status || 'pending').toLowerCase() === 'pending' ? (
                      <span style={{ background: '#fef3c7', color: '#d97706', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>Chờ duyệt</span>
                    ) : (
                      <span style={{ background: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>Đã gỡ</span>
                    )}
                  </div>
                </div>
              </div>

              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '16px', lineHeight: '1.3' }}>
                {selectedPost.title}
              </h2>

              {selectedPost.content && (
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <AlignLeft size={18} color="#64748b" style={{ marginTop: '3px' }}/>
                    <p style={{ margin: 0, color: '#334155', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{selectedPost.content}</p>
                  </div>
                </div>
              )}

              {selectedPost.images && selectedPost.images.length > 1 && (
                <div style={{ display: 'grid', gridTemplateColumns: selectedPost.images.length === 2 ? '1fr' : '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                  {selectedPost.images.slice(1).map((img, idx) => (
                    <img 
                      key={idx} 
                      src={img.startsWith('http') ? img : `${apiConfig.API_URL}${img}`} 
                      alt={`Post image ${idx + 1}`} 
                      style={{ 
                        width: '100%', 
                        borderRadius: '12px', 
                        objectFit: 'cover', 
                        height: selectedPost.images.length === 2 ? 'auto' : '200px', 
                        maxHeight: '400px', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                      }} 
                    />
                  ))}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                {(selectedPost.location || selectedPost.category) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f1f5f9', padding: '12px', borderRadius: '10px' }}>
                    <MapPin size={20} color="#3b82f6" />
                    <div>
                      <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Địa điểm / Danh mục</div>
                      <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '600' }}>{selectedPost.location || selectedPost.category || 'Không xác định'}</div>
                    </div>
                  </div>
                )}
                
                {(selectedPost.max_participants || selectedPost.duration_minutes) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f1f5f9', padding: '12px', borderRadius: '10px' }}>
                    <Users size={20} color="#10b981" />
                    <div>
                      <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Tham gia / Thời lượng</div>
                      <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '600' }}>
                        {selectedPost.max_participants ? `${selectedPost.max_participants} người` : ''} 
                        {selectedPost.max_participants && selectedPost.duration_minutes ? ' • ' : ''}
                        {selectedPost.duration_minutes ? `${selectedPost.duration_minutes} phút` : ''}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {(selectedPost.tags || []).length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                  {selectedPost.tags.map((tag, idx) => (
                    <span key={idx} style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>
                      #{tag}
                    </span>
                  ))}
                  {selectedPost.isFeatured && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fef3c7', color: '#b45309', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
                      <Star size={14} fill="#b45309" /> Nổi bật
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes modalSlideUp {
              from { opacity: 0; transform: translateY(40px) scale(0.95); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}} />
        </div>
      )}
    </div>
  );
};

export default PostManagement;
