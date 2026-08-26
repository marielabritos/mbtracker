// Cliente API para comunicarse con el backend FastAPI

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error en petición a ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // Estadísticas Dashboard
  getDashboardStats: () => request('/api/estadisticas/dashboard'),
  getProgresoEjercicio: (ejercicioId) => request(`/api/estadisticas/ejercicio/${ejercicioId}/progreso`),

  // Ejercicios
  getEjercicios: (grupo = '', busqueda = '') => {
    const params = new URLSearchParams();
    if (grupo && grupo !== 'Todos') params.append('grupo_muscular', grupo);
    if (busqueda) params.append('busqueda', busqueda);
    const query = params.toString() ? `?${params.toString()}` : '';
    return request(`/api/ejercicios${query}`);
  },
  getGruposMusculares: () => request('/api/ejercicios/grupos-musculares'),
  getEjercicio: (id) => request(`/api/ejercicios/${id}`),
  createEjercicio: (data) => request('/api/ejercicios', { method: 'POST', body: JSON.stringify(data) }),
  deleteEjercicio: (id) => request(`/api/ejercicios/${id}`, { method: 'DELETE' }),

  // Rutinas
  getRutinas: () => request('/api/rutinas'),
  getRutina: (id) => request(`/api/rutinas/${id}`),
  createRutina: (data) => request('/api/rutinas', { method: 'POST', body: JSON.stringify(data) }),
  updateRutina: (id, data) => request(`/api/rutinas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteRutina: (id) => request(`/api/rutinas/${id}`, { method: 'DELETE' }),

  // Sesiones de Entrenamiento
  getSesiones: (limit = 50) => request(`/api/sesiones?limit=${limit}`),
  getSesion: (id) => request(`/api/sesiones/${id}`),
  createSesion: (data) => request('/api/sesiones', { method: 'POST', body: JSON.stringify(data) }),
  deleteSesion: (id) => request(`/api/sesiones/${id}`, { method: 'DELETE' }),
  getUltimoRegistroEjercicio: (ejercicioId) => request(`/api/sesiones/ultimo-registro/${ejercicioId}`),
};
