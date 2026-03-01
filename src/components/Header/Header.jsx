import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('Home');

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
          <div className="user-avatar" onClick={() => navigate('/profile')}>
            <img
              src="https://picsum.photos/seed/user1/100/100"
              alt="User Avatar"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
