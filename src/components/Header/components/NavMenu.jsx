import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function NavMenu() {
  const location = useLocation();
  
  const tabs = [
    { name: 'Home', path: '/' },
    { name: 'Ghép đôi', path: '/match' },
    { name: 'Bạn bè', path: '/friends' },
    { name: 'Thông báo', path: '/notifications' }
  ];

  return (
    <nav className="header-nav">
      <div className="nav-tabs no-scrollbar">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`nav-tab ${location.pathname === tab.path ? 'active' : ''}`}
          >
            {tab.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default NavMenu;
