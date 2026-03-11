import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://hospital-management-system-6w6j.onrender.com/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;
