const API_BASE_URL = '/api/reputation';

export const reputationService = {
  getLogs: async (userId, filters = {}) => {
    const { from, to, type } = filters;
    let url = `${API_BASE_URL}/${userId}/logs?`;
    if (from) url += `from=${from}&`;
    if (to) url += `to=${to}&`;
    if (type) url += `type=${type}&`;

    try {
      const response = await fetch(url);
      const result = await response.json();
      if (!response.ok) throw result;
      return result;
    } catch (error) {
      console.error('Lỗi khi lấy lịch sử uy tín:', error);
      throw error;
    }
  },

  getSummary: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${userId}/summary`);
      const result = await response.json();
      if (!response.ok) throw result;
      return result;
    } catch (error) {
      console.error('Lỗi khi lấy tóm tắt uy tín:', error);
      throw error;
    }
  }
};

export default reputationService;
