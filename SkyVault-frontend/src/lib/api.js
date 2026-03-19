import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register:    (data) => api.post('/auth/register', data),
  login:       (data) => api.post('/auth/login', data),
  logout:      ()     => api.post('/auth/logout'),
  me:          ()     => api.get('/auth/me'),
  googleLogin: (data) => api.post('/auth/google', data),
};

// ── Folders ───────────────────────────────────────────────────────────────────
// Routes: GET /folders, POST /folders,
//         PATCH /folders/:id/rename, PATCH /folders/:id/move, DELETE /folders/:id
export const folderAPI = {
  getFolders: (parentId) =>
    api.get('/folders', { params: parentId ? { parent_id: parentId } : {} }),
  getFolder:  (id) => api.get(`/folders/${id}`),
  create:     (data) => api.post('/folders', data),
  rename:     (id, name) => api.patch(`/folders/${id}/rename`, { name }),
  move:       (id, parentId) => api.patch(`/folders/${id}/move`, { parent_id: parentId }),
  delete:     (id) => api.delete(`/folders/${id}`),
};

// ── Files ─────────────────────────────────────────────────────────────────────
// Routes: GET /files, GET /files/recent, POST /files/upload,
//         GET /files/:id/download, PATCH /files/:id/rename,
//         PATCH /files/:id/move,   DELETE /files/:id
export const fileAPI = {
  getFiles:       (folderId) =>
    api.get('/files', { params: folderId ? { folder_id: folderId } : {} }),
  getFile:        (id) => api.get(`/files/${id}`),
  getRecentFiles: ()   => api.get('/files/recent'),

  uploadFile: (formData, onUploadProgress) =>
    api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    }),

  downloadFile: (id)       => api.get(`/files/${id}/download`),
  rename:       (id, name) => api.patch(`/files/${id}/rename`, { name }),
  move:         (id, folderId) =>
    api.patch(`/files/${id}/move`, { folder_id: folderId ?? null }),
  delete:       (id) => api.delete(`/files/${id}`),
};

// ── Shares ────────────────────────────────────────────────────────────────────
// Routes: POST /shares, GET /shares/:type/:id, DELETE /shares/:id
//         POST /shares/link, DELETE /shares/link/:id
//         GET  /shares/public/:token
export const shareAPI = {
  getShares:       (type, id) => api.get(`/shares/${type}/${id}`),
  shareWithUser:   (data)     => api.post('/shares', data),
  deleteShare:     (id)       => api.delete(`/shares/${id}`),

  createPublicLink:  (data)    => api.post('/shares/link', data),
  deletePublicLink:  (id)      => api.delete(`/shares/link/${id}`),
  accessPublicLink:  (token, password) =>
    api.get(`/shares/public/${token}`, { params: password ? { password } : {} }),
};

// ── Stars ─────────────────────────────────────────────────────────────────────
// Routes: GET /stars, POST /stars, DELETE /stars/:type/:id
export const starAPI = {
  getStarred: ()           => api.get('/stars'),
  star:       (type, id)   => api.post('/stars', { resource_type: type, resource_id: id }),
  unstar:     (type, id)   => api.delete(`/stars/${type}/${id}`),
};

// ── Trash ─────────────────────────────────────────────────────────────────────
// Routes: GET /trash, POST /trash/restore, DELETE /trash/:type/:id
export const trashAPI = {
  getTrash:        ()          => api.get('/trash'),
  restore:         (type, id)  => api.post('/trash/restore', { resource_type: type, resource_id: id }),
  permanentDelete: (type, id)  => api.delete(`/trash/${type}/${id}`),
  emptyTrash:      ()          => api.delete('/trash/empty'),
};

// ── Search ────────────────────────────────────────────────────────────────────
export const searchAPI = {
  search: (q) => api.get('/search', { params: { q } }),
};

export default api;