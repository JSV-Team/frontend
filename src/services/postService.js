import apiConfig from '../config/apiConfig';
const API_BASE_URL = `${apiConfig.BASE_API}/posts`;

export const postService = {
  // Tạo bài đăng mới
  createPost: async (userIdOrData, maybeData) => {
    let userId, postData;
    
    // Handle flexible arguments to fix NULL creator_id issue
    if (maybeData === undefined) {
      // If called with 1 arg: createPost(postDataWithUserId)
      userId = userIdOrData?.userId || 2;
      postData = userIdOrData;
    } else {
      // If called with 2 args: createPost(userId, postData) 
      userId = userIdOrData;
      postData = maybeData;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
  createStatus: async (userId, postData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/status/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
        title: p.title || p.content,
        desc: p.description || p.extra_content || '',
        location: p.location || '',
        duration: p.duration_minutes || null,
        maxParticipants: p.max_participants || null,
        time: new Date(p.created_at).toLocaleString(),
        image: p.image_url || null,
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
      const baseUrl = type === 'status' ? `${API_BASE_URL}/status/${postId}` : `${API_BASE_URL}/${postId}`;
      const url = `${baseUrl}?userId=${userId}`;
      const response = await fetch(url, {
        method: 'DELETE',
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

      const response = await fetch(`${apiConfig.BASE_API}/upload/post-media`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw data;
      return data.urls; // Mảng các URLs
    } catch (error) {
      console.error('Lỗi khi upload ảnh bài đăng:', error);
      throw error;
    }
  }
};
