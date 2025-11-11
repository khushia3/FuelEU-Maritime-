import axios from 'axios';

const API_BASE = (import.meta as any).VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 5000,
});

export default api;
