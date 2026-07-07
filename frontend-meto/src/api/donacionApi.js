import { apiClient } from './apiClient';

export const donacionApi = {
/**
   * Crea una donación. Envía FormData porque puede incluir un archivo (comprobante).
   */
    crear: (formData) => apiClient.post('/api/donaciones', formData, true),
    listar: () => apiClient.get('/api/donaciones'),
    actualizarEstado: (id, estado) => apiClient.patch(`/api/donaciones/${id}`, { estado })
};