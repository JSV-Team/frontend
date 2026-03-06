const API_BASE_URL = '/api';

export const postService = {
  createPost: async (postData) => {
    const dataToSend = {
      title: postData.title || '',
      content: postData.title || '', // backend dùng content
      imageUrl: postData.imageUrl || '',
      description: postData.content || '',
      location: postData.location || '',
      maxParticipants: postData.maxParticipants || 10,
      duration: postData.duration || 60
    };

    console.log('PostService sending data:', dataToSend);

    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
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
