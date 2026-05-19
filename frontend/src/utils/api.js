// // 

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

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const applicationAPI = {
  getAll: () => api.get('/applications'),
  getById: (id) => api.get(`/applications/${id}`),
  create: (data) => api.post('/applications', data),
  update: (id, data) => api.put(`/applications/${id}`, data),
};

export const vehicleAPI = {
  getAll: () => api.get('/vehicles'),
  create: (data) => api.post('/vehicles', data),
};

export const privateCustomerAPI = {
  getAll: () => api.get('/private-customers'),
};

export const dealershipCustomerAPI = {
  getAll: () => api.get('/dealership-customers'),
};

export const dealershipAPI = {
  getAll: () => api.get('/dealerships'),
};

export const invoiceAPI = {
  getAll: () => api.get('/invoices'),
  create: (data) => api.post('/invoices', data),
};

export const paymentAPI = {
  getAll: () => api.get('/payments'),
  create: (data) => api.post('/payments', data),
};

export default api;