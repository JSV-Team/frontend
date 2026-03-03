const API_BASE_URL = '/api';

// Profile Service - API calls related to user profile
export const profileService = {
  // Update user profile
  updateProfile: async (profileData) => {
    const dataToSend = {
      fullName: profileData.fullName || '',
      gender: profileData.gender || 'Khác',
      dobISO: profileData.dobISO || '',
      dobText: profileData.dobText || '',
      email: profileData.email || '',
      interests: profileData.interests || []
    };

    console.log('ProfileService sending data:', dataToSend);

    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const responseData = await response.json();
      console.log('Profile API Response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || `HTTP Error: ${response.status}`);
      }

      return responseData;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile`);
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || `HTTP Error: ${response.status}`);
      }
      
      return responseData;
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  }
};

export default profileService;

