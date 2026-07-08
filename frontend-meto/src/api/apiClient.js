/**
 * Cliente API centralizado.
 * Todas las llamadas al backend pasan por aquí para:
 *  - Agregar la URL base automáticamente
 *  - Adjuntar el token JWT en el header Authorization si existe
 *  - Manejar errores de forma consistente
 *  - Soportar tanto JSON como FormData (para subir archivos, ej. comprobantes)
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const getToken = () => localStorage.getItem('token');

/**
 * Realiza una petición HTTP al backend.
 * @param {string} path - ej: '/api/auth/login'
 * @param {object} options - { method, body, isFormData }
 */
const request = async (path, { method = 'GET', body, isFormData = false } = {}) => {
  const headers = {};
  const token = getToken();

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let finalBody = body;

  if (body && !isFormData) {
    headers['Content-Type'] = 'application/json';
    finalBody = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: finalBody
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    // Respuesta sin cuerpo JSON (ej. 204 No Content)
  }

  if (!response.ok) {
    const message = data?.message || data?.mensaje || 'Error en la petición';
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const apiClient = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body, isFormData = false) => request(path, { method: 'POST', body, isFormData }),
  patch: (path, body, isFormData = false) => request(path, { method: 'PATCH', body, isFormData }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  delete: (path) => request(path, { method: 'DELETE' })
};

export const setToken = (token) => localStorage.setItem('token', token);
export const clearToken = () => localStorage.removeItem('token');
export { getToken };
