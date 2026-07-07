import { apiClient } from './apiClient';

export const authApi = {
  login: (email, password) => apiClient.post('/api/auth/login', { email, password }),
  me: () => apiClient.get('/api/auth/me'),
  logout: () => apiClient.post('/api/auth/logout'),
  assignRole: (userId, role) => apiClient.patch(`/api/auth/usuarios/${userId}/rol`, { role })
};
