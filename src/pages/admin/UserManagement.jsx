import React, { useState, useEffect } from 'react';
import { 
  Search, Eye, Shield, ShieldOff, MoreVertical,
  UserCheck, UserX, Mail, Calendar, Hash
} from 'lucide-react';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  // Mock data fallback if backend is empty
  const mockUsers = [
    { id: 1, name: 'Nguyễn Văn Một', email: 'vanc@example.com', status: 'active', joined: '20/02/2026', posts: 15 },
    { id: 2, name: 'Trần Thị Hai', email: 'tranthihai@gmail.com', status: 'active', joined: '15/01/2026', posts: 8 },
    { id: 3, name: 'Lê Văn Ba', email: 'levanba@gmail.com', status: 'banned', joined: '10/12/2025', posts: 3 },
    { id: 4, name: 'Phạm Minh Bốn', email: 'phamminhbon@gmail.com', status: 'pending', joined: '05/03/2026', posts: 0 }
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        if (result.success && result.data && result.data.length > 0) {
          // Format data to match our UI
          const formatted = result.data.map(u => ({
            id: u.user_id,
            name: u.full_name || u.username,
            email: u.email,
            status: u.status, // active, banned, pending
            joined: new Date(u.created_at).toLocaleDateString('vi-VN'),
            posts: Math.floor(Math.random() * 20) // Mock post count for now
          }));
          setUsers(formatted);
        } else {
          setUsers(mockUsers);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers(mockUsers);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesTab = activeTab === 'All' || user.status.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusLabel = (status) => {
    switch(status.toLowerCase()) {
      case 'active': return 'Hoạt động';
      case 'banned': return 'Đã cấm';
      case 'pending': return 'Chờ duyệt';
      default: return status;
    }
  };

  return (
    <div className="user-management">
      <div className="dashboard-header">
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>Quản lý User</h2>
        <p style={{ color: 'var(--admin-text-muted)', margin: 0 }}>Quản lý tất cả người dùng trong hệ thống 👋</p>
      </div>

      <div className="admin-filters" style={{ marginTop: '24px' }}>
        <div className="filter-tabs">
          {['All', 'Active', 'Banned', 'Pending'].map(tab => (
            <button 
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'All' ? 'Tất cả' : (tab === 'Active' ? 'Hoạt động' : (tab === 'Banned' ? 'Đã cấm' : 'Chờ duyệt'))}
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
                    <div className="avatar">
                      {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="info">
                      <h4>{user.name}</h4>
                      <p>{user.email}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${user.status.toLowerCase()}`}>
                    {getStatusLabel(user.status)}
                  </span>
                </td>
                <td>{user.joined}</td>
                <td style={{ fontWeight: '600' }}>{user.posts}</td>
                <td>
                  <div className="action-btns">
                    <button className="action-btn" title="Xem chi tiết"><Eye size={16} /></button>
                    <button className="action-btn" title={user.status === 'banned' ? 'Bỏ cấm' : 'Cấm người dùng'}>
                      {user.status === 'banned' ? <Shield size={16} /> : <ShieldOff size={16} />}
                    </button>
                    <button className="action-btn delete" title="Xóa tài khoản"><UserX size={16} /></button>
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
