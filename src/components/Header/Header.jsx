import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import './Header.css';
function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('Home');
  const { theme, toggleTheme } = useTheme();

  // Lấy thông tin user từ localStorage (chỉ chứa dữ liệu login, không cache profile)
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Function to load user from localStorage
    const loadUser = () => {
      const userString = localStorage.getItem('user');
      if (userString) {
        setCurrentUser(JSON.parse(userString));
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
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <h1 onClick={() => navigate("/")}>VibeMatch</h1>
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
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Chuyển sang tối' : 'Chuyển sang sáng'}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <button
            className={`notification-btn ${currentTab === 'Notifications' ? 'active' : ''}`}
            onClick={() => navigate('/notifications')}
            title="Thông báo"
          >
            <Bell size={24} />
          </button>

          <div className="user-avatar" onClick={() => {
            const userId = currentUser?.user_id || currentUser?.id || currentUser?.USER_ID;
            navigate(`/profile/${userId}`);
          }} title="Trang cá nhân">
            <img
              src={currentUser?.avatar_url
                ? (currentUser.avatar_url.startsWith('http') ? currentUser.avatar_url : currentUser.avatar_url)
                : (currentUser ? `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.full_name || currentUser.username || 'User')}&background=random` : "https://i.pravatar.cc/150?img=11")}
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