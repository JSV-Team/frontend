const API_BASE_URL = '/api';

export const postService = {
  createPost: async (postData) => {
    const dataToSend = {
      user_id: postData.userId,
      title: postData.title || '',
      description: postData.content || '',
      location: postData.location || '',
      max_participants: postData.maxParticipants || 10,
      duration: postData.duration || 60,
      image_url: postData.imageUrl || ''
    };

    console.log('PostService sending data:', dataToSend);

    try {
      const response = await fetch(`${API_BASE_URL}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      // FIX: response.data không tồn tại trong Fetch API, dùng response.json()
      const responseData = await response.json();
      console.log('API Response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || `HTTP Error: ${response.status}`);
      }

      return responseData;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  },
};

export default postService;
