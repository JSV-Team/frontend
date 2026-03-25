// Central API configuration
// PRODUCTION: Always use backend URL
const API_URL = import.meta.env.VITE_API_URL || 'https://backend-1wyh.onrender.com';

export default {
  API_URL,
  BASE_API: `${API_URL}/api`,
  UPLOAD_URL: `${API_URL.replace(/\/$/, '')}/uploads`
};
