// Friend Service - API calls related to friends
const API_BASE_URL = '/api';

export const friendService = {
  // Get friends list
  getFriends: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/friends`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching friends:', error);
      throw error;
    }
  },

  // Get friend requests
  getFriendRequests: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/friends/requests`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching friend requests:', error);
      throw error;
    }
  },

  // Send friend request
  sendFriendRequest: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/friends/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error sending friend request:', error);
      throw error;
    }
  },

  // Accept friend request
  acceptFriendRequest: async (requestId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/friends/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error accepting friend request:', error);
      throw error;
    }
  },

  // Reject friend request
  rejectFriendRequest: async (requestId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/friends/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      throw error;
    }
  },

  // Remove friend
  removeFriend: async (friendId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/friends/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ friendId }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error removing friend:', error);
      throw error;
    }
  },
};

export default friendService;
