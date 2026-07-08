import { apiClient, getToken } from './apiClient';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const donacionApi = {
/**
   * Crea una donación. Envía FormData porque puede incluir un archivo (comprobante).
   */
    crear: (formData) => apiClient.post('/api/donaciones', formData, true),
    listar: () => apiClient.get('/api/donaciones'),
    actualizarEstado: (id, estado) => apiClient.patch(`/api/donaciones/${id}`, { estado }),

  // El comprobante ahora es un endpoint protegido, así que hay que pedirlo
  // mandando el token y armar una URL temporal para poder abrirlo.
  verComprobante: async (id) => {
    const token = getToken();
    const respuesta = await fetch(`${API_URL}/api/donaciones/${id}/comprobante`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });

    if (!respuesta.ok) {
      throw new Error('No se pudo obtener el comprobante');
    }

    const blob = await respuesta.blob();
    return URL.createObjectURL(blob);
  }
};