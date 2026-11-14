import axios from 'axios';

// Connects to your live hosted Spring Boot backend on Render
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://sports-backend-bz2t.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
