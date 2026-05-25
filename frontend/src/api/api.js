// 

// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:5000/api', 
// });

// export const applicationAPI = {
//   getAll: () => api.get('/applications'),
//   getById: (id) => api.get(`/applications/${id}`),
//   create: (data) => api.post('/applications', data),
//   updateStatus: (id, status) => api.patch(`/applications/${id}/status`, { status }),
// };

// export const customerAPI = {
//   getPrivate: () => api.get('/customers/private'),
//   getDealerships: () => api.get('/customers/dealerships'),
// };

// export default api;

import axios from 'axios';
const api = axios.create({ baseURL: '/api' });
api.interceptors.request.use(cfg => {
  try {
    const s = localStorage.getItem('fc_user');
    if (s) { const { token } = JSON.parse(s); if (token) cfg.headers.Authorization = `Bearer ${token}`; }
  } catch {}
  return cfg;
});
api.interceptors.response.use(r => r, err => {
  if (err.response?.status === 401) { localStorage.removeItem('fc_user'); window.location.href = '/login'; }
  return Promise.reject(err);
});
export default api;