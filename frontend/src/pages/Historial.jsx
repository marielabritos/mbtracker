import React, { useState, useEffect } from 'react';
import { 
  History, Calendar, Clock, Dumbbell, Trophy, Trash2, 
  ChevronDown, ChevronUp, MapPin, TrendingUp, Flame, Mountain, Heart, Compass, Flag, FileText,
  Plus, Sparkles, Download, Upload, Copy, Check, X, Award
} from 'lucide-react';
import { api, DEFAULT_RUTINAS, DEFAULT_EJERCICIOS } from '../services/api';

export default function Historial() {
  const [sesiones, setSesiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSession, setExpandedSession] = useState(null);

  // Modales de Recuperación y Respaldo
  const [showManualModal, setShowManualModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [backupJson, setBackupJson] = useState('');
  const [copiedBackup, setCopiedBackup] = useState(false);

  // Formulario de Sesión Manual / Pasada
  const getYesterdayStr = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  };

  const [manualDate, setManualDate] = useState(getYesterdayStr());
  const [manualTime, setManualTime] = useState('18:00');
  const [manualName, setManualName] = useState('Tren Inferior - Glúteos, cuadriceps, pantorillas');
  const [manualDuration, setManualDuration] = useState(50);
  const [manualMood, setManualMood] = useState({ emoji: '🔥', label: 'A tope / Excelente', nivel: 5 });
  const [manualExercises, setManualExercises] = useState([]);

  useEffect(() => {
    loadSesiones();
  }, []);

  // Cargar ejercicios por defecto cuando se abre el modal
  useEffect(() => {
    if (showManualModal && manualExercises.length === 0) {
      loadPresetExercisesForManual(manualName);
    }
  }, [showManualModal]);

  const loadPresetExercisesForManual = (routineName) => {
    if (routineName.includes('Tren Inferior') || routineName.includes('Glúteos')) {
      setManualExercises([
        { id: 48, nombre: 'Prensa de Piernas 45°', grupo_muscular: 'Piernas', series: [{ peso: 80, reps: 10 }, { peso: 90, reps: 10 }, { peso: 100, reps: 10 }] },
        { id: 120, nombre: 'Pantorrilla en Prensa 45°', grupo_muscular: 'Piernas', series: [{ peso: 60, reps: 12 }, { peso: 60, reps: 12 }, { peso: 60, reps: 12 }] },
        { id: 26, nombre: 'Hip Thrust con Barra', grupo_muscular: 'Glúteos', series: [{ peso: 50, reps: 10 }, { peso: 60, reps: 10 }, { peso: 70, reps: 8 }] },
        { id: 33, nombre: 'Abducciones de Cadera en Máquina', grupo_muscular: 'Glúteos', series: [{ peso: 45, reps: 12 }, { peso: 50, reps: 12 }, { peso: 55, reps: 12 }] },
        { id: 58, nombre: 'Elevación de Talones (Gemelos de Pie)', grupo_muscular: 'Piernas', series: [{ peso: 40, reps: 12 }, { peso: 40, reps: 12 }, { peso: 40, reps: 12 }] },
        { id: 77, nombre: 'Extensiones de Tríceps en Polea (Cuerda)', grupo_muscular: 'Brazos', series: [{ peso: 15, reps: 12 }, { peso: 17.5, reps: 10 }, { peso: 20, reps: 10 }] },
        { id: 81, nombre: 'Fondos entre Bancos para Tríceps', grupo_muscular: 'Brazos', series: [{ peso: 0, reps: 12 }, { peso: 0, reps: 12 }, { peso: 0, reps: 12 }] },
      ]);
    } else {
      setManualExercises([
        { id: 1, nombre: 'Press de Banca Plano con Barra', grupo_muscular: 'Pecho', series: [{ peso: 40, reps: 10 }, { peso: 45, reps: 8 }, { peso: 50, reps: 6 }] },
        { id: 60, nombre: 'Press Militar con Mancuernas', grupo_muscular: 'Hombros', series: [{ peso: 12, reps: 10 }, { peso: 14, reps: 10 }, { peso: 14, reps: 8 }] },
        { id: 77, nombre: 'Extensiones de Tríceps en Polea (Cuerda)', grupo_muscular: 'Brazos', series: [{ peso: 15, reps: 12 }, { peso: 15, reps: 12 }, { peso: 17.5, reps: 10 }] },
      ]);
    }
  };

  const loadSesiones = async () => {
    try {
      setLoading(true);
      const data = await api.getSesiones(100);
      setSesiones(data || []);
      if (data && data.length > 0 && !expandedSession) {
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

  // Guardar Sesión Pasada Manualmente
  const handleSaveManualWorkout = async (e) => {
    e.preventDefault();
    try {
      const dateTimeIso = new Date(`${manualDate}T${manualTime}:00`).toISOString();
      const completedSeries = [];

      manualExercises.forEach((ex) => {
        ex.series.forEach((s, sIdx) => {
          const peso = parseFloat(String(s.peso).replace(',', '.')) || 0;
          const reps = parseInt(s.reps) || 10;
          completedSeries.push({
            ejercicio_id: ex.id || 1,
            numero_serie: sIdx + 1,
            peso_kg: peso,
            repeticiones: reps,
            completada: true,
            nombre_ejercicio: ex.nombre,
            ejercicio: { id: ex.id, nombre: ex.nombre, grupo_muscular: ex.grupo_muscular }
          });
        });
      });

      const payload = {
        nombre: manualName || 'Sesión de Fuerza & Glúteos',
        fecha_inicio: dateTimeIso,
        duracion_segundos: (parseInt(manualDuration) || 50) * 60,
        animo: manualMood,
        energia: manualMood.nivel || 5,
        checkin_notas: `Sesión recuperada / registrada: ${manualMood.emoji} ${manualMood.label}`,
        series: completedSeries
      };

      await api.createSesion(payload);
      setShowManualModal(false);
      await loadSesiones();
      alert('¡Entrenamiento registrado y guardado con éxito en tu Historial! 🎉');
    } catch (err) {
      console.error(err);
      alert('Error al guardar sesión');
    }
  };

  // Exportar e Importar Respaldo
  const handleOpenBackup = () => {
    try {
      const allSes = localStorage.getItem('mbtracker_sesiones') || '[]';
      const allRuts = localStorage.getItem('mbtracker_rutinas') || '[]';
      const allPRs = localStorage.getItem('mbtracker_prs') || '[]';
      const backupData = {
        sesiones: JSON.parse(allSes),
        rutinas: JSON.parse(allRuts),
        prs: JSON.parse(allPRs),
        fechaExportacion: new Date().toISOString()
      };
      setBackupJson(JSON.stringify(backupData, null, 2));
      setShowBackupModal(true);
    } catch (e) {
      alert('Error al generar respaldo');
    }
  };

  const handleCopyBackup = () => {
    navigator.clipboard.writeText(backupJson);
    setCopiedBackup(true);
    setTimeout(() => setCopiedBackup(false), 2500);
  };

  const handleImportBackup = () => {
    try {
      const parsed = JSON.parse(backupJson);
      if (parsed.sesiones && Array.isArray(parsed.sesiones)) {
        localStorage.setItem('mbtracker_sesiones', JSON.stringify(parsed.sesiones));
      }
      if (parsed.rutinas && Array.isArray(parsed.rutinas)) {
        localStorage.setItem('mbtracker_rutinas', JSON.stringify(parsed.rutinas));
      }
      if (parsed.prs && Array.isArray(parsed.prs)) {
        localStorage.setItem('mbtracker_prs', JSON.stringify(parsed.prs));
      }
      alert('¡Datos y entrenamientos importados con éxito! 🎉');
      setShowBackupModal(false);
      loadSesiones();
    } catch (e) {
      alert('El formato del código de respaldo no es válido. Asegúrate de pegar el texto completo.');
    }
  };

  // Agrupar las series de una sesión por ejercicio
  const groupSeriesByExercise = (series) => {
    if (!series || !Array.isArray(series)) return [];
    const map = {};
    series.forEach((s) => {
      const ejId = s.ejercicio_id || s.id || Math.random();
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
      {/* Header con Acciones Rápidas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Historial de Entrenamientos</h2>
          <p className="text-sm text-slate-400">Revisa tus sesiones guardadas, racha y registros de fuerza</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowManualModal(true)}
            className="px-3.5 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Registrar Sesión Pasada</span>
          </button>

          <button
            onClick={handleOpenBackup}
            className="px-3 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            title="Sincronizar entre celular y PC"
          >
            <Upload className="w-3.5 h-3.5 text-sky-400" />
            <span>Sincronizar</span>
          </button>
        </div>
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
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-3xl bg-slate-800 flex items-center justify-center mx-auto text-3xl">
            📋
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">Sin entrenamientos en este dispositivo</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mt-1">
              ¿Entrenaste ayer o en otro celular/PC? Puedes registrarlo manualmente con 1 toque o sincronizar tus datos.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setShowManualModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md"
            >
              ➕ Cargar mi entrenamiento de ayer
            </button>
            <button
              onClick={handleOpenBackup}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
            >
              📲 Sincronizar mis datos
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {sesiones.map((sesion) => {
            const isExpanded = expandedSession === sesion.id;
            const isOutdoor = sesion.tipo === 'outdoor_cardio' || sesion.deporte;
            const exercisesGrouped = groupSeriesByExercise(sesion.series);
            const totalVolumen = (sesion.series || []).reduce((acc, s) => acc + ((parseFloat(s.peso_kg) || 0) * (parseInt(s.repeticiones) || 0)), 0);
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
                            {Math.round(totalVolumen).toLocaleString('es-ES')} kg volumen
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
                    <div className="p-1 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-sky-400" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Detalle Desplegable de Ejercicios y Series */}
                {isExpanded && (
                  <div className="border-t border-slate-800 p-5 space-y-4 bg-slate-950/50">
                    
                    {/* Series de Fuerza */}
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
                                  <span className="text-slate-500 font-bold">#{s.numero_serie || sIdx + 1}</span>
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

      {/* MODAL PARA REGISTRAR / RECUPERAR SESIÓN PASADA */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            
            <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">📝</span>
                <div>
                  <h3 className="font-black text-white text-base">Registrar Sesión Pasada</h3>
                  <p className="text-xs text-slate-400">Guarda el entrenamiento de ayer o de cualquier día</p>
                </div>
              </div>
              <button
                onClick={() => setShowManualModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveManualWorkout} className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
              
              {/* Fecha y Hora */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Fecha</label>
                  <input
                    type="date"
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Duración (min)</label>
                  <input
                    type="number"
                    value={manualDuration}
                    onChange={(e) => setManualDuration(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Nombre de Rutina */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Rutina / Sesión</label>
                <select
                  value={manualName}
                  onChange={(e) => {
                    setManualName(e.target.value);
                    loadPresetExercisesForManual(e.target.value);
                  }}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold focus:outline-none focus:border-sky-500"
                >
                  <option value="Tren Inferior - Glúteos, cuadriceps, pantorillas">Tren Inferior - Glúteos, cuadriceps, pantorrillas</option>
                  <option value="Rutina Push / Pull / Legs + Glúteos (PPL)">Rutina Push (Pecho, Hombro, Tríceps)</option>
                  <option value="Rutina Pull (Espalda, Bíceps)">Rutina Pull (Espalda, Bíceps)</option>
                  <option value="Sesión de Glúteos & Piernas">Sesión de Glúteos & Piernas</option>
                  <option value="Entrenamiento Libre">Entrenamiento Libre</option>
                </select>
              </div>

              {/* Estado de Ánimo */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Estado de Ánimo</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { emoji: '🔥', label: 'A tope', nivel: 5 },
                    { emoji: '⚡', label: 'Con energía', nivel: 4 },
                    { emoji: '😊', label: 'Normal', nivel: 3 },
                  ].map((m) => (
                    <button
                      type="button"
                      key={m.nivel}
                      onClick={() => setManualMood(m)}
                      className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        manualMood.nivel === m.nivel 
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      <span>{m.emoji}</span>
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ejercicios y Series a Guardar */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 block">
                  Ejercicios y Series Realizadas ({manualExercises.length}):
                </span>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {manualExercises.map((ex, exIdx) => (
                    <div key={exIdx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-white">
                        <span>#{exIdx + 1} {ex.nombre}</span>
                        <span className="text-[10px] text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md">{ex.grupo_muscular}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {ex.series.map((s, sIdx) => (
                          <div key={sIdx} className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono flex items-center justify-between">
                            <span className="text-slate-500 font-bold">S{sIdx + 1}</span>
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={s.peso}
                                onChange={(e) => {
                                  const updated = [...manualExercises];
                                  updated[exIdx].series[sIdx].peso = e.target.value;
                                  setManualExercises(updated);
                                }}
                                className="w-10 bg-transparent text-right font-bold text-white border-b border-slate-700 focus:outline-none focus:border-sky-400"
                              />
                              <span className="text-slate-400">kg</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 active:scale-98 transition-all hover:brightness-110"
                >
                  💾 Guardar en mi Historial
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL DE SINCRONIZACIÓN Y RESPALDO ENTRE DISPOSITIVOS */}
      {showBackupModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            
            <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">📲</span>
                <div>
                  <h3 className="font-black text-white text-base">Sincronización entre Celular y PC</h3>
                  <p className="text-xs text-slate-400">Copia tus entrenamientos para pasarlos a tu otro dispositivo</p>
                </div>
              </div>
              <button
                onClick={() => setShowBackupModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
              <p className="text-slate-300 leading-relaxed">
                Puedes copiar este código de respaldo en tu celular y pegarlo en tu computadora (o viceversa) para tener exactamente los mismos entrenamientos y récords en todos tus equipos.
              </p>

              <div className="relative">
                <textarea
                  value={backupJson}
                  onChange={(e) => setBackupJson(e.target.value)}
                  rows={8}
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-sky-300 focus:outline-none focus:border-sky-500 resize-none"
                  placeholder="Pega aquí el código de respaldo..."
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopyBackup}
                  className="py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                >
                  {copiedBackup ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedBackup ? '¡Copiado!' : 'Copiar Respaldo'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleImportBackup}
                  className="py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <Upload className="w-4 h-4" />
                  <span>Importar / Restaurar</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
