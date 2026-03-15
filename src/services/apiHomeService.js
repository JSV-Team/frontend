// New Home Service - API calls related to home page
// Backend: /api/activities, /api/pending-activities

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

export const apiHomeService = {
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
    const activeUserId = userId || getUserId();
    try {
      const response = await fetch(`${API_BASE_URL}/activities/pending-activities?userId=${activeUserId}`);
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
    const activeUserId = userId || getUserId();
    try {
      const response = await fetch(`${API_BASE_URL}/activities/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activityId, userId: activeUserId }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error joining activity:', error);
      throw error;
    }
  },

  // Cancel join request / Delete activity request
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
};

export default apiHomeService;

