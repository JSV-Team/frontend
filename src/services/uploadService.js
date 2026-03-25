import apiConfig from '../config/apiConfig';
const API_BASE_URL = apiConfig.BASE_API || '/api';

export const uploadService = {
  uploadImage: async (file) => {
    if (!file) {
      throw new Error('Vui lòng chọn file');
    }

    // Kiểm tra kích thước file
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File quá lớn (tối đa 5MB)');
    }

    // Kiểm tra loại file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Chỉ chấp nhận file ảnh (jpg, png, gif, webp)');
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload/image`, {
        method: 'POST',
        body: formData,
      });

      // Lấy response text trước để debug
      const responseText = await response.text();
      
      // Thử parse JSON
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Response text:', responseText);
        throw new Error('Máy chủ trả về lỗi (không phải JSON)');
      }

      if (!response.ok) {
        throw new Error(responseData.message || `HTTP Error: ${response.status}`);
      }

      return responseData;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },
};

export default uploadService;
