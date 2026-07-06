import { apiClient } from './apiClient';

export const cuadrillaApi = {
  crear: (datos) => apiClient.post('/api/cuadrillas', datos),
  listar: () => apiClient.get('/api/cuadrillas')
};
