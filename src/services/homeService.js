// Home Service - API calls related to home page
import apiConfig from '../config/apiConfig';
const API_BASE_URL = apiConfig.BASE_API || '/api';

export const homeService = {
  // Get home page data
  getHomeData: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/home`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching home data:', error);
      throw error;
    }
  },
};

export default homeService;
