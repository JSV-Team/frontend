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
  
  // Lấy thông tin public profile của user khác
  getPublicProfile: async (userId, myId) => {
    try {
      const url = myId 
        ? `${API_BASE_URL}/profile/${userId}?myId=${myId}` 
        : `${API_BASE_URL}/profile/${userId}`;
      const response = await fetch(url);
      const result = await response.json();
      if (!response.ok) throw result;
      return result.data || result;
    } catch (error) {
      console.error('Lỗi khi lấy public profile:', error);
      throw error;
    }
  },

  // Cập nhật thông tin profile
  updateProfile: async (userId, profileData) => {
    const activeUserId = userId || getUserId();
    if (!activeUserId) throw new Error('No user id');
    
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Vui lòng đăng nhập để cập nhật profile');
    
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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
      // The backend does not have a specific GET /profile/:id/interests route.
      // We will fetch the full profile and extract the 'interests' property from it.
      const response = await fetch(`${API_BASE_URL}/profile/${activeUserId}`);
      const result = await response.json();
      if (!response.ok) throw result;
      
      const profileData = result.data || result;
      // Trả về thuộc tính interests nếu có, không thì trả rỗng mảng
      return profileData.interests || [];
    } catch (error) {
      console.error('Lỗi khi lấy interests:', error);
      throw error;
    }
  },

  // Cập nhật interests
  updateInterests: async (userId, interests) => {
    const activeUserId = userId || getUserId();
    if (!activeUserId) throw new Error('No user id');
    
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Vui lòng đăng nhập để cập nhật sở thích');
    
    try {
      // Note: Backend defines 'PUT /api/profile/interests' that requires auth middleware headers
      const response = await fetch(`${API_BASE_URL}/profile/interests`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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
    const token = localStorage.getItem('token');
    
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/upload/avatar`, {
        method: 'POST',
        headers: headers,
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

  // Theo dõi người dùng
  followUser: async (userId, myId) => {
    if (!myId) throw new Error('Vui lòng đăng nhập để theo dõi');
    try {
      const response = await fetch(`${API_BASE_URL}/profile/${userId}/follow`, {
        method: 'POST',
        headers: {
          'x-auth-user-id': myId.toString()
        }
      });
      
      const contentType = response.headers.get('content-type');
      let result;
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Lỗi Server (${response.status}): ${text.slice(0, 100)}...`);
      }
      
      if (!response.ok) throw result;
      return result;
    } catch (error) {
      console.error('Lỗi khi theo dõi:', error);
      throw error;
    }
  },

  // Bỏ theo dõi người dùng
  unfollowUser: async (userId, myId) => {
    if (!myId) throw new Error('Vui lòng đăng nhập để bỏ theo dõi');
    try {
      const response = await fetch(`${API_BASE_URL}/profile/${userId}/unfollow`, {
        method: 'DELETE',
        headers: {
          'x-auth-user-id': myId.toString()
        }
      });
      
      const contentType = response.headers.get('content-type');
      let result;
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Lỗi Server (${response.status}): ${text.slice(0, 100)}...`);
      }
      
      if (!response.ok) throw result;
      return result;
    } catch (error) {
      console.error('Lỗi khi bỏ theo dõi:', error);
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

