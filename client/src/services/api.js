// src/services/api.js

import axios from 'axios';

const API_BASE_URL = 'https://agent-management-system.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Automatically attach token if it exists
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default api;