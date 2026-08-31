import React, { useState, useEffect } from 'react';
import { 
  History, Calendar, Clock, Dumbbell, Trophy, Trash2, 
  ChevronDown, ChevronUp, MapPin, TrendingUp, Flame, Mountain, Heart, Compass, Flag, FileText 
} from 'lucide-react';
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
    if (!series || !Array.isArray(series)) return [];
    const map = {};
    series.forEach((s) => {
      const ejId = s.ejercicio_id;
      const ejNombre = s.ejercicio?.nombre || s.nombre_ejercicio || 'Ejercicio';
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
        <p className="text-sm text-slate-400">Revisa todas tus sesiones de fuerza, running, bicicleta y montañismo</p>
      </div>

      {/* PANEL DE MONITOREO DE ÁNIMO & BIENESTAR */}
      {sesiones.some(s => s.animo) && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-indigo-950/40 border border-amber-500/30 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <h3 className="font-black text-sm sm:text-base text-white">Monitoreo de Ánimo & Bienestar</h3>
            </div>
            <span className="text-xs text-amber-400 font-bold">Registro de Check-ins</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Energía Promedio</span>
              <div className="text-base sm:text-lg font-black text-amber-400 mt-0.5">
                {(sesiones.filter(s => s.energia).reduce((acc, s) => acc + s.energia, 0) / Math.max(sesiones.filter(s => s.energia).length, 1)).toFixed(1)} / 5.0 ⭐
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Días Ánimo Positivo</span>
              <div className="text-base sm:text-lg font-black text-emerald-400 mt-0.5">
                {sesiones.filter(s => (s.energia || 3) >= 3).length} sesiones 🔥
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Efecto Terapia</span>
              <span className="text-xs font-bold text-sky-300 mt-0.5">
                Entrenar eleva tu estado de ánimo
              </span>
            </div>
          </div>
        </div>
      )}

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
            const isOutdoor = sesion.tipo === 'outdoor_cardio' || sesion.deporte;
            const exercisesGrouped = groupSeriesByExercise(sesion.series);
            const totalVolumen = (sesion.series || []).reduce((acc, s) => acc + ((s.peso_kg || 0) * (s.repeticiones || 0)), 0);
            const hasPR = (sesion.series || []).some((s) => s.es_pr);
            const fecha = new Date(sesion.fecha_inicio || sesion.fecha || Date.now());

            const getSportBadge = (deporte) => {
              if (deporte === 'running') return { icon: '🏃', label: 'Running', color: 'bg-sky-500/15 border-sky-500/30 text-sky-400' };
              if (deporte === 'ciclismo') return { icon: '🚴', label: 'Ciclismo', color: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' };
              if (deporte === 'montanismo') return { icon: '⛰️', label: 'Montañismo', color: 'bg-amber-500/15 border-amber-500/30 text-amber-400' };
              return { icon: '🏋️', label: 'Fuerza', color: 'bg-slate-800 border-slate-700 text-slate-300' };
            };

            const sportBadge = getSportBadge(sesion.deporte);

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
                  <div className="space-y-1.5 min-w-0 pr-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {isOutdoor && (
                        <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg border text-[11px] font-black ${sportBadge.color}`}>
                          <span>{sportBadge.icon}</span>
                          <span>{sportBadge.label}</span>
                        </span>
                      )}
                      <h3 className="font-bold text-white text-base md:text-lg truncate">{sesion.nombre}</h3>
                      {hasPR && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-bold text-amber-400">
                          <Trophy className="w-3 h-3" /> Nuevo PR
                        </span>
                      )}
                      {sesion.animo && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[11px] font-bold text-amber-300">
                          <span>{sesion.animo.emoji || '🔥'}</span>
                          <span>Ánimo: {sesion.animo.label || sesion.animo}</span>
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
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {Math.round(sesion.duracion_segundos / 60)} min
                        </span>
                      )}

                      {/* Métricas específicas de Outdoor */}
                      {isOutdoor ? (
                        <>
                          {sesion.distancia_km > 0 && (
                            <span className="flex items-center gap-1 font-bold text-sky-400">
                              <MapPin className="w-3.5 h-3.5" />
                              {sesion.distancia_km} km
                            </span>
                          )}
                          {sesion.ritmo_min_km && (
                            <span className="flex items-center gap-1 font-bold text-emerald-400">
                              <TrendingUp className="w-3.5 h-3.5" />
                              {sesion.ritmo_min_km}/km
                            </span>
                          )}
                          {sesion.velocidad_kmh > 0 && (
                            <span className="flex items-center gap-1 font-bold text-emerald-400">
                              <TrendingUp className="w-3.5 h-3.5" />
                              {sesion.velocidad_kmh} km/h
                            </span>
                          )}
                          {sesion.desnivel_positivo_m > 0 && (
                            <span className="flex items-center gap-1 font-bold text-purple-400">
                              <Mountain className="w-3.5 h-3.5" />
                              +{sesion.desnivel_positivo_m}m
                            </span>
                          )}
                          {sesion.calorias_quemadas > 0 && (
                            <span className="flex items-center gap-1 text-amber-400 font-bold">
                              <Flame className="w-3.5 h-3.5" />
                              {sesion.calorias_quemadas} kcal
                            </span>
                          )}
                        </>
                      ) : (
                        totalVolumen > 0 && (
                          <span className="flex items-center gap-1 text-emerald-400 font-bold">
                            <Dumbbell className="w-3.5 h-3.5" />
                            {Math.round(totalVolumen).toLocaleString()} kg volumen
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
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

                {/* Detalle de la Sesión */}
                {isExpanded && (
                  <div className="border-t border-slate-800/80 p-5 space-y-4 bg-slate-950/40">
                    {/* Tarjetas de Resumen para Outdoor */}
                    {isOutdoor && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pb-2">
                        {sesion.distancia_km > 0 && (
                          <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Distancia</span>
                            <div className="text-lg font-black text-sky-400 font-mono">{sesion.distancia_km} km</div>
                          </div>
                        )}
                        {(sesion.ritmo_min_km || sesion.velocidad_kmh > 0) && (
                          <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                              {sesion.deporte === 'ciclismo' ? 'Velocidad' : 'Ritmo'}
                            </span>
                            <div className="text-lg font-black text-emerald-400 font-mono">
                              {sesion.deporte === 'ciclismo' ? `${sesion.velocidad_kmh} km/h` : `${sesion.ritmo_min_km}/km`}
                            </div>
                          </div>
                        )}
                        {sesion.desnivel_positivo_m > 0 && (
                          <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Desnivel (+D)</span>
                            <div className="text-lg font-black text-purple-400 font-mono">+{sesion.desnivel_positivo_m} m</div>
                          </div>
                        )}
                        {sesion.peso_mochila_kg > 0 && (
                          <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Mochila</span>
                            <div className="text-lg font-black text-amber-400 font-mono">{sesion.peso_mochila_kg} kg</div>
                          </div>
                        )}
                        {sesion.calorias_quemadas > 0 && (
                          <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Calorías</span>
                            <div className="text-lg font-black text-amber-400 font-mono">{sesion.calorias_quemadas} kcal</div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Vueltas / Laps si existen */}
                    {sesion.vueltas_laps && sesion.vueltas_laps.length > 0 && (
                      <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                        <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5">
                          <Flag className="w-3.5 h-3.5 text-sky-400" />
                          Parciales / Vueltas
                        </span>
                        <div className="space-y-1 text-xs">
                          {sesion.vueltas_laps.map((lap, lIdx) => (
                            <div key={lIdx} className="flex justify-between bg-slate-950/60 p-2 rounded-xl border border-slate-800/60 font-mono">
                              <span className="font-bold text-sky-400">Lap #{lap.numero || lIdx + 1}</span>
                              <span className="text-white">{lap.tiempo}</span>
                              <span className="text-slate-300">{lap.distancia} km</span>
                              <span className="text-emerald-400">{lap.ritmo}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Series de Fuerza (si no es outdoor o tiene ejercicios de gym) */}
                    {!isOutdoor && exercisesGrouped.length > 0 && (
                      exercisesGrouped.map((item, idx) => {
                        const note = item.series.find(s => s.notas)?.notas;
                        return (
                          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-bold text-white text-sm">{item.nombre}</h4>
                                {note && (
                                  <div className="mt-1 flex items-center gap-1.5 text-[11px] text-amber-300 font-medium bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/20 w-fit">
                                    <FileText className="w-3 h-3 text-amber-400 shrink-0" />
                                    <span>{note}</span>
                                  </div>
                                )}
                              </div>
                              <span className="text-[10px] font-semibold text-sky-400 px-2 py-0.5 rounded-md bg-sky-500/10">
                                {item.grupo_muscular}
                              </span>
                            </div>

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
                        );
                      })
                    )}

                    {/* Notas de Check-in y Ánimo del Coach */}
                    {sesion.checkin_notas && (
                      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-200 flex items-center gap-2.5">
                        <span className="text-xl">🤖</span>
                        <div className="min-w-0">
                          <strong className="text-amber-400 block text-[11px] uppercase tracking-wider">Check-in de Ánimo & Salud</strong>
                          <span className="text-slate-300 leading-relaxed">{sesion.checkin_notas}</span>
                        </div>
                      </div>
                    )}

                    {sesion.notas && (
                      <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 italic">
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
