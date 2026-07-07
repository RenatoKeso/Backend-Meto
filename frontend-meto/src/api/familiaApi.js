import { apiClient } from './apiClient';

export const familiaApi = {
  crear: (datos) => apiClient.post('/api/familias', datos),
  listar: (incluirInactivas = false) =>
    apiClient.get(`/api/familias${incluirInactivas ? '?incluirInactivas=true' : ''}`),
  obtenerPorId: (id) => apiClient.get(`/api/familias/${id}`),
  actualizar: (id, datos) => apiClient.patch(`/api/familias/${id}`, datos),
  eliminar: (id) => apiClient.delete(`/api/familias/${id}`)
};
