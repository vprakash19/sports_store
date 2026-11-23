import axios from 'axios';

// Connects to your live hosted Spring Boot backend on Render
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://sports-backend-bz2t.onrender.com/api',
  timeout: 25000, // 25 seconds timeout to allow for Render cold-starts without hanging indefinitely
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for consistent error handling across the entire application
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Determine friendly message for connection & timeout issues
    if (error.code === 'ECONNABORTED' || (error.message && error.message.toLowerCase().includes('timeout'))) {
      error.friendlyMessage = 'Server took too long to respond. The cloud server may be waking up, please try again in a moment.';
    } else if (!error.response) {
      error.friendlyMessage = 'Unable to connect to the cloud server. Please check your internet connection or try again in a few seconds.';
    } else if (error.response.status === 502 || error.response.status === 503 || error.response.status === 504) {
      error.friendlyMessage = 'The server is temporarily waking up or updating. Please wait a few seconds and try again.';
    }
    return Promise.reject(error);
  }
);

export default api;
