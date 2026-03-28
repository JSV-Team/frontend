import React from 'react';
import Toast from './Toast';
import './Toast.css';

const ToastContainer = ({ notifications, onClose }) => {
  return (
    <div className="toast-container">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          type={notification.type}
          message={notification.message}
          duration={notification.duration}
          onClose={() => onClose(notification.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
