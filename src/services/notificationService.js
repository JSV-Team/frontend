// Notification Service - API calls related to notifications
// Sử dụng userId = 2 cho test (tạm thời chưa có login)
const API_BASE_URL = '/api';
const USER_ID = 2; // User ID test

export const notificationService = {
  // Get all notifications cho user hiện tại
  getNotifications: async (userId = USER_ID) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications?userId=${userId}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Get notifications by user ID
  getNotificationsByUserId: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications?userId=${userId}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Get unread notifications count
  getUnreadCount: async (userId = USER_ID) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/unread/count?userId=${userId}`);
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
  markAllAsRead: async (userId = USER_ID) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
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

export default notificationService;
