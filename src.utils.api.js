import axios from 'axios';
const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const login = (data) => API.post('/auth/login', data);
export const uploadScan = (formData, token) => API.post('/scans/upload', formData, { headers: { Authorization: `Bearer ${token}` } });
export const getScans = (token) => API.get('/scans', { headers: { Authorization: `Bearer ${token}` } });
export const getPDF = (id, token) => API.get(`/scans/pdf/${id}`, { headers: { Authorization: `Bearer ${token}` }, responseType: 'blob' });
