import React from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import useNotifications from '../../hooks/useNotifications';
import './NotificationsWidget.css';

// simple widget showing most recent notifications and unread badge
function NotificationsWidget({ userId = 2, maxItems = 5 }) {
  const {
    notifications,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
  } = useNotifications(userId);

  const newest = notifications.slice(0, maxItems);

  return (
    <div className="notifications-widget">
      <div className="notifications-widget-header">
        <div className="notifications-widget-title">
          <Bell size={18} />
          <h4>Thông báo</h4>
        </div>
        {notifications.filter(n => !n.is_read).length > 0 && (
          <span className="unread-badge">
            {notifications.filter(n => !n.is_read).length}
          </span>
        )}
      </div>

      {loading && <p className="notifications-empty-text">Đang tải...</p>}
      {error && (
        <div className="notifications-error small">
          <p>Không thể tải thông báo</p>
          <button onClick={refreshNotifications} className="retry-button small">
            Thử lại
          </button>
        </div>
      )}

      {!loading && !error && newest.length === 0 && (
        <p className="notifications-empty-text">Chưa có thông báo</p>
      )}

      {!loading && !error && newest.length > 0 && (
        <div className="notifications-list-widget">
          {newest.map(n => (
            <div key={n.notification_id} className={`notifications-item ${n.is_read ? 'read' : 'unread'}`}>
              <span className="notification-text" title={n.content}>{n.content}</span>
            </div>
          ))}
        </div>
      )}

      <Link to="/notifications" className="see-all-notifications">
        Xem tất cả
        <span>&#x2192;</span>
      </Link>
    </div>
  );
}

export default NotificationsWidget;