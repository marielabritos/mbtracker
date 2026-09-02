/**
 * MBTracker Cloud Sync Service
 * Sincronización en la nube automática en tiempo real entre Computadora y Celular
 */

const CLOUD_OBJECT_ID = "ff808181a061cdc401a06455b7440882";
const CLOUD_URL = `https://api.restful-api.dev/objects/${CLOUD_OBJECT_ID}`;

let isSyncing = false;
let lastSyncTimestamp = 0;

export const cloudSync = {
  // Enviar todos los datos locales de Mariela a la nube
  pushToCloud: async () => {
    if (isSyncing) return;
    try {
      isSyncing = true;
      const rutinas = JSON.parse(localStorage.getItem('mbtracker_rutinas') || '[]');
      const sesiones = JSON.parse(localStorage.getItem('mbtracker_sesiones') || '[]');
      const ejercicios = JSON.parse(localStorage.getItem('mbtracker_ejercicios') || '[]');
      const prs = JSON.parse(localStorage.getItem('mbtracker_prs') || '[]');
      const perfil = JSON.parse(localStorage.getItem('mbtracker_perfil') || '{}');

      const payload = {
        name: "mbtracker_marielabritos_backup",
        data: {
          user: "marielabritos",
          updated_at: new Date().toISOString(),
          version: Date.now(),
          rutinas,
          sesiones,
          ejercicios,
          prs,
          perfil
        }
      };

      const res = await fetch(CLOUD_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        lastSyncTimestamp = Date.now();
        localStorage.setItem('mbtracker_last_cloud_sync', new Date().toISOString());
        window.dispatchEvent(new CustomEvent('mbtracker:cloud-synced', { detail: { status: 'success', direction: 'push' } }));
        return { success: true };
      }
    } catch (e) {
      console.warn("Cloud push warning:", e);
    } finally {
      isSyncing = false;
    }
    return { success: false };
  },

  // Traer los datos más recientes desde la nube al dispositivo actual (Celular o PC)
  pullFromCloud: async (force = false) => {
    if (isSyncing && !force) return;
    try {
      isSyncing = true;
      const res = await fetch(CLOUD_URL);
      if (!res.ok) return { success: false };

      const json = await res.json();
      const cloudData = json.data;

      if (cloudData && typeof cloudData === 'object') {
        const localRutinas = JSON.parse(localStorage.getItem('mbtracker_rutinas') || '[]');
        const localSesiones = JSON.parse(localStorage.getItem('mbtracker_sesiones') || '[]');

        // Si la nube tiene rutinas y están más completas o actualizadas, fusionar
        if (Array.isArray(cloudData.rutinas) && cloudData.rutinas.length > 0) {
          localStorage.setItem('mbtracker_rutinas', JSON.stringify(cloudData.rutinas));
        }

        // Fusionar sesiones históricas
        if (Array.isArray(cloudData.sesiones) && cloudData.sesiones.length > 0) {
          const map = new Map();
          localSesiones.forEach(s => map.set(s.id, s));
          cloudData.sesiones.forEach(s => map.set(s.id, { ...(map.get(s.id) || {}), ...s }));
          const merged = Array.from(map.values()).sort((a, b) => {
            const tA = new Date(a.fecha_inicio || a.fecha || 0).getTime();
            const tB = new Date(b.fecha_inicio || b.fecha || 0).getTime();
            return tB - tA;
          });
          localStorage.setItem('mbtracker_sesiones', JSON.stringify(merged));
        }

        if (Array.isArray(cloudData.ejercicios) && cloudData.ejercicios.length > 0) {
          localStorage.setItem('mbtracker_ejercicios', JSON.stringify(cloudData.ejercicios));
        }

        lastSyncTimestamp = Date.now();
        localStorage.setItem('mbtracker_last_cloud_sync', new Date().toISOString());
        window.dispatchEvent(new CustomEvent('mbtracker:cloud-synced', { detail: { status: 'success', direction: 'pull', data: cloudData } }));
        return { success: true, data: cloudData };
      }
    } catch (e) {
      console.warn("Cloud pull warning:", e);
    } finally {
      isSyncing = false;
    }
    return { success: false };
  },

  // Sincronización bidireccional inteligente
  syncNow: async () => {
    // 1. Primero traer cambios remotos
    const pullResult = await cloudSync.pullFromCloud(true);
    // 2. Luego asegurar que los cambios locales actuales estén guardados en la nube
    await cloudSync.pushToCloud();
    return pullResult;
  }
};
