import { apiClient } from './apiClient';

export const cuadrillaApi = {
  crear: (datos) => apiClient.post('/api/cuadrillas', datos),
  listar: () => apiClient.get('/api/cuadrillas'),
  obtenerPorId: (id) => apiClient.get(`/api/cuadrillas/${id}`),
  asignarVoluntario: (id, rut) => apiClient.post(`/api/cuadrillas/${id}/voluntarios`, { rut }),
  quitarVoluntario: (id, rut) => apiClient.delete(`/api/cuadrillas/${id}/voluntarios/${rut}`)
};
