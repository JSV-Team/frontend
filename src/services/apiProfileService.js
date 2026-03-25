// New Profile Service - API calls related to profile
// Using correct backend routes: /api/profile

const API_BASE_URL = '/api';

// Helper: lấy JWT token từ localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper: tạo Authorization header
const authHeaders = (extraHeaders = {}) => {
  const token = getToken();
  const headers = { ...extraHeaders };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const getUserId = () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser && storedUser !== "undefined") {
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
      const loggedInUserId = getUserId();
      let url = `${API_BASE_URL}/profile/${activeUserId}`;
      let options = {};

      // Nếu đang lấy profile của chính mình, phải dùng auth route để lấy email chi tiết
      if (String(activeUserId) === String(loggedInUserId)) {
        url = `${API_BASE_URL}/profile`;
        options = { headers: authHeaders() };
      }

      const response = await fetch(url, options);
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
  // Backend route: PUT /api/profile (KHÔNG có :userId, dùng verifyToken lấy userId từ JWT)
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
      // GET /api/profile/:userId/interests là public route
      const response = await fetch(`${API_BASE_URL}/profile/${activeUserId}/interests`);
      const result = await response.json();
      if (!response.ok) throw result;

      // Backend trả về { success, data: [...] }
      return result.data || result;
    } catch (error) {
      console.error('Lỗi khi lấy interests:', error);
      throw error;
    }
  },

  // Cập nhật interests
  // Backend route: PUT /api/profile/interests (dùng verifyToken)
  updateInterests: async (userId, interests) => {
    const activeUserId = userId || getUserId();
    if (!activeUserId) throw new Error('No user id');

    const token = localStorage.getItem('token');
    if (!token) throw new Error('Vui lòng đăng nhập để cập nhật sở thích');

    try {
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

  // Lấy tất cả sở thích có trong hệ thống
  getAllAvailableInterests: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/all-interests`);
      const result = await response.json();
      if (!response.ok) throw result;
      return result.data || result;
    } catch (error) {
      console.error('Lỗi khi lấy tất cả sở thích:', error);
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
  // Backend route: POST /api/profile/:userId/follow (dùng verifyToken)
  followUser: async (userId, myId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/${userId}/follow`, {
        method: 'POST',
        headers: authHeaders(),
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
  // Backend route: DELETE /api/profile/:userId/unfollow (dùng verifyToken)
  unfollowUser: async (userId, myId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/${userId}/unfollow`, {
        method: 'DELETE',
        headers: authHeaders(),
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

  // Đổi mật khẩu
  // Backend route: PUT /api/profile/password (dùng verifyToken)
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/password`, {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw data;
      return data;
    } catch (error) {
      console.error('Lỗi khi đổi mật khẩu:', error);
      throw error;
    }
  },
};

export default profileService;

/**
 * Build URL đầy đủ từ avatar_url (có thể là tương đối hoặc tuyệt đối).
 * Dùng VITE_API_URL nếu có, fallback về window.location.origin.
 */
export const buildAvatarUrl = (url) => {
  if (!url) return null;

  // Step 1: Clean contaminated URLs from DB (leftovers from localhost testing)
  let cleanUrl = url;
  if (url.includes('127.0.0.1:3001')) {
    cleanUrl = url.split('127.0.0.1:3001')[1];
  } else if (url.includes('localhost:3001')) {
    cleanUrl = url.split('localhost:3001')[1];
  }

  // Step 2: If it's already a valid absolute production URL, return it
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    // Force HTTPS if the page is on HTTPS to avoid Mixed Content
    if (window.location.protocol === 'https:' && cleanUrl.startsWith('http:')) {
      return cleanUrl.replace('http:', 'https:');
    }
    return cleanUrl;
  }

  // Step 3: Use VITE_API_URL or dynamic origin to build full URL
  // We remove '/api' suffix as uploads are served from root
  const base = (import.meta.env?.VITE_API_URL || '').replace(/\/api$/, '') || window.location.origin;
  
  // Join base and cleanUrl safely
  const finalUrl = `${base.replace(/\/$/, '')}/${cleanUrl.replace(/^\//, '')}`;
  
  // Force HTTPS on production
  if (window.location.protocol === 'https:' && finalUrl.startsWith('http:')) {
    return finalUrl.replace('http:', 'https:');
  }
  
  return finalUrl;
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
