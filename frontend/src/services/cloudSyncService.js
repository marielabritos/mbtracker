/**
 * MBTracker Cloud Sync Service
 * Sincronización en la nube automática y confiable entre Celular y Computadora
 */

const CLOUD_OBJECT_ID = "ff808181a061cdc401a06455b7440882";
const CLOUD_POINTER_URL = `https://api.restful-api.dev/objects/${CLOUD_OBJECT_ID}`;
const BYTEBIN_URL = "https://bytebin.lucko.me";

let isSyncing = false;

export const cloudSync = {
  // Enviar todos los datos de Mariela a la nube y registrar el puntero
  pushToCloud: async () => {
    if (isSyncing) return { success: false, message: 'Sync in progress' };
    try {
      isSyncing = true;
      const rutinas = JSON.parse(localStorage.getItem('mbtracker_rutinas') || '[]');
      const sesiones = JSON.parse(localStorage.getItem('mbtracker_sesiones') || '[]');
      const ejercicios = JSON.parse(localStorage.getItem('mbtracker_ejercicios') || '[]');
      const prs = JSON.parse(localStorage.getItem('mbtracker_prs') || '[]');
      const perfil = JSON.parse(localStorage.getItem('mbtracker_perfil') || '{}');

      const payload = {
        app: "MBTracker",
        user: "marielabritos",
        updated_at: new Date().toISOString(),
        version: Date.now(),
        rutinas,
        sesiones,
        ejercicios,
        prs,
        perfil
      };

      // 1. Guardar el payload completo en bytebin (soporta payloads de gran tamaño sin límite de WhatsApp)
      const bytebinRes = await fetch(`${BYTEBIN_URL}/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!bytebinRes.ok) {
        throw new Error(`Bytebin push failed with status ${bytebinRes.status}`);
      }

      const bytebinData = await bytebinRes.json();
      const syncKey = bytebinData.key;

      if (!syncKey) {
        throw new Error('No sync key returned from cloud storage');
      }

      // 2. Registrar el puntero 'latest_key' en restful-api.dev para permitir 1-tap sync en cualquier PC
      try {
        await fetch(CLOUD_POINTER_URL, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: "mbtracker_marielabritos_backup",
            data: {
              user: "marielabritos",
              latest_key: syncKey,
              updated_at: new Date().toISOString()
            }
          })
        });
      } catch (pointerErr) {
        console.warn("Could not update cloud pointer, key is still valid:", pointerErr);
      }

      localStorage.setItem('mbtracker_latest_sync_key', syncKey);
      localStorage.setItem('mbtracker_last_cloud_sync', new Date().toISOString());

      window.dispatchEvent(new CustomEvent('mbtracker:cloud-synced', {
        detail: { status: 'success', direction: 'push', key: syncKey }
      }));

      return { success: true, key: syncKey };
    } catch (e) {
      console.error("Cloud push error:", e);
      return { success: false, error: e.message };
    } finally {
      isSyncing = false;
    }
  },

  // Traer los datos más recientes desde la nube al dispositivo actual (Celular o PC)
  pullFromCloud: async (force = false, specificKey = null) => {
    if (isSyncing && !force) return { success: false };
    try {
      isSyncing = true;
      let syncKey = specificKey;

      // Si no nos pasan una clave directa, buscamos la clave más reciente en la nube
      if (!syncKey) {
        try {
          const pointerRes = await fetch(CLOUD_POINTER_URL);
          if (pointerRes.ok) {
            const pointerJson = await pointerRes.json();
            syncKey = pointerJson?.data?.latest_key;
          }
        } catch (e) {
          console.warn("Could not fetch cloud pointer:", e);
        }
      }

      // Fallback a clave guardada localmente si no hubo red o respuesta
      if (!syncKey) {
        syncKey = localStorage.getItem('mbtracker_latest_sync_key');
      }

      if (!syncKey) {
        return { success: false, message: 'No sync key available' };
      }

      // Descargar datos desde bytebin
      const binRes = await fetch(`${BYTEBIN_URL}/${syncKey}`);
      if (!binRes.ok) {
        throw new Error(`Failed to fetch cloud payload (${binRes.status})`);
      }

      const cloudData = await binRes.json();

      if (cloudData && typeof cloudData === 'object') {
        const localRutinas = JSON.parse(localStorage.getItem('mbtracker_rutinas') || '[]');
        const localSesiones = JSON.parse(localStorage.getItem('mbtracker_sesiones') || '[]');

        // 1. Fusionar rutinas (mantener rutinas existentes y actualizar/agregar nuevas)
        if (Array.isArray(cloudData.rutinas) && cloudData.rutinas.length > 0) {
          const rMap = new Map();
          localRutinas.forEach(r => {
            if (r.id) rMap.set(String(r.id), r);
          });
          cloudData.rutinas.forEach(incoming => {
            const matchKey = Array.from(rMap.keys()).find(k => {
              const existing = rMap.get(k);
              return String(existing.id) === String(incoming.id) || 
                     (existing.nombre && incoming.nombre && existing.nombre.trim().toLowerCase() === incoming.nombre.trim().toLowerCase());
            });
            if (matchKey) {
              const existing = rMap.get(matchKey);
              rMap.set(matchKey, { ...existing, ...incoming });
            } else {
              rMap.set(String(incoming.id || Date.now() + Math.random()), incoming);
            }
          });
          localStorage.setItem('mbtracker_rutinas', JSON.stringify(Array.from(rMap.values())));
          localStorage.setItem('mbtracker_has_custom_rutinas', 'true');
        }

        // 2. Fusionar sesiones de entrenamiento por ID
        if (Array.isArray(cloudData.sesiones) && cloudData.sesiones.length > 0) {
          const sMap = new Map();
          localSesiones.forEach(s => sMap.set(s.id, s));
          cloudData.sesiones.forEach(s => sMap.set(s.id, { ...(sMap.get(s.id) || {}), ...s }));
          const merged = Array.from(sMap.values()).sort((a, b) => {
            const tA = new Date(a.fecha_inicio || a.fecha || 0).getTime();
            const tB = new Date(b.fecha_inicio || b.fecha || 0).getTime();
            return tB - tA;
          });
          localStorage.setItem('mbtracker_sesiones', JSON.stringify(merged));
        }

        // 3. Fusionar ejercicios personalizados
        if (Array.isArray(cloudData.ejercicios) && cloudData.ejercicios.length > 0) {
          const localEjercicios = JSON.parse(localStorage.getItem('mbtracker_ejercicios') || '[]');
          const eMap = new Map();
          localEjercicios.forEach(e => eMap.set(String(e.id), e));
          cloudData.ejercicios.forEach(e => eMap.set(String(e.id), { ...(eMap.get(String(e.id)) || {}), ...e }));
          localStorage.setItem('mbtracker_ejercicios', JSON.stringify(Array.from(eMap.values())));
        }

        // 4. Fusionar PRs (Récords Personales)
        if (Array.isArray(cloudData.prs) && cloudData.prs.length > 0) {
          const localPrs = JSON.parse(localStorage.getItem('mbtracker_prs') || '[]');
          const pMap = new Map();
          localPrs.forEach(p => pMap.set(p.ejercicio_id || p.id, p));
          cloudData.prs.forEach(p => pMap.set(p.ejercicio_id || p.id, p));
          localStorage.setItem('mbtracker_prs', JSON.stringify(Array.from(pMap.values())));
        }

        // 5. Perfil
        if (cloudData.perfil && Object.keys(cloudData.perfil).length > 0) {
          localStorage.setItem('mbtracker_perfil', JSON.stringify(cloudData.perfil));
        }

        localStorage.setItem('mbtracker_latest_sync_key', syncKey);
        localStorage.setItem('mbtracker_last_cloud_sync', new Date().toISOString());

        window.dispatchEvent(new CustomEvent('mbtracker:cloud-synced', {
          detail: { status: 'success', direction: 'pull', data: cloudData }
        }));

        return {
          success: true,
          data: cloudData,
          rutinasCount: cloudData.rutinas?.length || 0,
          sesionesCount: cloudData.sesiones?.length || 0
        };
      }
    } catch (e) {
      console.error("Cloud pull error:", e);
      return { success: false, error: e.message };
    } finally {
      isSyncing = false;
    }
    return { success: false };
  },

  // Sincronización bidireccional inteligente
  syncNow: async () => {
    const pullResult = await cloudSync.pullFromCloud(true);
    await cloudSync.pushToCloud();
    return pullResult;
  }
};
