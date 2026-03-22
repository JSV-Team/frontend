// Notification Service - API calls related to notifications
const API_BASE_URL = '/api';

const getUserId = () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser && storedUser !== "undefined") {
    try {
      const userObj = JSON.parse(storedUser);
      return userObj?.user_id || userObj?.id || null;
    } catch (e) { }
  }
  return null;
};

export const notificationService = {
  // Get all notifications cho user hiện tại
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

  // Get notifications by user ID
  getNotificationsByUserId: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications?userId=${userId}`);
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Server error ${response.status}: ${errText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Get unread notifications count
  getUnreadCount: async (userId) => {
    try {
      const activeUserId = userId || getUserId();
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
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Server error ${response.status}: ${errText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (userId) => {
    try {
      const activeUserId = userId || getUserId();
      if (!activeUserId) return;

      const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: activeUserId }),
      });
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Server error ${response.status}: ${errText}`);
      }
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
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Server error ${response.status}: ${errText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },
};

export default notificationService;
