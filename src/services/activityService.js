// Activity Service - API calls related to activities
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

export const activityService = {
  // Get all activities
  getActivities: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/activities`, {
        headers: authHeaders()
      });
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
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Không thể tải danh sách chờ');
      return data;
    } catch (error) {
      console.error('Error fetching pending activities:', error);
      throw error;
    }
  },

  // Get pending approvals (requests from others to join user's activities)
  getPendingApprovals: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/activities/pending-approvals`, {
            headers: authHeaders()
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Không thể tải các yêu cầu xin tham gia');
      return data;
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
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
        headers: authHeaders()
      });
      return await response.json();
    } catch (error) {
      console.error('Error canceling join request:', error);
      throw error;
    }
  },

  // Process activity request (approve/reject)
  processActivityRequest: async (requestId, action) => {
    try {
      const endpoint = `${API_BASE_URL}/activities/pending-activities/${requestId}/${action}`;
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: authHeaders()
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Lỗi xử lý yêu cầu');
      }
      return data;
    } catch (error) {
        console.error(`Error processing activity request (${action}):`, error);
        throw error;
    }
  },

  // Delete activity (only owner can delete)
  deleteActivity: async (activityId, userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/activities/${activityId}`, {
        method: 'DELETE',
        headers: authHeaders({
          'Content-Type': 'application/json',
        })
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
      const response = await fetch(`${API_BASE_URL}/activities/user/${userId}`, {
        headers: authHeaders()
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching user activities:', error);
      throw error;
    }
  },
};

export default activityService;
