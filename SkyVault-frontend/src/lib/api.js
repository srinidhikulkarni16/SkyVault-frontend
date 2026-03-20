import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api

export const authAPI = {
  login:       (data) => api.post('/auth/login', data),
  register:    (data) => api.post('/auth/register', data),
  googleLogin: (data) => api.post('/auth/google', data),
  getProfile:  ()     => api.get('/auth/me'),
}

export const fileAPI = {
  getFiles:       (folderId) => api.get('/files', { params: { folder_id: folderId || null } }),
  getRecentFiles: ()         => api.get('/files/recent'),
  uploadFile:     (formData, onUploadProgress) =>
    api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    }),
  downloadFile: (id)       => api.get(`/files/${id}/download`),
  renameFile:   (id, data) => api.patch(`/files/${id}/rename`, data),
  moveFile:     (id, data) => api.patch(`/files/${id}/move`, data),
  deleteFile:   (id)       => api.delete(`/files/${id}`),
}

export const folderAPI = {
  getFolders:   (parentId) => api.get('/folders', { params: { parent_id: parentId || null } }),
  createFolder: (data)     => api.post('/folders', { ...data, parent_id: data.parent_id || null }),
  renameFolder: (id, data) => api.patch(`/folders/${id}/rename`, data),
  moveFolder:   (id, data) => api.patch(`/folders/${id}/move`, data),
  deleteFolder: (id)       => api.delete(`/folders/${id}`),
}

export const starAPI = {
  getStarred: ()         => api.get('/stars'),
  star:   (type, id) => api.post('/stars', { resource_type: type, resource_id: id }),
  unstar: (type, id) => api.delete(`/stars/${type}/${id}`),
}

export const trashAPI = {
  getTrash: () => api.get('/trash'),
  restore: (type, id) => api.post('/trash/restore', {
    resource_type: type,
    resource_id:   id,
    type,
    id,
  }),
  permanentDelete: (type, id) => api.delete(`/trash/${type}/${id}`),
  emptyTrash: () => api.delete('/trash/empty'),
}

export const shareAPI = {
  getShares:        (type, id) => api.get(`/shares/${type}/${id}`),
  shareWithUser:    (data)     => api.post('/shares', data),
  createPublicLink: (data)     => api.post('/shares/link', data),
  deleteShare:      (id)       => api.delete(`/shares/${id}`),
  deletePublicLink: (id)       => api.delete(`/shares/link/${id}`),
  accessPublicLink: (token, pwd) =>
    api.post(`/shares/public/${token}`, pwd ? { password: pwd } : {}),
}