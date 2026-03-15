// New Notification Service - API calls related to notifications
// Backend: /api/notifications

const API_BASE_URL = '/api';

const getUserId = () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const userObj = JSON.parse(storedUser);
      return userObj?.user_id || userObj?.id || null;
    } catch (e) { }
  }
  return null;
};

export const apiNotificationService = {
  // Get all notifications for current user
  getNotifications: async (userId) => {
    const activeUserId = userId || getUserId();
    try {
      if (!activeUserId) throw new Error('No user id');
      const response = await fetch(`${API_BASE_URL}/notifications?userId=${activeUserId}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Get unread notifications count
  getUnreadCount: async (userId) => {
    const activeUserId = userId || getUserId();
    try {
      if (!activeUserId) return 0;
      const response = await fetch(`${API_BASE_URL}/notifications/unread/count?userId=${activeUserId}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (userId) => {
    const activeUserId = userId || getUserId();
    try {
      if (!activeUserId) return;
      const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: activeUserId }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },
};

export default apiNotificationService;

