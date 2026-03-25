// Central API configuration
const API_URL = import.meta.env.VITE_API_URL || 
                (window.location.hostname.includes('vercel.app') 
                  ? 'https://backend-1wyh.onrender.com' 
                  : 'http://localhost:3001');

export default {
  API_URL,
  BASE_API: `${API_URL}/api`,
  UPLOAD_URL: `${API_URL}/uploads`
};
