import axios from 'axios';
import { GateParams, ReportParams, StoredUser } from '../types';
import { decryptData } from '../utils/crypto';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem('b');
  if (storedUser) {
    const user: StoredUser = JSON.parse(decryptData(storedUser));
    if (user.d) {
      config.headers.Authorization = `Bearer ${user.d}`;
    }
  }
  return config;
});

api.interceptors.response.use((response) => {
  if (response.data && typeof response.data === 'string') {
    try {
      response = decryptData(response.data);
    } catch (e) {
    }
  }
  return response;
});

export const getTrafficData = (params: ReportParams) => {
  return api.get('/lalins', {
    params,
  });
};

export const getGates = (params: GateParams) => {
  return api.get('/gerbangs', {
    params: params,
  });
};

export const createGate = (data: any) => {
  return api.post('/gerbangs', data);
};

export const updateGate = (id: number, data: any) => {
  return api.put(`/gerbangs/${id}`, data);
};

export const deleteGate = (id: number) => {
  return api.delete(`/gerbangs/${id}`);
};


export default api;