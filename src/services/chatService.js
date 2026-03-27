// Chat Service - API calls related to conversations
import apiConfig from '../config/apiConfig';
const API_BASE_URL = apiConfig.BASE_API || '/api';

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

export const chatService = {
    // Lấy danh sách cuộc trò chuyện
    getConversations: async (userId) => {
        try {
            // Backend dùng verifyToken, nên userId truyền qua Header (token)
            const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
                headers: authHeaders()
            });
            const data = await response.json();
            if (!response.ok) throw data;
            return data;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách chat:', error);
            throw error;
        }
    },

    // Lấy hoặc tạo cuộc hội thoại 1-1
    getOrInitPrivateChat: async (userId, partnerId, activityId = null) => {
        try {
            // Lưu ý: userId thực tế sẽ được backend lấy từ Token (req.user.user_id)
            const response = await fetch(`${API_BASE_URL}/chat/private`, {
                method: 'POST',
                headers: authHeaders({
                    'Content-Type': 'application/json',
                }),
                body: JSON.stringify({
                    partnerId: Number(partnerId),
                    activityId: activityId
                }),
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
    getMessages: async (conversationId, userId, page = 1, limit = 50) => {
        try {
            const response = await fetch(`${API_BASE_URL}/chat/conversations/${conversationId}/messages?page=${page}&limit=${limit}`, {
                headers: authHeaders()
            });
            const data = await response.json();
            if (!response.ok) throw data;
            return data;
        } catch (error) {
            console.error('Lỗi khi lấy tin nhắn:', error);
            throw error;
        }
    },

    // Lấy thành viên nhóm
    getMembers: async (conversationId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/chat/conversations/${conversationId}/members`, {
                headers: authHeaders()
            });
            const data = await response.json();
            if (!response.ok) throw data;
            return data;
        } catch (error) {
            console.error('Lỗi khi lấy thành viên:', error);
            throw error;
        }
    },

    // Rời nhóm
    leaveConversation: async (conversationId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/chat/conversations/${conversationId}/leave`, {
                method: 'PATCH',
                headers: authHeaders()
            });
            const data = await response.json();
            if (!response.ok) throw data;
            return data;
        } catch (error) {
            console.error('Lỗi khi rời nhóm:', error);
            throw error;
        }
    },

    // Đánh dấu đã đọc
    markAsRead: async (conversationId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/chat/conversations/${conversationId}/read`, {
                method: 'PATCH',
                headers: authHeaders()
            });
            const data = await response.json();
            if (!response.ok) throw data;
            return data;
        } catch (error) {
            console.error('Lỗi khi đánh dấu đã đọc:', error);
            throw error;
        }
    },

    // Lấy số tin nhắn chưa đọc
    getUnreadCount: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/chat/unread-count`, {
                headers: authHeaders()
            });
            const data = await response.json();
            if (!response.ok) throw data;
            return data.unread_count || 0;
        } catch (error) {
            console.error('Lỗi khi lấy số tin nhắn chưa đọc:', error);
            return 0;
        }
    }
};

export default chatService;
