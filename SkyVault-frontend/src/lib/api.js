import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  googleLogin: (token) => api.post('/auth/google', { token }),
  getProfile: () => api.get('/auth/me'),
};

// File APIs
export const fileAPI = {
  uploadFile: (formData, onProgress) =>
    api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
    }),
  getFiles: (folderId) => {
    const params = folderId ? { folder_id: folderId } : {};
    return api.get('/files', { params });
  },
  getRecentFiles: () => api.get('/files/recent'),
  rename: (id, name) => api.patch(`/files/${id}`, { name }),
  move: (id, folder_id) => api.patch(`/files/${id}/move`, { folder_id }),
  delete: (id) => api.delete(`/files/${id}`),
  downloadFile: (id) => api.get(`/files/${id}/download`),
};

// Folder APIs
export const folderAPI = {
  create: (data) => api.post('/folders', data),
  getFolders: (parentId) => {
    const params = parentId ? { parent_id: parentId } : { parent_id: 'root' };
    return api.get('/folders', { params });
  },
  rename: (id, name) => api.patch(`/folders/${id}`, { name }),
  move: (id, parent_id) => api.patch(`/folders/${id}/move`, { parent_id }),
  delete: (id) => api.delete(`/folders/${id}`),
};

// Search API
export const searchAPI = {
  search: (query) => api.get('/search', { params: { q: query } }),
};

// Share APIs
export const shareAPI = {
  shareWithUser: (data) => api.post('/shares', data),
  createPublicLink: (data) => api.post('/link-shares', data),
  getShares: (type, id) => api.get(`/shares/${type}/${id}`),
  revokeShare: (id) => api.delete(`/shares/${id}`),
  deletePublicLink: (id) => api.delete(`/link-shares/${id}`),
  accessPublicLink: (token, password) => api.post(`/link/${token}`, { password }),
};

// Star APIs
export const starAPI = {
  getStarred: () => api.get('/stars'),
  star: (type, id) => api.post('/stars', { type, id }),
  unstar: (type, id) => api.delete(`/stars/${type}/${id}`),
};

// Trash APIs
export const trashAPI = {
  getTrash: () => api.get('/trash'),
  restore: (type, id) => api.post(`/trash/restore/${type}/${id}`),
  permanentDelete: (type, id) => api.delete(`/trash/${type}/${id}`),
  emptyTrash: () => api.delete('/trash/empty'),
};

export default api;