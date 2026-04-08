import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const auth = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data)
};

export const groups = {
  create: (data) => API.post('/groups', data),
  getAll: () => API.get('/groups'),
  getById: (id) => API.get(`/groups/${id}`),
  update: (id, data) => API.put(`/groups/${id}`, data),
  addMember: (id, userId) => API.post(`/groups/${id}/members`, { userId }),
  delete: (id) => API.delete(`/groups/${id}`)
};

export const expenses = {
  create: (data) => API.post('/expenses', data),
  getByGroup: (groupId) => API.get(`/expenses/group/${groupId}`),
  delete: (id) => API.delete(`/expenses/${id}`)
};

export const chat = {
  send: (data) => API.post('/chat', data),
  getByGroup: (groupId) => API.get(`/chat/group/${groupId}`),
  delete: (id, deleteType) => API.delete(`/chat/${id}?deleteType=${deleteType}`)
};

export default API;
