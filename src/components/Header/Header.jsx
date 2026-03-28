import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import useNotifications from '../../hooks/useNotifications';
import useUnreadMessages from '../../hooks/useUnreadMessages';
import { buildAvatarUrl } from '../../services/profileService';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('Home');
  const { theme, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const { unreadCount: unreadMessagesCount } = useUnreadMessages();

  // Lấy thông tin user từ localStorage (chỉ chứa dữ liệu login, không cache profile)
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Function to load user from localStorage
    const loadUser = () => {
      const userString = localStorage.getItem('user');
      if (userString && userString !== 'undefined') {
        try {
          setCurrentUser(JSON.parse(userString));
        } catch (e) {
          console.error("Header: Error parsing user", e);
        }
      }
    };

    // Load initially
    loadUser();

    // Listen for custom 'userUpdated' event from EditProfile
    window.addEventListener('userUpdated', loadUser);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('userUpdated', loadUser);
    };
  }, []);

  const tabs = [
    { name: 'Home', label: 'Home', path: '/home' },
    { name: 'Match', label: 'Ghép đôi', path: '/match' },
    { name: 'Friends', label: 'Bạn bè', path: '/friends' }
  ];

  const handleTabClick = (tab) => {
    navigate(tab.path);
  };

  const getCurrentTab = () => {
    const path = location.pathname;
    if (path === '/home' || path === '/') return 'Home';
    if (path === '/match') return 'Match';
    if (path === '/friends') return 'Friends';
    if (path === '/notifications') return 'Notifications';
    return '';
  };

  const currentTab = getCurrentTab();

  // BƯỚC 2: Hàm xử lý Đăng xuất
  const handleLogout = () => {
    // Hỏi nhẹ một câu cho chắc chắn, tránh lỡ tay bấm nhầm
    const isConfirm = window.confirm("Bạn có chắc chắn muốn đăng xuất không?");
    if (isConfirm) {
      // Clear all localStorage data
      localStorage.removeItem("user"); // Tịch thu vé
      localStorage.removeItem("token"); // Thu hồi mã xác thực
      localStorage.removeItem("role"); // Clear role
      
      // Force reload to clear all state and disconnect sockets
      window.location.href = "/login";
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="header-logo">
            <h1 onClick={() => navigate("/")}>VibeMatch</h1>
          </div>

          <nav className="header-nav desktop-only">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => handleTabClick(tab)}
                className={`nav-tab ${currentTab === tab.name ? 'active' : ''}`}
                style={{ position: 'relative' }}
              >
                {tab.label}
                {tab.name === 'Friends' && unreadMessagesCount > 0 && (
                  <span className="nav-tab-badge">
                    {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="header-actions">
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title={theme === 'light' ? 'Chuyển sang tối' : 'Chuyển sang sáng'}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <button
              className={`notification-btn desktop-only ${currentTab === 'Notifications' ? 'active' : ''}`}
              onClick={() => navigate('/notifications')}
              title="Thông báo"
              style={{ position: 'relative' }}
            >
              <Bell size={24} />
              {unreadCount > 0 && (
                <span className="notification-badge">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <div className="user-avatar" onClick={() => {
              const username = currentUser?.username;
              if (username) navigate(`/profile/${username}`);
            }} title="Trang cá nhân">
              <img
                src={buildAvatarUrl(currentUser?.avatar_url) || (currentUser ? `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.full_name || currentUser.username || 'User')}&background=random` : "https://i.pravatar.cc/150?img=11")}
                alt="User Avatar"
                referrerPolicy="no-referrer"
              />
            </div>

            <button
              className="logout-btn desktop-only"
              onClick={handleLogout}
              title="Đăng xuất"
            >
              <LogOut size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => handleTabClick(tab)}
            className={`mobile-nav-item ${currentTab === tab.name ? 'active' : ''}`}
          >
            <div className="mobile-nav-icon-wrapper">
              {tab.name === 'Home' && (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              )}
              {tab.name === 'Match' && (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              )}
              {tab.name === 'Friends' && (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              )}
              {tab.name === 'Friends' && unreadMessagesCount > 0 && (
                <span className="mobile-nav-badge">
                  {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                </span>
              )}
            </div>
            <span className="mobile-nav-label">{tab.label}</span>
          </button>
        ))}
        
        <button
          onClick={() => navigate('/notifications')}
          className={`mobile-nav-item ${currentTab === 'Notifications' ? 'active' : ''}`}
        >
          <div className="mobile-nav-icon-wrapper">
            <Bell size={24} />
            {unreadCount > 0 && (
              <span className="mobile-nav-badge">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <span className="mobile-nav-label">Thông báo</span>
        </button>

        <button
          onClick={handleLogout}
          className="mobile-nav-item"
        >
          <LogOut size={24} />
          <span className="mobile-nav-label">Thoát</span>
        </button>
      </nav>
    </>
  );
}

export default Header;