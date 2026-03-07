const API_BASE_URL = 'http://localhost:3001/api';

export const loginService = {
  loginUser: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: email,
          password: password,
        }),
      });

      const responseData = await response.json();
      console.log('Login response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || `HTTP Error: ${response.status}`);
      }

      // Lưu token vào localStorage
      if (responseData.data) {
        localStorage.setItem('user', JSON.stringify(responseData.data));
      }

      return responseData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logoutUser: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default loginService;
