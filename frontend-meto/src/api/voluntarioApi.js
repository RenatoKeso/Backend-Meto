import { apiClient } from './apiClient';

export const voluntarioApi = {
  postular: (datos) => apiClient.post('/api/voluntarios', datos),
  listar: (incluirInactivos = false) =>
    apiClient.get(`/api/voluntarios${incluirInactivos ? '?incluirInactivos=true' : ''}`),
  obtenerPorRut: (rut) => apiClient.get(`/api/voluntarios/${rut}`),
  actualizar: (rut, datos) => apiClient.patch(`/api/voluntarios/${rut}`, datos),
  activar: (rut, rol_id) => apiClient.patch(`/api/voluntarios/${rut}/activar`, { rol_id }),
  eliminar: (rut) => apiClient.delete(`/api/voluntarios/${rut}`),
  actualizarCapacidades: (rut, datos) => apiClient.patch(`/api/voluntarios/${rut}/capacidades`, datos),
  actividadesDisponibles: (rut) => apiClient.get(`/api/voluntarios/${rut}/actividades-disponibles`)
};
