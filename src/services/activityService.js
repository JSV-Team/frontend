// Activity Service - API calls related to activities
const API_BASE_URL = '/api';

export const activityService = {
  // Get all activities
  getActivities: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/activities`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  },

  // Get pending activities (activities user has requested to join)
  getPendingActivities: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/activities/pending-activities?userId=${userId}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching pending activities:', error);
      throw error;
    }
  },

  // Get activity by ID
  getActivityById: async (activityId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/activities/${activityId}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching activity:', error);
      throw error;
    }
  },

  // Join activity
  joinActivity: async (activityId, userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/activities/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ activityId, userId }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error joining activity:', error);
      throw error;
    }
  },

  // Cancel join request
  cancelJoinRequest: async (requestId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/activities/pending-activities/${requestId}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (error) {
      console.error('Error canceling join request:', error);
      throw error;
    }
  },

  // Delete activity (only owner can delete)
  deleteActivity: async (activityId, userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/activities/${activityId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Không thể xóa bài viết');
      }
      return data;
    } catch (error) {
      console.error('Error deleting activity:', error);
      throw error;
    }
  },
  // Get activities for a specific user
  getUserActivities: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/activities/user/${userId}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching user activities:', error);
      throw error;
    }
  },
};

export default activityService;
