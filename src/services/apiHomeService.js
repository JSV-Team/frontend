// New Home Service - API calls related to home page
import apiConfig from '../config/apiConfig';
const API_BASE_URL = apiConfig.BASE_API || '/api';

// Helper: lấy JWT token từ localStorage
const getToken = () => {
    return localStorage.getItem('token');
};

// Helper: tạo Authorization header
const authHeaders = (extraHeaders = {}) => {
    const token = getToken();
    const headers = { ...extraHeaders };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

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
    try {
      const response = await fetch(`${API_BASE_URL}/activities/pending-activities`, {
            headers: authHeaders()
      });
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
      const response = await fetch(`${API_BASE_URL}/activities/join`, {
        method: 'POST',
        headers: authHeaders({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ activityId }),
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
        headers: authHeaders()
      });
      return await response.json();
    } catch (error) {
      console.error('Error canceling join request:', error);
      throw error;
    }
  },
};

export default apiHomeService;

