import React, { useState, useEffect } from 'react';
import { History, Calendar, Clock, Dumbbell, Trophy, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../services/api';

export default function Historial() {
  const [sesiones, setSesiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSession, setExpandedSession] = useState(null);

  useEffect(() => {
    loadSesiones();
  }, []);

  const loadSesiones = async () => {
    try {
      setLoading(true);
      const data = await api.getSesiones(50);
      setSesiones(data);
      if (data.length > 0 && !expandedSession) {
        setExpandedSession(data[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Deseas eliminar este registro de entrenamiento?")) return;
    try {
      await api.deleteSesion(id);
      loadSesiones();
    } catch (e) {
      alert("Error al eliminar sesión");
    }
  };

  // Agrupar las series de una sesión por ejercicio
  const groupSeriesByExercise = (series) => {
    const map = {};
    series.forEach((s) => {
      const ejId = s.ejercicio_id;
      const ejNombre = s.ejercicio?.nombre || 'Ejercicio';
      const ejGrupo = s.ejercicio?.grupo_muscular || '';
      if (!map[ejId]) {
        map[ejId] = {
          nombre: ejNombre,
          grupo_muscular: ejGrupo,
          series: [],
        };
      }
      map[ejId].series.push(s);
    });
    return Object.values(map);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-28">
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Historial de Entrenamientos</h2>
        <p className="text-sm text-slate-400">Revisa todas tus sesiones pasadas y el volumen levantado</p>
      </div>

      {sesiones.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center space-y-3">
          <History className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="font-bold text-lg text-white">Sin entrenamientos guardados</h3>
          <p className="text-sm text-slate-400">Los entrenamientos que completes se guardarán automáticamente aquí.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sesiones.map((sesion) => {
            const isExpanded = expandedSession === sesion.id;
            const exercisesGrouped = groupSeriesByExercise(sesion.series);
            const totalVolumen = sesion.series.reduce((acc, s) => acc + (s.peso_kg * s.repeticiones), 0);
            const hasPR = sesion.series.some((s) => s.es_pr);
            const fecha = new Date(sesion.fecha_inicio);

            return (
              <div
                key={sesion.id}
                className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl transition-all"
              >
                {/* Header de la Sesión */}
                <div
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors"
                  onClick={() => setExpandedSession(isExpanded ? null : sesion.id)}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-base md:text-lg">{sesion.nombre}</h3>
                      {hasPR && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-bold text-amber-400">
                          <Trophy className="w-3 h-3" /> Nuevo PR
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1 font-medium text-slate-300">
                        <Calendar className="w-3.5 h-3.5 text-sky-400" />
                        {fecha.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      {sesion.duracion_segundos > 0 && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          {Math.round(sesion.duracion_segundos / 60)} min
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
                        {Math.round(totalVolumen).toLocaleString()} kg volumen
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(sesion.id);
                      }}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Eliminar sesión"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="p-2 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Detalle por Ejercicio */}
                {isExpanded && (
                  <div className="border-t border-slate-800/80 p-5 space-y-4 bg-slate-950/40">
                    {exercisesGrouped.map((item, idx) => (
                      <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-white text-sm">{item.nombre}</h4>
                          <span className="text-[10px] font-semibold text-sky-400 px-2 py-0.5 rounded-md bg-sky-500/10">
                            {item.grupo_muscular}
                          </span>
                        </div>

                        {/* Series */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                          {item.series.map((s, sIdx) => (
                            <div
                              key={sIdx}
                              className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-mono ${
                                s.es_pr
                                  ? 'bg-amber-950/20 border-amber-500/40 text-amber-300'
                                  : 'bg-slate-950/60 border-slate-800 text-slate-200'
                              }`}
                            >
                              <span className="text-slate-500 font-bold">#{s.numero_serie}</span>
                              <span className="font-bold">{s.peso_kg} kg × {s.repeticiones}</span>
                              {s.es_pr && <Trophy className="w-3 h-3 text-amber-400" />}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {sesion.notas && (
                      <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 italic">
                        "{sesion.notas}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
