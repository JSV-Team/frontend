// New Profile Service - API calls related to profile
// Using correct backend routes: /api/profile/:userId

const API_BASE_URL = '/api';

const getUserId = () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const userObj = JSON.parse(storedUser);
      return userObj?.user_id || userObj?.id || null;
    } catch (e) { }
  }
  return null;
};

export const profileService = {
  // Lấy thông tin profile từ API
  getProfile: async (userId) => {
    const activeUserId = userId || getUserId();
    if (!activeUserId) throw new Error('No user id');
    
    try {
      const response = await fetch(`${API_BASE_URL}/profile/${activeUserId}`);
      const result = await response.json();
      if (!response.ok) throw result;
      return result.data || result; // Return .data if available
    } catch (error) {
      console.error('Lỗi khi lấy profile:', error);
      throw error;
    }
  },

  // Cập nhật thông tin profile
  updateProfile: async (userId, profileData) => {
    const activeUserId = userId || getUserId();
    if (!activeUserId) throw new Error('No user id');
    
    try {
      const response = await fetch(`${API_BASE_URL}/profile/${activeUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      const result = await response.json();
      if (!response.ok) throw result;
      return result.data || result;
    } catch (error) {
      console.error('Lỗi khi cập nhật profile:', error);
      throw error;
    }
  },

  // Lấy interests
  getInterests: async (userId) => {
    const activeUserId = userId || getUserId();
    if (!activeUserId) throw new Error('No user id');
    
    try {
      const response = await fetch(`${API_BASE_URL}/profile/${activeUserId}/interests`);
      const result = await response.json();
      if (!response.ok) throw result;
      return result.data || result;
    } catch (error) {
      console.error('Lỗi khi lấy interests:', error);
      throw error;
    }
  },

  // Cập nhật interests
  updateInterests: async (userId, interests) => {
    const activeUserId = userId || getUserId();
    if (!activeUserId) throw new Error('No user id');
    
    try {
      const response = await fetch(`${API_BASE_URL}/profile/${activeUserId}/interests`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ interests }),
      });
      const data = await response.json();
      if (!response.ok) throw data;
      return data;
    } catch (error) {
      console.error('Lỗi khi cập nhật interests:', error);
      throw error;
    }
  },

  // Upload ảnh profile
  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`${API_BASE_URL}/upload/avatar`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw data;
      return data;
    } catch (error) {
      console.error('Lỗi khi upload avatar:', error);
      throw error;
    }
  },
};

export default profileService;

// Hàm tiện ích để lưu vào localStorage
export const saveProfileToLocalStorage = (profile) => {
  localStorage.setItem('userProfile', JSON.stringify(profile));
};

// Hàm tiện ích để lấy từ localStorage
export const getProfileFromLocalStorage = () => {
  const saved = localStorage.getItem('userProfile');
  return saved ? JSON.parse(saved) : null;
};

