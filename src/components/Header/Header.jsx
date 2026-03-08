import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, LogOut } from 'lucide-react';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy thông tin user từ localStorage (chỉ chứa dữ liệu login, không cache profile)
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      setCurrentUser(JSON.parse(userString));
    }
  }, [location.pathname]);

  const tabs = [
    { name: 'Home', label: 'Home', path: '/' },
    { name: 'Match', label: 'Ghép đôi', path: '/match' },
    { name: 'Friends', label: 'Bạn bè', path: '/friends' }
  ];

  const handleTabClick = (tab) => {
    navigate(tab.path);
  };

  const getCurrentTab = () => {
    const path = location.pathname;
    if (path === '/') return 'Home';
    if (path === '/match') return 'Match';
    if (path === '/friends') return 'Friends';
    return '';
  };

  const currentTab = getCurrentTab();

  const handleLogout = () => {
    const isConfirm = window.confirm("Bạn có chắc chắn muốn đăng xuất không?");
    if (isConfirm) {
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  // Tạo avatar URL từ user object (đến từ DB lúc login)
  const getAvatarSrc = () => {
    if (!currentUser) return "https://i.pravatar.cc/150?img=11";
    if (currentUser.avatar_url) return currentUser.avatar_url;
    const name = currentUser.full_name || currentUser.username || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <h1>JSV</h1>
        </div>

        <nav className="header-nav">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => handleTabClick(tab)}
              className={`nav-tab ${currentTab === tab.name ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="header-actions">
          <button
            className="notification-btn"
            onClick={() => navigate('/notifications')}
            title="Thông báo"
          >
            <Bell size={24} />
          </button>

          <div className="user-avatar" onClick={() => navigate('/profile/edit')} title="Trang cá nhân">
            <img
              src={getAvatarSrc()}
              alt="User Avatar"
              referrerPolicy="no-referrer"
            />
          </div>

          <button
            className="logout-btn"
            onClick={handleLogout}
            title="Đăng xuất"
          >
            <LogOut size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
