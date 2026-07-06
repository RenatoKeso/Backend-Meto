import { apiClient } from './apiClient';

export const actividadApi = {
  crear: (datos) => apiClient.post('/api/actividades', datos),
  listar: () => apiClient.get('/api/actividades'),
  obtenerPorId: (id) => apiClient.get(`/api/actividades/${id}`),
  actualizar: (id, datos) => apiClient.put(`/api/actividades/${id}`, datos),
  eliminar: (id) => apiClient.delete(`/api/actividades/${id}`),

  // Postulación / asignación de voluntarios
  obtenerVoluntariosElegibles: (id) => apiClient.get(`/api/actividades/${id}/voluntarios-elegibles`),
  obtenerPostulantes: (id) => apiClient.get(`/api/actividades/${id}/postulantes`),
  postular: (id, rut) => apiClient.post(`/api/actividades/${id}/postular`, { rut }),
  asignar: (id, rut) => apiClient.post(`/api/actividades/${id}/asignar`, { rut })
};
