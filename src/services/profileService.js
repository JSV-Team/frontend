const API_BASE_URL = '/api';

export const profileService = {
  // Lấy thông tin profile từ API
  getProfile: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`);
      const data = await response.json();
      if (!response.ok) throw data;
      return data;
    } catch (error) {
      console.error('Lỗi khi lấy profile:', error);
      throw error;
    }
  },

  // Cập nhật thông tin profile
  updateProfile: async (userId, profileData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      const data = await response.json();
      if (!response.ok) throw data;
      return data;
    } catch (error) {
      console.error('Lỗi khi cập nhật profile:', error);
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

// Hàm tiện ích để lưu vào localStorage
export const saveProfileToLocalStorage = (profile) => {
  localStorage.setItem('userProfile', JSON.stringify(profile));
};

// Hàm tiện ích để lấy từ localStorage
export const getProfileFromLocalStorage = () => {
  const saved = localStorage.getItem('userProfile');
  return saved ? JSON.parse(saved) : null;
};

