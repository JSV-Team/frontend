import apiConfig from '../config/apiConfig';
import { buildAvatarUrl } from './apiProfileService';
const API_BASE_URL = `${apiConfig.BASE_API}/posts`;

export const postService = {
  // Tạo bài đăng mới
  createPost: async (userIdOrData, maybeData) => {
    let postData;
    
    // Handle flexible arguments
    if (maybeData === undefined) {
      postData = userIdOrData;
    } else {
      postData = maybeData;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });
      const data = await response.json();
      if (!response.ok) throw data;
      return data;
    } catch (error) {
      console.error('Lỗi khi tạo bài đăng:', error);
      throw error;
    }
  },

  // Tạo trạng thái mới (cho trang Profile) - lưu vào DailyStatus
  createStatus: async (postData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });
      const data = await response.json();
      if (!response.ok) throw data;
      return data;
    } catch (error) {
      console.error('Lỗi khi tạo trạng thái:', error);
      throw error;
    }
  },


  // Lấy danh sách bài đăng của user
  getPostsByUserId: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${userId}`);
      const data = await response.json();
      if (!response.ok) throw data;


      // Map backend fields to frontend fields
      return data.map(p => ({
        id: p.post_id || p.activity_id || p.status_id,
        user_id: p.user_id || p.creator_id,
        username: p.username,
        full_name: p.full_name,
        title: p.title || p.content,
        desc: p.description || p.extra_content || '',
        location: p.location || '',
        duration: p.duration_minutes || null,
        maxParticipants: p.max_participants || null,
        time: new Date(p.created_at).toLocaleString(),
        image: buildAvatarUrl(p.image_url),
        reactions: { like: p.reactions_count || 0 }, // Simplified for now
        comments: Array(p.comments_count || 0).fill({}), // Just to show the count
        shares: p.shares_count || 0,
        type: p.post_type || 'activity'
      }));
    } catch (error) {
      console.error('Lỗi khi lấy danh sách bài đăng:', error);
      throw error;
    }
  },

  // Xóa bài đăng (nếu backend hỗ trợ)
  deletePost: async (postId, userId, type = 'activity') => {
    try {
      const token = localStorage.getItem('token');
      const url = type === 'status' ? `${API_BASE_URL}/status/${postId}` : `${API_BASE_URL}/${postId}`;
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw data;
      }
      return true;
    } catch (error) {
      console.error('Lỗi khi xóa bài đăng:', error);
      throw error;
    }
  },



  // Upload nhiều ảnh bài đăng
  uploadPostMedia: async (files) => {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('media', file);
      });

      const token = localStorage.getItem('token');
      const response = await fetch(`${apiConfig.BASE_API}/upload/post-media`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw data;
      // Backend returns { success: true, data: { files: [{url: '...'}, ...], count: X } }
      return data.data.files.map(f => f.url);
    } catch (error) {
      console.error('Lỗi khi upload ảnh bài đăng:', error);
      throw error;
    }
  }
};
