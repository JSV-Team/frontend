import React, { createContext, useContext, useState, useCallback } from 'react';
import ToastContainer from '../components/Toast/ToastContainer';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((type, message, duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [...prev, { id, type, message, duration }]);
    return id;
  }, []);

  const hideNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const success = useCallback((message, duration) => showNotification('success', message, duration), [showNotification]);
  const error = useCallback((message, duration) => showNotification('error', message, duration), [showNotification]);
  const warning = useCallback((message, duration) => showNotification('warning', message, duration), [showNotification]);

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification, success, error, warning }}>
      {children}
      <ToastContainer notifications={notifications} onClose={hideNotification} />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
