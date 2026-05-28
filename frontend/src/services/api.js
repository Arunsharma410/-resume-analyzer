// frontend/src/services/api.js
// 🌐 API Service - Axios instance + auth interceptors

import axios from 'axios';
import { API_URL, STORAGE_KEYS } from '@utils/constants';

// ════════════════════════════════════════════════════════════
// 1️⃣ CREATE AXIOS INSTANCE
// ════════════════════════════════════════════════════════════
const api = axios.create({
  baseURL: API_URL,
  timeout: 90000, // 90s timeout (AI calls can be slow)
  headers: {
    'Content-Type': 'application/json',
  },
});

// ════════════════════════════════════════════════════════════
// 2️⃣ REQUEST INTERCEPTOR - Attach JWT token
// ════════════════════════════════════════════════════════════
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ════════════════════════════════════════════════════════════
// 3️⃣ RESPONSE INTERCEPTOR - Handle 401 (auto-logout)
// ════════════════════════════════════════════════════════════
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🚪 Auto-logout on 401 (expired/invalid token)
    if (error.response?.status === 401) {
      const isAuthEndpoint = error.config?.url?.includes('/auth/login') ||
                             error.config?.url?.includes('/auth/register');

      // Don't redirect if user is just trying to login (wrong credentials)
      if (!isAuthEndpoint) {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        // Use full page reload to clear all state
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }

    // 🪵 Log errors in development
    if (import.meta.env.DEV) {
      console.error('❌ API Error:', error.response?.data || error.message);
    }

    return Promise.reject(error);
  }
);

// ════════════════════════════════════════════════════════════
// 4️⃣ AUTH API ENDPOINTS
// ════════════════════════════════════════════════════════════
export const authAPI = {
  register:       (data)     => api.post('/auth/register', data),
  login:          (data)     => api.post('/auth/login', data),
  getMe:          ()         => api.get('/auth/me'),
  updateProfile:  (data)     => api.put('/auth/update-profile', data),
  changePassword: (data)     => api.put('/auth/change-password', data),
  deleteAccount:  (password) => api.delete('/auth/delete-account', { data: { password } }),
  getStats:       ()         => api.get('/auth/dashboard-stats'),
};

// ════════════════════════════════════════════════════════════
// 5️⃣ ANALYSIS API ENDPOINTS
// ════════════════════════════════════════════════════════════
export const analysisAPI = {
  // 🤖 Run AI analysis (multipart form data)
  analyze: (formData, onUploadProgress) =>
    api.post('/analysis/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    }),

  // 📋 Get all analyses (with filters)
  getAll: (params = {}) =>
    api.get('/analysis', { params }),

  // 🔍 Get single analysis
  getById: (id) =>
    api.get(`/analysis/${id}`),

  // ✏️ Update analysis (title/rating)
  update: (id, data) =>
    api.put(`/analysis/${id}`, data),

  // 🗑️ Delete analysis
  delete: (id) =>
    api.delete(`/analysis/${id}`),

  // 📊 Dashboard stats
  getDashboardStats: () =>
    api.get('/analysis/stats/dashboard'),

  // 📈 Trends data
  getTrends: (days = 7) =>
    api.get('/analysis/stats/trends', { params: { days } }),
};

// ════════════════════════════════════════════════════════════
// 6️⃣ RESUME API (upload only - optional)
// ════════════════════════════════════════════════════════════
export const resumeAPI = {
  upload: (formData, onUploadProgress) =>
    api.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    }),
  checkLimit: () => api.get('/resume/check-limit'),
};

// Default export = the axios instance (for custom calls)
export default api;