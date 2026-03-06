import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// BƯỚC 1: Import thêm icon LogOut từ thư viện lucide-react của bạn
import { Bell, LogOut } from 'lucide-react';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('Home');

  // Tạo State để chứa thông tin người dùng
  const [currentUser, setCurrentUser] = useState(null);

  // Mở két sắt lấy thông tin một cách an toàn khi Header vừa xuất hiện
  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      setCurrentUser(JSON.parse(userString));
    }
  }, []);

  const tabs = [
    { name: 'Home', label: 'Home', path: '/' },
    { name: 'Match', label: 'Ghép đôi', path: '/match' },
    { name: 'Friends', label: 'Bạn bè', path: '/friends' }
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab.name);
    navigate(tab.path);
  };

  const getCurrentTab = () => {
    const path = location.pathname;
    if (path === '/') return 'Home';
    if (path === '/match') return 'Match';
    if (path === '/friends') return 'Friends';
    return 'Home';
  };

  const currentTab = getCurrentTab();

  // BƯỚC 2: Hàm xử lý Đăng xuất
  const handleLogout = () => {
    // Hỏi nhẹ một câu cho chắc chắn, tránh lỡ tay bấm nhầm
    const isConfirm = window.confirm("Bạn có chắc chắn muốn đăng xuất không?");
    if (isConfirm) {
      localStorage.removeItem("user"); // Tịch thu vé
      navigate("/login"); // Đuổi ra cửa
    }
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

          <div className="user-avatar" onClick={() => navigate('/profile')} title="Trang cá nhân">
            {/* Thay ảnh cứng bằng ảnh động từ DB, nếu lỗi hoặc chưa có thì dùng ảnh dự phòng */}
            <img
              src={currentUser?.avatar_url
                ? (currentUser.avatar_url.startsWith('http') ? currentUser.avatar_url : currentUser.avatar_url)
                : (currentUser ? `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.full_name || currentUser.username || 'User')}&background=random` : "https://i.pravatar.cc/150?img=11")}
              alt="User Avatar"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* BƯỚC 3: Giao diện Nút Đăng xuất nằm cạnh Avatar */}
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