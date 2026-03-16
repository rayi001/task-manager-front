import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://task-manager-back-two.vercel.app' || 'https://task-manager-back-omega.vercel.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable credentials for CORS
});

// Add request interceptor to handle CORS
api.interceptors.request.use(
  (config) => {
    // Add any required headers here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors better
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      error.message = 'Network error. Please check if the backend is running and accessible.';
    } else if (error.code === 'ECONNREFUSED') {
      error.message = 'Connection refused. The backend server may be down.';
    }
    return Promise.reject(error);
  }
);

export default api;
