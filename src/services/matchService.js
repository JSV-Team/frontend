// Match Service - API calls related to matching
const API_BASE_URL = '/api';

export const matchService = {
  // Get match suggestions
  getMatchSuggestions: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/match/suggestions`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching match suggestions:', error);
      throw error;
    }
  },

  // Like a profile
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

  // Pass a profile
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

  // Get matches
  getMatches: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/match/matches`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }
  },
};

export default matchService;
