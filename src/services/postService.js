const API_BASE_URL = '/api/posts';

export const postService = {
  // Tạo bài đăng mới
  createPost: async (userId, postData) => {
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
        reactions: p.reactions || {},
        comments: p.comments || [],
        shares: p.shares || 0
      }));
    } catch (error) {
      console.error('Lỗi khi lấy danh sách bài đăng:', error);
      throw error;
    }
  },

  // Xóa bài đăng (nếu backend hỗ trợ)
  deletePost: async (postId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${postId}`, {
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

      const response = await fetch(`/api/upload/post-media`, {
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
