// 

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const applicationAPI = {
  getAll: () => api.get('/applications'),
  getById: (id) => api.get(`/applications/${id}`),
  create: (data) => api.post('/applications', data),
  updateStatus: (id, status) => api.patch(`/applications/${id}/status`, { status }),
};

export const customerAPI = {
  getPrivate: () => api.get('/customers/private'),
  getDealerships: () => api.get('/customers/dealerships'),
};

export default api;