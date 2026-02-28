// hooks/useCreatePost.js
import { useState } from 'react';
import { postService } from '../services/postService';

function useCreatePost(onSuccess) {
  // lưu trạng thái đang đăng bài hay không
  const [loading, setLoading] = useState(false);

  // lưu lỗi (nếu có)
  const [error, setError] = useState(null);

  // hàm đăng bài
  const createPost = async (content) => {
    // nếu người dùng chưa nhập gì thì thôi
    if (!content || !content.title) {
      setError('Vui lòng nhập tiêu đề');
      return;
    }

    try {
      setLoading(true);     // bắt đầu đăng bài
      setError(null);       // reset lỗi

      console.log('Sending post data:', content);
      // gọi API đăng bài
      const response = await postService.createPost(content);
      console.log('Post created successfully:', response);

      // báo cho Home biết: "đăng xong rồi"
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      // nếu lỗi thì lưu lỗi lại
      console.error('Create post error:', err);
      setError(err.message || 'Đăng bài thất bại');
    } finally {
      // đăng xong (thành công hay thất bại đều chạy)
      setLoading(false);
    }
  };

  // trả ra cho component dùng
  return {
    createPost,
    loading,
    error,
  };
}

export default useCreatePost;