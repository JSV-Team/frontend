import { useState, useEffect } from 'react';
import { listService } from '../services/listService';

// FIX: nhận thêm tham số reload để re-fetch khi tạo bài mới
function useListPost(reload = 0) {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await listService.getListPost();
        setPosts(data);
      } catch (err) {
        console.error('fetchPosts error:', err);
        setError('Lấy danh sách bài viết thất bại');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [reload]); // FIX: reload là dependency → re-fetch khi thay đổi

  return { posts, error, loading };
}

export default useListPost;