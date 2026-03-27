import React, { useState, useEffect } from 'react';
import apiConfig from '../../config/apiConfig';
import { buildAvatarUrl } from '../../services/profileService';

import { useLocation } from 'react-router-dom';
import {
  Search, Eye, Shield, ShieldOff, MoreVertical,
  UserCheck, UserX, Mail, Calendar, Hash
} from 'lucide-react';

const UserManagement = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('search');
    if (q) {
      setSearchQuery(q);
    }
  }, [location.search]);

  // Mock data fallback if backend is empty
  const mockUsers = [
    { id: 1, name: 'Nguyễn Văn Một', email: 'vanc@example.com', status: 'active', joined: '20/02/2026', posts: 15 },
    { id: 2, name: 'Trần Thị Hai', email: 'tranthihai@gmail.com', status: 'active', joined: '15/01/2026', posts: 8 },
    { id: 3, name: 'Lê Văn Ba', email: 'levanba@gmail.com', status: 'banned', joined: '10/12/2025', posts: 3 }
  ];

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiConfig.BASE_API}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success && result.data) {
        const formatted = result.data.map(u => {
          const rawDate = u.created_at || u.Created_at || u.Joined || u.joined_at;
          let dateStr = 'Không rõ';
          if (rawDate) {
            const d = new Date(rawDate);
            if (!isNaN(d.getTime())) {
              dateStr = d.toLocaleDateString('vi-VN');
            }
          }
          return {
            id: u.user_id || u.id,
            name: u.full_name || u.username || u.name,
            email: u.email,
            avatar_url: u.avatar_url,
            status: u.status || 'active',
            joined: dateStr,
            posts: u.posts || 0
          };
        });
        setUsers(formatted);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers(mockUsers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'banned' ? 'active' : 'banned';
    if (!window.confirm(`Bạn có chắc chắn muốn ${newStatus === 'banned' ? 'cấm' : 'bỏ cấm'} người dùng này?`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiConfig.BASE_API}/admin/users/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const result = await response.json();
      if (result.success) {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
    }
  };


  const filteredUsers = users.filter(user => {
    const matchesTab = activeTab === 'All' || user.status.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusLabel = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'Hoạt động';
      case 'banned': return 'Đã cấm';
      default: return status;
    }
  };

  return (
    <div className="user-management">
      <div className="dashboard-header">
        <h2 style={{ fontSize: '24px', fontWeight: '850', marginBottom: '4px', color: '#1e293b' }}>Quản lý User</h2>
        <p style={{ color: 'var(--admin-text-muted)', margin: 0 }}>Quản lý tất cả người dùng trong hệ thống 👋</p>
      </div>

      <div className="admin-filters" style={{ marginTop: '24px' }}>
        <div className="filter-tabs">
          {['All', 'Active', 'Banned'].map(tab => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'All' ? 'Tất cả' : (tab === 'Active' ? 'Hoạt động' : 'Đã cấm')}
            </button>
          ))}
        </div>

        <div className="admin-search">
          <Search size={18} color="var(--admin-text-muted)" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Người dùng</th>
              <th>Trạng thái</th>
              <th>Ngày tham gia</th>
              <th>Bài viết</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>
                  <div className="user-profile-cell">
                    <div className="avatar" style={{
                      backgroundImage: user.avatar_url ? `url(${buildAvatarUrl(user.avatar_url)})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      background: !user.avatar_url ? 'linear-gradient(135deg, #6366f1, #3b82f6)' : 'transparent'
                    }}>
                      {!user.avatar_url && user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="info">
                      <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {user.name}
                        {user.id === 1 && <Shield size={12} color="#3b82f6" fill="#3b82f6" />}
                      </h4>
                      <p style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Mail size={12} /> {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${user.status.toLowerCase()}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    {user.status === 'active' ? <UserCheck size={14} /> : <UserX size={14} />}
                    {getStatusLabel(user.status)}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '13px' }}>
                    <Calendar size={14} /> {user.joined}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', color: '#0f172a' }}>
                    <Hash size={14} color="#94a3b8" /> {user.posts}
                  </div>
                </td>
                <td>
                  <div className="action-btns" style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      className="action-btn-circle" 
                      title="Xem chi tiết"
                      onClick={() => window.location.href = `/profile/${user.username || user.id}`}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className={`action-btn-circle ${user.status === 'banned' ? 'active' : ''}`}
                      title={user.status === 'banned' ? 'Mở cấm người dùng' : 'Cấm người dùng'}
                      onClick={() => handleToggleStatus(user.id, user.status)}
                      style={{ 
                        color: user.status === 'banned' ? '#10b981' : '#ef4444',
                        background: user.status === 'banned' ? '#dcfce7' : '#fee2e2'
                      }}
                    >
                      {user.status === 'banned' ? <ShieldOff size={16} /> : <Shield size={16} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
            Không tìm thấy người dùng nào phù hợp.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
