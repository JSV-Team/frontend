// Match Service - API calls related to interest-based matching
const API_BASE_URL = '/api';

// Helper to get JWT token from localStorage
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  return token || localStorage.getItem('authToken');
};

// Helper to get user ID from localStorage
const getUserId = () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const userObj = JSON.parse(storedUser);
      return userObj?.user_id || userObj?.id || null;
    } catch (e) {
      console.error('Error parsing user from localStorage:', e);
    }
  }
  return null;
};

// Helper for fetch with auth headers
const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  const result = await response.json();
  
  if (!response.ok) {
    throw result;
  }
  return result;
};

export const matchService = {
  // Join interest-based matching queue
  // POST /api/match/join
  joinQueue: async (interests = []) => {
    try {
      const userId = getUserId();
      const payload = {
        userId,
        interests,
      };
      
      const result = await fetchWithAuth(`${API_BASE_URL}/match/join`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      
      return result;
    } catch (error) {
      console.error('Error joining match queue:', error);
      throw error;
    }
  },

  // Cancel interest-based matching search
  // POST /api/match/cancel
  cancelSearch: async () => {
    try {
      const userId = getUserId();
      
      const result = await fetchWithAuth(`${API_BASE_URL}/match/cancel`, {
        method: 'POST',
        body: JSON.stringify({ userId }),
      });
      
      return result;
    } catch (error) {
      console.error('Error canceling match search:', error);
      throw error;
    }
  },

  // Get match history
  // GET /api/match/history
  getMatchHistory: async () => {
    try {
      const result = await fetchWithAuth(`${API_BASE_URL}/match/history`, {
        method: 'GET',
      });
      
      return result;
    } catch (error) {
      console.error('Error fetching match history:', error);
      throw error;
    }
  },

  // Get match statistics (admin)
  // GET /api/match/stats
  getMatchStats: async () => {
    try {
      const result = await fetchWithAuth(`${API_BASE_URL}/match/stats`, {
        method: 'GET',
      });
      
      return result;
    } catch (error) {
      console.error('Error fetching match stats:', error);
      throw error;
    }
  },

  // Get match suggestions (legacy)
  getMatchSuggestions: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/match/suggestions`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching match suggestions:', error);
      throw error;
    }
  },

  // Like a profile (legacy)
  likeProfile: async (profileId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/match/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profileId }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error liking profile:', error);
      throw error;
    }
  },

  // Pass a profile (legacy)
  passProfile: async (profileId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/match/pass`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profileId }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error passing profile:', error);
      throw error;
    }
  },

  // Get matches (legacy)
  getMatches: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/match/matches`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }
  },

  // Get match queue based on interests (legacy)
  getMatchQueue: async (interests) => {
    try {
      const response = await fetch(`${API_BASE_URL}/match/queue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ interests }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching match queue:', error);
      throw error;
    }
  },

  // Leave interest-based matching queue (legacy)
  leaveQueue: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/match/queue/leave`, {
        method: 'POST',
      });
      return await response.json();
    } catch (error) {
      console.error('Error leaving queue:', error);
      throw error;
    }
  },

  // Get queue status (legacy)
  getQueueStatus: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/match/queue/status`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching queue status:', error);
      throw error;
    }
  },
};

export default matchService;
