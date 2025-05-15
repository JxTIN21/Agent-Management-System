// src/services/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // proxy in package.json will forward to backend
});

// Automatically attach token if it exists
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default api;