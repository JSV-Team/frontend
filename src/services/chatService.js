// Chat Service - API calls related to conversations
const API_BASE_URL = '/api';

export const chatService = {
  // Lấy danh sách cuộc trò chuyện
  getConversations: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/conversations?userId=${userId}`);
      return await response.json();
    } catch (error) {
      console.error('Lỗi khi lấy danh sách chat:', error);
      throw error;
    }
  },

  // Lấy hoặc tạo cuộc hội thoại 1-1
  getOrInitPrivateChat: async (userId, partnerId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/private`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, partnerId }),
      });
      const data = await response.json();
      if (!response.ok) throw data;
      return data;
    } catch (error) {
      console.error('Lỗi khi khởi tạo chat riêng:', error);
      throw error;
    }
  },

  // Lấy tin nhắn theo conversationId
  getMessages: async (conversationId, userId, limit = 50) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/conversations/${conversationId}/messages?userId=${userId}&limit=${limit}`);
      return await response.json();
    } catch (error) {
      console.error('Lỗi khi lấy tin nhắn:', error);
      throw error;
    }
  },

  // Lấy thành viên nhóm
  getMembers: async (conversationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/conversations/${conversationId}/members`);
      return await response.json();
    } catch (error) {
      console.error('Lỗi khi lấy thành viên:', error);
      throw error;
    }
  },

  // Rời nhóm
  leaveConversation: async (conversationId, userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/conversations/${conversationId}/leave`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      return await response.json();
    } catch (error) {
      console.error('Lỗi khi rời nhóm:', error);
      throw error;
    }
  }
};

export default chatService;
