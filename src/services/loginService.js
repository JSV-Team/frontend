import axios from 'axios';
import apiConfig from '../config/apiConfig';
const API_BASE_URL = apiConfig.BASE_API || '/api';

export const loginService = {
    login: async (identifier, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Báo cho BE biết mình gửi dữ liệu JSON
                },
                body: JSON.stringify({ identifier, password }) // Đóng gói dữ liệu
            });

            // Chuyển kết quả từ chuỗi JSON thành Object
            const data = await response.json();

            // Nếu Backend trả về mã lỗi (400, 401, 403, 500)
            if (!response.ok) {
                // Ném lỗi ra để thằng Login.jsx hứng lấy và hiển thị lên màn hình
                throw data; 
            }

            // Nếu thành công (200 OK)
            // data sẽ chứa { success, message, data (user), token }
            return {
                success: data.success,
                user: data.data,
                token: data.token
            }; 
        } catch (error) {
            console.error('Lỗi khi gọi API login:', error);
            throw error;
        }
    }
};
