import axios from 'axios';

const api = axios.create({
  baseURL: 'https://hospital-management-system-6w6j.onrender.com/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;
