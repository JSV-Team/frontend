import apiConfig from '../config/apiConfig';
const API_BASE_URL = apiConfig.BASE_API || '/api';

export const listService = {
  getListPost: async () => {
    const response = await fetch(`${API_BASE_URL}/activities`);

    if (!response.ok) {
      throw new Error('get list failed');
    }

    return response.json();
  },
};

export default listService;
