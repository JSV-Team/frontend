import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Search, Eye, CheckCircle, Trash2, Image as ImageIcon,
  AlertTriangle, Clock, MapPin, Tag, User, Star
} from 'lucide-react';

const PostManagement = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);

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
      const response = await fetch('http://localhost:3001/api/admin/activities', { 
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
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/admin/activities/${id}/status`, {
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
          {['All', 'Published', 'Pending', 'Removed'].map(tab => (
            <button 
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'All' ? 'Tất cả' : (tab === 'Published' ? 'Đã đăng' : (tab === 'Pending' ? 'Chờ duyệt' : 'Đã gỡ'))}
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
              <div className="post-card__image">
                <ImageIcon size={40} />
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
                <button className="action-btn-full btn-view">
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

      {filteredActivities.length === 0 && (
        <div style={{ padding: '60px', textAlign: 'center', background: '#fff', borderRadius: '20px', marginTop: '24px', border: '1px solid var(--admin-border)' }}>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '15px' }}>Không tìm thấy bài viết nào.</p>
        </div>
      )}
    </div>
  );
};

export default PostManagement;
