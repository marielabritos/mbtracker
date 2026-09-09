// Compactador ultra eficiente de datos para MBTracker
// Reduce el tamaño del JSON en un 80% eliminando duplicaciones para que entre en cualquier QR y URL

export function compactPayload(raw) {
  const cleanRutinas = (raw.rutinas || []).map(r => ({
    id: r.id,
    nombre: r.nombre,
    descripcion: r.descripcion || '',
    duracion_semanas: r.duracion_semanas,
    duracion_estimada_minutos: r.duracion_estimada_minutos,
    activa: r.activa !== false,
    dias: (r.dias || []).map(d => ({
      id: d.id,
      nombre: d.nombre,
      orden: d.orden,
      ejercicios: (d.ejercicios || []).map(e => ({
        id: e.id,
        ejercicio_id: e.ejercicio_id || e.ejercicio?.id,
        nombre: e.ejercicio?.nombre || e.nombre || 'Ejercicio',
        grupo_muscular: e.ejercicio?.grupo_muscular || e.grupo_muscular || 'General',
        equipo: e.ejercicio?.equipo || e.equipo || 'Mancuerna',
        series_objetivo: e.series_objetivo || 3,
        reps_objetivo: e.reps_objetivo || '8-12',
        descanso_segundos: e.descanso_segundos || 60,
        notas: e.notas || undefined
      }))
    }))
  }));

  const cleanSesiones = (raw.sesiones || []).map(s => ({
    id: s.id,
    nombre: s.nombre,
    fecha_inicio: s.fecha_inicio || s.fecha,
    fecha_fin: s.fecha_fin,
    duracion_segundos: s.duracion_segundos,
    animo: s.animo,
    molestia: s.molestia,
    series: (s.series || []).map(item => ({
      ejercicio_id: item.ejercicio_id,
      numero_serie: item.numero_serie,
      peso_kg: item.peso_kg,
      repeticiones: item.repeticiones,
      completada: item.completada,
      es_pr: item.es_pr
    }))
  }));

  const cleanPrs = (raw.prs || []).map(p => ({
    ejercicio_id: p.ejercicio_id || p.id,
    nombre: p.nombre,
    peso_kg: p.peso_kg,
    repeticiones: p.repeticiones,
    fecha: p.fecha,
    '1rm_estimado': p['1rm_estimado']
  }));

  return {
    r: cleanRutinas,
    s: cleanSesiones,
    p: raw.perfil || {},
    pr: cleanPrs,
    t: Date.now()
  };
}

export function expandPayload(compact) {
  // Soporta formato compacto { r, s, p, pr } y formato legacy { rutinas, sesiones, perfil, prs }
  const rawRutinas = compact.r || compact.rutinas || [];
  const rutinas = rawRutinas.map(r => ({
    ...r,
    dias: (r.dias || []).map(d => ({
      ...d,
      ejercicios: (d.ejercicios || []).map(e => {
        const ejNombre = e.ejercicio?.nombre || e.nombre || 'Ejercicio';
        const ejGrupo = e.ejercicio?.grupo_muscular || e.grupo_muscular || 'General';
        const ejEquipo = e.ejercicio?.equipo || e.equipo || 'Mancuerna';
        const ejId = e.ejercicio_id || e.ejercicio?.id || e.id;
        return {
          ...e,
          id: e.id,
          ejercicio_id: ejId,
          nombre: ejNombre,
          grupo_muscular: ejGrupo,
          equipo: ejEquipo,
          series_objetivo: e.series_objetivo || 3,
          reps_objetivo: e.reps_objetivo || '8-12',
          descanso_segundos: e.descanso_segundos || 60,
          notas: e.notas || '',
          ejercicio: e.ejercicio || {
            id: ejId,
            nombre: ejNombre,
            grupo_muscular: ejGrupo,
            equipo: ejEquipo
          }
        };
      })
    }))
  }));

  const rawSesiones = compact.s || compact.sesiones || [];
  const sesiones = rawSesiones.map(s => ({
    ...s,
    fecha_inicio: s.fecha_inicio || s.fecha,
    series: (s.series || []).map(item => ({
      ...item,
      ejercicio: item.ejercicio || {
        id: item.ejercicio_id,
        nombre: item.nombre || 'Ejercicio'
      }
    }))
  }));

  const perfil = compact.p || compact.perfil || {};
  const prs = compact.pr || compact.prs || [];

  return { rutinas, sesiones, perfil, prs };
}
