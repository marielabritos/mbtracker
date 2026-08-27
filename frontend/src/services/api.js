// Cliente API Offline-First para MBTracker con persistencia dual (Local + Nube)

const DEFAULT_EJERCICIOS = [
  { id: 1, nombre: "Press de Banca Plano con Barra", grupo_muscular: "Pecho", equipo: "Barra", es_personalizado: false },
  { id: 2, nombre: "Press Inclinado con Mancuernas", grupo_muscular: "Pecho", equipo: "Mancuerna", es_personalizado: false },
  { id: 3, nombre: "Aperturas en Polea (Cruces)", grupo_muscular: "Pecho", equipo: "Polea", es_personalizado: false },
  { id: 4, nombre: "Fondos en Paralelas (Dips)", grupo_muscular: "Pecho", equipo: "Peso Corporal", es_personalizado: false },
  { id: 5, nombre: "Press en Máquina Smith / Chest Press", grupo_muscular: "Pecho", equipo: "Máquina", es_personalizado: false },
  { id: 6, nombre: "Jalón al Pecho en Polea", grupo_muscular: "Espalda", equipo: "Polea", es_personalizado: false },
  { id: 7, nombre: "Dominadas (Pull-ups)", grupo_muscular: "Espalda", equipo: "Peso Corporal", es_personalizado: false },
  { id: 8, nombre: "Remo con Barra", grupo_muscular: "Espalda", equipo: "Barra", es_personalizado: false },
  { id: 9, nombre: "Remo Unilateral con Mancuerna (Serrucho)", grupo_muscular: "Espalda", equipo: "Mancuerna", es_personalizado: false },
  { id: 10, nombre: "Remo en Polea Baja (Gironda)", grupo_muscular: "Espalda", equipo: "Polea", es_personalizado: false },
  { id: 11, nombre: "Sentadilla con Barra (Back Squat)", grupo_muscular: "Piernas", equipo: "Barra", es_personalizado: false },
  { id: 12, nombre: "Prensa de Piernas 45°", grupo_muscular: "Piernas", equipo: "Máquina", es_personalizado: false },
  { id: 13, nombre: "Peso Muerto Rumano (RDL)", grupo_muscular: "Piernas", equipo: "Barra", es_personalizado: false },
  { id: 14, nombre: "Extensión de Cuádriceps", grupo_muscular: "Piernas", equipo: "Máquina", es_personalizado: false },
  { id: 15, nombre: "Curl Femoral Tumbado / Sentado", grupo_muscular: "Piernas", equipo: "Máquina", es_personalizado: false },
  { id: 16, nombre: "Elevación de Talones (Gemelos)", grupo_muscular: "Piernas", equipo: "Máquina", es_personalizado: false },
  { id: 17, nombre: "Hip Thrust con Barra", grupo_muscular: "Piernas", equipo: "Barra", es_personalizado: false },
  { id: 18, nombre: "Press Militar con Barra / Mancuernas", grupo_muscular: "Hombros", equipo: "Mancuerna", es_personalizado: false },
  { id: 19, nombre: "Elevaciones Laterales", grupo_muscular: "Hombros", equipo: "Mancuerna", es_personalizado: false },
  { id: 20, nombre: "Pájaros / Face Pull en Polea", grupo_muscular: "Hombros", equipo: "Polea", es_personalizado: false },
  { id: 21, nombre: "Curl de Bíceps con Barra Z", grupo_muscular: "Brazos", equipo: "Barra", es_personalizado: false },
  { id: 22, nombre: "Curl Martillo con Mancuernas", grupo_muscular: "Brazos", equipo: "Mancuerna", es_personalizado: false },
  { id: 23, nombre: "Extensiones de Tríceps en Polea (Cuerda)", grupo_muscular: "Brazos", equipo: "Polea", es_personalizado: false },
  { id: 24, nombre: "Press Francés con Barra Z", grupo_muscular: "Brazos", equipo: "Barra", es_personalizado: false },
  { id: 25, nombre: "Plancha Abdominal", grupo_muscular: "Core", equipo: "Peso Corporal", es_personalizado: false },
  { id: 26, nombre: "Elevación de Piernas Colgado", grupo_muscular: "Core", equipo: "Peso Corporal", es_personalizado: false },
  { id: 27, nombre: "Crunch en Polea Alta", grupo_muscular: "Core", equipo: "Polea", es_personalizado: false },
];

const DEFAULT_RUTINAS = [
  {
    id: 1,
    nombre: "Rutina Push / Pull / Legs (PPL)",
    descripcion: "División clásica de 3 días para fuerza e hipertrofia.",
    duracion_semanas: "6 semanas",
    duracion_estimada_minutos: 55,
    activa: true,
    dias: [
      {
        id: 101,
        nombre: "Día 1: Push (Pecho, Hombro, Tríceps)",
        orden: 1,
        ejercicios: [
          { id: 1, ejercicio_id: 1, series_objetivo: 4, reps_objetivo: "6-8", descanso_segundos: 120, orden: 1, ejercicio: DEFAULT_EJERCICIOS[0] },
          { id: 2, ejercicio_id: 2, series_objetivo: 3, reps_objetivo: "8-10", descanso_segundos: 90, orden: 2, ejercicio: DEFAULT_EJERCICIOS[1] },
          { id: 3, ejercicio_id: 18, series_objetivo: 3, reps_objetivo: "8-10", descanso_segundos: 90, orden: 3, ejercicio: DEFAULT_EJERCICIOS[17] },
          { id: 4, ejercicio_id: 19, series_objetivo: 4, reps_objetivo: "12-15", descanso_segundos: 60, orden: 4, ejercicio: DEFAULT_EJERCICIOS[18] },
          { id: 5, ejercicio_id: 23, series_objetivo: 3, reps_objetivo: "10-12", descanso_segundos: 60, orden: 5, ejercicio: DEFAULT_EJERCICIOS[22] },
        ]
      },
      {
        id: 102,
        nombre: "Día 2: Pull (Espalda, Deltoides Post, Bíceps)",
        orden: 2,
        ejercicios: [
          { id: 6, ejercicio_id: 8, series_objetivo: 4, reps_objetivo: "6-8", descanso_segundos: 120, orden: 1, ejercicio: DEFAULT_EJERCICIOS[7] },
          { id: 7, ejercicio_id: 6, series_objetivo: 3, reps_objetivo: "8-10", descanso_segundos: 90, orden: 2, ejercicio: DEFAULT_EJERCICIOS[5] },
          { id: 8, ejercicio_id: 9, series_objetivo: 3, reps_objetivo: "10-12", descanso_segundos: 90, orden: 3, ejercicio: DEFAULT_EJERCICIOS[8] },
          { id: 9, ejercicio_id: 20, series_objetivo: 4, reps_objetivo: "12-15", descanso_segundos: 60, orden: 4, ejercicio: DEFAULT_EJERCICIOS[19] },
          { id: 10, ejercicio_id: 21, series_objetivo: 3, reps_objetivo: "10-12", descanso_segundos: 60, orden: 5, ejercicio: DEFAULT_EJERCICIOS[20] },
        ]
      },
      {
        id: 103,
        nombre: "Día 3: Legs (Pierna completa y Core)",
        orden: 3,
        ejercicios: [
          { id: 11, ejercicio_id: 11, series_objetivo: 4, reps_objetivo: "6-8", descanso_segundos: 120, orden: 1, ejercicio: DEFAULT_EJERCICIOS[10] },
          { id: 12, ejercicio_id: 12, series_objetivo: 3, reps_objetivo: "10-12", descanso_segundos: 90, orden: 2, ejercicio: DEFAULT_EJERCICIOS[11] },
          { id: 13, ejercicio_id: 13, series_objetivo: 3, reps_objetivo: "8-10", descanso_segundos: 90, orden: 3, ejercicio: DEFAULT_EJERCICIOS[12] },
          { id: 14, ejercicio_id: 14, series_objetivo: 3, reps_objetivo: "12-15", descanso_segundos: 60, orden: 4, ejercicio: DEFAULT_EJERCICIOS[13] },
          { id: 15, ejercicio_id: 25, series_objetivo: 3, reps_objetivo: "45s", descanso_segundos: 45, orden: 5, ejercicio: DEFAULT_EJERCICIOS[24] },
        ]
      }
    ]
  },
  {
    id: 2,
    nombre: "Tren Superior: Tracción, Hombros & Bíceps",
    descripcion: "Enfoque completo en espalda (tracción vertical y horizontal), deltoides y bíceps.",
    duracion_semanas: "4 semanas",
    duracion_estimada_minutos: 50,
    activa: true,
    dias: [
      {
        id: 201,
        nombre: "Día 1: Tracción (Espalda), Hombros y Bíceps",
        orden: 1,
        ejercicios: [
          { id: 21, ejercicio_id: 6, series_objetivo: 4, reps_objetivo: "8-10", descanso_segundos: 90, orden: 1, ejercicio: DEFAULT_EJERCICIOS[5] },
          { id: 22, ejercicio_id: 8, series_objetivo: 4, reps_objetivo: "8-10", descanso_segundos: 90, orden: 2, ejercicio: DEFAULT_EJERCICIOS[7] },
          { id: 23, ejercicio_id: 9, series_objetivo: 3, reps_objetivo: "10-12", descanso_segundos: 60, orden: 3, ejercicio: DEFAULT_EJERCICIOS[8] },
          { id: 24, ejercicio_id: 18, series_objetivo: 3, reps_objetivo: "8-10", descanso_segundos: 90, orden: 4, ejercicio: DEFAULT_EJERCICIOS[17] },
          { id: 25, ejercicio_id: 19, series_objetivo: 4, reps_objetivo: "12-15", descanso_segundos: 60, orden: 5, ejercicio: DEFAULT_EJERCICIOS[18] },
          { id: 26, ejercicio_id: 20, series_objetivo: 3, reps_objetivo: "12-15", descanso_segundos: 60, orden: 6, ejercicio: DEFAULT_EJERCICIOS[19] },
          { id: 27, ejercicio_id: 21, series_objetivo: 3, reps_objetivo: "10-12", descanso_segundos: 60, orden: 7, ejercicio: DEFAULT_EJERCICIOS[20] },
          { id: 28, ejercicio_id: 22, series_objetivo: 3, reps_objetivo: "12-15", descanso_segundos: 60, orden: 8, ejercicio: DEFAULT_EJERCICIOS[21] },
        ]
      }
    ]
  }
];

// Helper para obtener URL base
const getApiBase = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname) {
    const host = window.location.hostname;
    if (host !== 'localhost' && host !== '127.0.0.1' && !host.includes('vercel.app')) {
      return `http://${host}:8080`;
    }
  }
  return 'http://localhost:8080';
};

const API_BASE = getApiBase();

// Storage local helpers
const getStored = (key, defaultVal) => {
  try {
    const val = localStorage.getItem(`mbtracker_${key}`);
    return val ? JSON.parse(val) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

const setStored = (key, val) => {
  try {
    localStorage.setItem(`mbtracker_${key}`, JSON.stringify(val));
  } catch (e) {
    console.warn("Storage full or blocked", e);
  }
};

// Petición HTTP con timeout
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4500); // 4.5s timeout

  const config = {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    signal: controller.signal,
    ...options,
  };

  try {
    const response = await fetch(url, config);
    clearTimeout(timeoutId);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export const api = {
  // --- ESTADÍSTICAS & DASHBOARD ---
  getDashboardStats: async () => {
    try {
      const data = await request('/api/estadisticas/dashboard');
      setStored('dashboard_stats', data);
      return data;
    } catch (e) {
      // Fallback local
      const sesiones = getStored('sesiones', []);
      const prs = getStored('prs', []);
      const totalVolumen = sesiones.reduce((acc, s) => {
        return acc + s.series.reduce((sAcc, item) => sAcc + (item.peso_kg * item.repeticiones), 0);
      }, 0);

      return {
        total_entrenamientos: sesiones.length,
        racha_dias_mes: sesiones.length > 0 ? Math.min(sesiones.length, 30) : 0,
        volumen_semanal_kg: Math.round(totalVolumen),
        tiempo_total_minutos: Math.round(sesiones.reduce((acc, s) => acc + (s.duracion_segundos || 0), 0) / 60),
        ultimos_prs: prs.slice(0, 8),
        ultimas_sesiones: sesiones.slice(0, 5)
      };
    }
  },

  getProgresoEjercicio: async (ejercicioId) => {
    try {
      return await request(`/api/estadisticas/ejercicio/${ejercicioId}/progreso`);
    } catch (e) {
      const sesiones = getStored('sesiones', []);
      const series = [];
      sesiones.forEach(s => {
        const matches = s.series.filter(item => item.ejercicio_id === parseInt(ejercicioId));
        if (matches.length > 0) {
          const maxP = Math.max(...matches.map(m => m.peso_kg || 0));
          const matchMax = matches.find(m => m.peso_kg === maxP) || matches[0];
          series.push({
            fecha: new Date(s.fecha_inicio).toLocaleDateString('es-ES'),
            peso_max: maxP,
            reps_en_peso_max: matchMax.repeticiones || 0,
            volumen_total: matches.reduce((acc, m) => acc + (m.peso_kg * m.repeticiones), 0),
            '1rm_estimado': Math.round(maxP * (1 + (matchMax.repeticiones || 0) / 30))
          });
        }
      });
      return series;
    }
  },

  // --- EJERCICIOS ---
  getEjercicios: async (grupo = '', busqueda = '') => {
    try {
      const params = new URLSearchParams();
      if (grupo && grupo !== 'Todos') params.append('grupo_muscular', grupo);
      if (busqueda) params.append('busqueda', busqueda);
      const query = params.toString() ? `?${params.toString()}` : '';
      const data = await request(`/api/ejercicios${query}`);
      setStored('ejercicios', data);
      return data;
    } catch (e) {
      const local = getStored('ejercicios', DEFAULT_EJERCICIOS);
      return local.filter(ej => {
        const matchG = !grupo || grupo === 'Todos' || ej.grupo_muscular === grupo;
        const matchB = !busqueda || ej.nombre.toLowerCase().includes(busqueda.toLowerCase());
        return matchG && matchB;
      });
    }
  },

  createEjercicio: async (data) => {
    try {
      const res = await request('/api/ejercicios', { method: 'POST', body: JSON.stringify(data) });
      const current = getStored('ejercicios', DEFAULT_EJERCICIOS);
      setStored('ejercicios', [res, ...current]);
      return res;
    } catch (e) {
      const current = getStored('ejercicios', DEFAULT_EJERCICIOS);
      const nuevo = {
        id: Date.now(),
        nombre: data.nombre,
        grupo_muscular: data.grupo_muscular,
        equipo: data.equipo || 'General',
        descripcion: data.descripcion || '',
        es_personalizado: true,
        fecha_creacion: new Date().toISOString()
      };
      setStored('ejercicios', [nuevo, ...current]);
      return nuevo;
    }
  },

  updateEjercicio: async (id, data) => {
    const current = getStored('ejercicios', DEFAULT_EJERCICIOS);
    const updated = current.map(e => e.id === parseInt(id) ? { ...e, ...data } : e);
    setStored('ejercicios', updated);

    // Actualizar también en rutinas locales que contengan este ejercicio
    const rutinas = getStored('rutinas', DEFAULT_RUTINAS);
    const updatedRutinas = rutinas.map(r => ({
      ...r,
      dias: (r.dias || []).map(d => ({
        ...d,
        ejercicios: (d.ejercicios || []).map(ej => {
          if (ej.ejercicio_id === parseInt(id)) {
            return { ...ej, ejercicio: { ...ej.ejercicio, ...data } };
          }
          return ej;
        })
      }))
    }));
    setStored('rutinas', updatedRutinas);

    try {
      return await request(`/api/ejercicios/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    } catch (e) {
      return { ...data, id };
    }
  },

  deleteEjercicio: async (id) => {
    try {
      await request(`/api/ejercicios/${id}`, { method: 'DELETE' });
    } catch (e) {
      // offline delete
    }
    const current = getStored('ejercicios', DEFAULT_EJERCICIOS);
    setStored('ejercicios', current.filter(e => e.id !== parseInt(id)));
    return { success: true };
  },

  // --- RUTINAS ---
  getRutinas: async () => {
    const deletedIds = getStored('deleted_rutina_ids', []);
    try {
      const data = await request('/api/rutinas');
      if (Array.isArray(data) && data.length > 0) {
        // Filtrar cualquier rutina que el usuario haya borrado explícitamente
        const cleanData = data.filter(r => !deletedIds.includes(r.id));
        setStored('rutinas', cleanData);
        return cleanData;
      }
      const local = getStored('rutinas', DEFAULT_RUTINAS);
      return local.filter(r => !deletedIds.includes(r.id));
    } catch (e) {
      const local = getStored('rutinas', DEFAULT_RUTINAS);
      return local.filter(r => !deletedIds.includes(r.id));
    }
  },

  resetRutinasToOfficial: async () => {
    try {
      localStorage.removeItem('mbtracker_rutinas');
      localStorage.removeItem('mbtracker_ejercicios');
      localStorage.removeItem('mbtracker_deleted_rutina_ids');
    } catch (e) {}
    setStored('rutinas', DEFAULT_RUTINAS);
    setStored('ejercicios', DEFAULT_EJERCICIOS);
    return DEFAULT_RUTINAS;
  },

  createRutina: async (data) => {
    const newId = Date.now();
    const deletedIds = getStored('deleted_rutina_ids', []);
    setStored('deleted_rutina_ids', deletedIds.filter(x => x !== newId));

    const catalog = getStored('ejercicios', DEFAULT_EJERCICIOS);
    const current = getStored('rutinas', DEFAULT_RUTINAS);
    const nuevaLocal = {
      ...data,
      id: newId,
      fecha_creacion: new Date().toISOString(),
      dias: (data.dias || []).map((d, dIdx) => ({
        ...d,
        id: Date.now() + dIdx + 1,
        orden: dIdx + 1,
        ejercicios: (d.ejercicios || []).map((e, eIdx) => {
          const ejObj = e.ejercicio || catalog.find(x => x.id === e.ejercicio_id) || { id: e.ejercicio_id, nombre: 'Ejercicio', grupo_muscular: 'General' };
          return {
            ...e,
            id: Date.now() + dIdx * 100 + eIdx + 1,
            orden: eIdx + 1,
            ejercicio: ejObj
          };
        })
      }))
    };

    setStored('rutinas', [nuevaLocal, ...current]);

    try {
      const res = await request('/api/rutinas', { method: 'POST', body: JSON.stringify(data) });
      return res;
    } catch (e) {
      return nuevaLocal;
    }
  },

  updateRutina: async (id, data) => {
    const deletedIds = getStored('deleted_rutina_ids', []);
    setStored('deleted_rutina_ids', deletedIds.filter(x => x !== parseInt(id)));

    const catalog = getStored('ejercicios', DEFAULT_EJERCICIOS);
    const current = getStored('rutinas', DEFAULT_RUTINAS);
    const updatedList = current.map(r => {
      if (r.id === parseInt(id)) {
        return {
          ...r,
          ...data,
          dias: (data.dias || []).map((d, dIdx) => ({
            ...d,
            id: d.id || Date.now() + dIdx + 1,
            orden: dIdx + 1,
            ejercicios: (d.ejercicios || []).map((e, eIdx) => {
              const ejObj = e.ejercicio || catalog.find(x => x.id === e.ejercicio_id) || { id: e.ejercicio_id, nombre: 'Ejercicio', grupo_muscular: 'General' };
              return {
                ...e,
                id: e.id || Date.now() + dIdx * 100 + eIdx + 1,
                orden: eIdx + 1,
                ejercicio: ejObj
              };
            })
          }))
        };
      }
      return r;
    });

    setStored('rutinas', updatedList);

    try {
      return await request(`/api/rutinas/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    } catch (e) {
      return updatedList.find(r => r.id === parseInt(id));
    }
  },

  deleteRutina: async (id) => {
    // 1. Guardar id en la lista negra de rutinas eliminadas
    const deletedIds = getStored('deleted_rutina_ids', []);
    if (!deletedIds.includes(parseInt(id))) {
      setStored('deleted_rutina_ids', [...deletedIds, parseInt(id)]);
    }

    // 2. Eliminar del almacenamiento local
    const current = getStored('rutinas', DEFAULT_RUTINAS);
    const filtered = current.filter(r => r.id !== parseInt(id));
    setStored('rutinas', filtered);

    // 3. Enviar borrado al backend
    try {
      await request(`/api/rutinas/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn("Backend delete request caught:", e);
    }
    return { success: true };
  },

  // --- SESIONES DE ENTRENAMIENTO (FINALIZAR & GUARDAR) ---
  getSesiones: async () => {
    try {
      const data = await request('/api/sesiones');
      setStored('sesiones', data);
      return data;
    } catch (e) {
      return getStored('sesiones', []);
    }
  },

  createSesion: async (data) => {
    // 1. Calcular PRs locales
    const catalog = getStored('ejercicios', DEFAULT_EJERCICIOS);
    const currentPRs = getStored('prs', []);
    const prMap = {};
    currentPRs.forEach(p => { prMap[p.ejercicio_id] = p.peso_maximo_kg; });

    const seriesProcessed = data.series.map((s, idx) => {
      const peso = parseFloat(s.peso_kg) || 0;
      const prevMax = prMap[s.ejercicio_id] || 0;
      const isPR = peso > 0 && peso > prevMax;
      if (isPR) {
        prMap[s.ejercicio_id] = peso;
      }
      const ejInfo = catalog.find(e => e.id === s.ejercicio_id) || { nombre: 'Ejercicio', grupo_muscular: 'General' };
      return {
        id: Date.now() + idx,
        ejercicio_id: s.ejercicio_id,
        numero_serie: s.numero_serie,
        peso_kg: peso,
        repeticiones: parseInt(s.repeticiones) || 0,
        rpe: s.rpe || null,
        completada: true,
        es_pr: isPR,
        ejercicio: ejInfo
      };
    });

    const nuevaSesion = {
      id: Date.now(),
      nombre: data.nombre,
      dia_rutina_id: data.dia_rutina_id || null,
      fecha_inicio: data.fecha_inicio || new Date().toISOString(),
      fecha_fin: new Date().toISOString(),
      duracion_segundos: data.duracion_segundos || 0,
      notas: data.notas || '',
      completado: true,
      series: seriesProcessed
    };

    // Actualizar historial local inmediatamente
    const currentSesiones = getStored('sesiones', []);
    setStored('sesiones', [nuevaSesion, ...currentSesiones]);

    // Actualizar PRs
    const updatedPRs = [...currentPRs];
    seriesProcessed.filter(s => s.es_pr).forEach(s => {
      const idx = updatedPRs.findIndex(p => p.ejercicio_id === s.ejercicio_id);
      const prObj = {
        ejercicio_id: s.ejercicio_id,
        ejercicio_nombre: s.ejercicio?.nombre || 'Ejercicio',
        grupo_muscular: s.ejercicio?.grupo_muscular || 'General',
        peso_maximo_kg: s.peso_kg,
        repeticiones: s.repeticiones,
        fecha: new Date().toISOString(),
        sesion_id: nuevaSesion.id
      };
      if (idx >= 0) {
        updatedPRs[idx] = prObj;
      } else {
        updatedPRs.push(prObj);
      }
    });
    setStored('prs', updatedPRs);

    // Intentar sincronizar con backend
    try {
      const res = await request('/api/sesiones', { method: 'POST', body: JSON.stringify(data) });
      return res;
    } catch (e) {
      console.log("Sesión guardada en almacenamiento local.");
      return nuevaSesion;
    }
  },

  deleteSesion: async (id) => {
    const current = getStored('sesiones', []);
    setStored('sesiones', current.filter(s => s.id !== parseInt(id)));
    try {
      await request(`/api/sesiones/${id}`, { method: 'DELETE' });
    } catch (e) {}
    return { success: true };
  },

  getUltimoRegistroEjercicio: async (ejercicioId) => {
    try {
      const res = await request(`/api/sesiones/ultimo-registro/${ejercicioId}`);
      if (Array.isArray(res) && res.length > 0) return res;
    } catch (e) {}

    // Buscar en historial local
    const sesiones = getStored('sesiones', []);
    for (const s of sesiones) {
      const match = s.series.filter(item => item.ejercicio_id === parseInt(ejercicioId));
      if (match.length > 0) {
        return match;
      }
    }
    return [];
  }
};
