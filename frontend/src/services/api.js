import axios from 'axios';

// Use environment variable for backend URL
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5262';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor to add JWT token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;