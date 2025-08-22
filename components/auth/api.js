import axios from 'axios';
import nookies from 'nookies';

const api = axios.create({
  baseURL: 'https://api.pitchpredictions.com/api', 
});

// Attach token to request headers
api.interceptors.request.use((config) => {
  const cookies = nookies.get();
  if (cookies.token) {
    config.headers.Authorization = `Bearer ${cookies.token}`;
  }
  return config;
});

export default api;
