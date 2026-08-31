import React, { useState, useEffect } from 'react';
import { 
  Check, Plus, Trash2, Timer, Flame, Trophy, 
  ArrowLeft, Save, PlusCircle, Search, X, HelpCircle, ArrowUp, ArrowDown, Award, Sparkles, CheckCircle2, Eye, Edit3, RefreshCw, Compass 
} from 'lucide-react';
import { api } from '../services/api';
import { sound } from '../utils/sound';
import RestTimer from '../components/RestTimer';
import ExerciseModal from '../components/ExerciseModal';
import OutdoorWorkoutTracker from '../components/OutdoorWorkoutTracker';

export default function Entrenar({ workoutData, onFinishWorkout, onCancelWorkout }) {
  const [workoutMode, setWorkoutMode] = useState(() => {
    if (workoutData?.tipo === 'outdoor_cardio') return workoutData?.deporte || 'running';
    return 'gimnasio';
  });
  const [sessionName, setSessionName] = useState(workoutData?.nombre || 'Entrenamiento del Día');
  const [exercises, setExercises] = useState([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(90);
  const [previousRecords, setPreviousRecords] = useState({});
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [showCreateCustomExercise, setShowCreateCustomExercise] = useState(false);
  const [catalogEjercicios, setCatalogEjercicios] = useState([]);
  const [muscleFilter, setMuscleFilter] = useState('Todos');
  const [searchFilter, setSearchFilter] = useState('');
  const [saving, setSaving] = useState(false);
  const [completedModalData, setCompletedModalData] = useState(null);
  const [selectedVisualExercise, setSelectedVisualExercise] = useState(null);

  // Formulario nuevo ejercicio personalizado
  const [newCustomEx, setNewCustomEx] = useState({
    nombre: '',
    grupo_muscular: 'Pecho',
    equipo: 'Mancuerna',
    descripcion: '',
    gif_url: ''
  });

  // Inicializar ejercicios de la rutina seleccionada o sesión libre
  useEffect(() => {
    if (workoutData?.ejercicios && workoutData.ejercicios.length > 0) {
      const initialExercises = workoutData.ejercicios.map((ej) => {
        const numSeries = ej.series_objetivo || 3;
        const seriesList = [];
        for (let i = 1; i <= numSeries; i++) {
          seriesList.push({
            numero_serie: i,
            peso_kg: '',
            repeticiones: '',
            rpe: '',
            completada: false,
          });
        }
        return {
          ejercicio_id: ej.ejercicio_id,
          nombre: ej.nombre,
          grupo_muscular: ej.grupo_muscular,
          descanso_segundos: ej.descanso_segundos || 90,
          reps_objetivo: ej.reps_objetivo || '8-12',
          series: seriesList,
          notas: '',
        };
      });
      setExercises(initialExercises);
      initialExercises.forEach((e) => fetchPreviousRecord(e.ejercicio_id));
    }

    loadCatalog();
  }, [workoutData]);

  const loadCatalog = async () => {
    try {
      const eData = await api.getEjercicios();
      setCatalogEjercicios(eData);
    } catch (e) {
      console.error(e);
    }
  };

  // Cronómetro general de la sesión
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchPreviousRecord = async (ejercicioId) => {
    try {
      const lastSeries = await api.getUltimoRegistroEjercicio(ejercicioId);
      if (lastSeries && lastSeries.length > 0) {
        setPreviousRecords((prev) => ({ ...prev, [ejercicioId]: lastSeries }));
      }
    } catch (e) {
      console.warn("No previous record", e);
    }
  };

  const handleToggleSet = (exIdx, setIdx) => {
    const ex = exercises[exIdx];
    const set = ex.series[setIdx];
    const newStatus = !set.completada;

    const updated = [...exercises];
    updated[exIdx].series[setIdx].completada = newStatus;
    
    // Si no se especificó repeticiones, sugerir el objetivo o 10
    if (newStatus && !updated[exIdx].series[setIdx].repeticiones) {
      const defaultReps = parseInt(ex.reps_objetivo) || 10;
      updated[exIdx].series[setIdx].repeticiones = defaultReps;
    }

    setExercises(updated);

    if (newStatus) {
      sound.playCheck();
      if (navigator.vibrate) navigator.vibrate(50);
      setTimerSeconds(ex.descanso_segundos || 90);
      setIsTimerOpen(true);
    }
  };

  const handleUpdateSetField = (exIdx, setIdx, field, value) => {
    const updated = [...exercises];
    updated[exIdx].series[setIdx][field] = value;
    setExercises(updated);
  };

  const handleAddSet = (exIdx) => {
    const updated = [...exercises];
    const currentSets = updated[exIdx].series;
    const lastSet = currentSets[currentSets.length - 1];
    currentSets.push({
      numero_serie: currentSets.length + 1,
      peso_kg: lastSet?.peso_kg || '',
      repeticiones: lastSet?.repeticiones || '',
      rpe: '',
      completada: false,
    });
    setExercises(updated);
  };

  const handleRemoveSet = (exIdx, setIdx) => {
    const updated = [...exercises];
    updated[exIdx].series = updated[exIdx].series.filter((_, idx) => idx !== setIdx);
    updated[exIdx].series.forEach((s, idx) => {
      s.numero_serie = idx + 1;
    });
    setExercises(updated);
  };

  const [swapExerciseIndex, setSwapExerciseIndex] = useState(null);

  const handleAddExerciseFromCatalog = (ej) => {
    if (swapExerciseIndex !== null) {
      // Reemplazar ejercicio en vivo manteniendo las series ya realizadas
      setExercises((prev) => {
        const copy = [...prev];
        const old = copy[swapExerciseIndex];
        copy[swapExerciseIndex] = {
          ...old,
          ejercicio_id: ej.id,
          nombre: ej.nombre,
          grupo_muscular: ej.grupo_muscular
        };
        return copy;
      });
      fetchPreviousRecord(ej.id);
      setSwapExerciseIndex(null);
      setShowAddExerciseModal(false);
      return;
    }

    const newEx = {
      ejercicio_id: ej.id,
      nombre: ej.nombre,
      grupo_muscular: ej.grupo_muscular,
      descanso_segundos: 90,
      reps_objetivo: '8-12',
      series: [
        { numero_serie: 1, peso_kg: '', repeticiones: '', rpe: '', completada: false },
        { numero_serie: 2, peso_kg: '', repeticiones: '', rpe: '', completada: false },
        { numero_serie: 3, peso_kg: '', repeticiones: '', rpe: '', completada: false },
      ],
      notas: '',
    };
    setExercises((prev) => [...prev, newEx]);
    fetchPreviousRecord(ej.id);
    setShowAddExerciseModal(false);
  };

  const handleDeleteCatalogExercise = async (e, ejId) => {
    e.stopPropagation();
    if (!confirm("¿Deseas eliminar este ejercicio del catálogo?")) return;
    try {
      await api.deleteEjercicio(ejId);
      setCatalogEjercicios((prev) => prev.filter((x) => x.id !== ejId));
    } catch (err) {
      alert("Error al eliminar ejercicio");
    }
  };

  const handleCreateAndAddCustomExercise = async (e) => {
    e.preventDefault();
    if (!newCustomEx.nombre.trim()) return alert("Por favor ingresa un nombre para el ejercicio");
    try {
      const created = await api.createEjercicio(newCustomEx);
      setCatalogEjercicios(prev => [created, ...prev]);
      handleAddExerciseFromCatalog(created);
      setShowCreateCustomExercise(false);
      setNewCustomEx({ nombre: '', grupo_muscular: 'Pecho', equipo: 'Mancuerna', descripcion: '' });
    } catch (err) {
      alert("Error al crear ejercicio: " + err.message);
    }
  };

  const handleRemoveExercise = (exIdx) => {
    setExercises((prev) => prev.filter((_, idx) => idx !== exIdx));
  };

  const handleLoadPreset = (type) => {
    let presetEjercicios = [];
    if (type === 'calentamiento') {
      presetEjercicios = catalogEjercicios.filter(e => e.grupo_muscular === 'Calentamiento');
    } else if (type === 'rodilla') {
      presetEjercicios = catalogEjercicios.filter(e => e.nombre.includes('Wall Sit') || e.nombre.includes('TKE') || e.nombre.includes('Glúteo') || e.nombre.includes('Almejas') || e.nombre.includes('Monster'));
    } else if (type === 'tobillo') {
      presetEjercicios = catalogEjercicios.filter(e => e.nombre.includes('Tobillo') || e.nombre.includes('Gemelos') || e.nombre.includes('Talones'));
    } else if (type === 'estiramientos') {
      presetEjercicios = catalogEjercicios.filter(e => e.grupo_muscular === 'Estiramientos');
    }

    if (presetEjercicios.length === 0) {
      const allCatalog = catalogEjercicios.length > 0 ? catalogEjercicios : [];
      presetEjercicios = allCatalog.filter(e => 
        type === 'calentamiento' ? e.grupo_muscular === 'Calentamiento' :
        type === 'estiramientos' ? e.grupo_muscular === 'Estiramientos' :
        e.grupo_muscular === 'Rehabilitación'
      );
    }

    const formatted = presetEjercicios.map((ej) => ({
      ejercicio_id: ej.id,
      nombre: ej.nombre,
      grupo_muscular: ej.grupo_muscular,
      reps_objetivo: ej.grupo_muscular === 'Estiramientos' ? '30s' : '12-15 reps',
      descanso_segundos: 45,
      series: [
        { numero_serie: 1, peso_kg: '', repeticiones: ej.grupo_muscular === 'Estiramientos' ? '30s' : '12', rpe: '', completada: false },
        { numero_serie: 2, peso_kg: '', repeticiones: ej.grupo_muscular === 'Estiramientos' ? '30s' : '12', rpe: '', completada: false },
      ],
      notas: '',
    }));

    setExercises(prev => [...prev, ...formatted]);
  };

  const handleMoveLiveExercise = (exIdx, direction) => {
    const targetIdx = exIdx + direction;
    if (targetIdx < 0 || targetIdx >= exercises.length) return;
    setExercises((prev) => {
      const copy = [...prev];
      const temp = copy[exIdx];
      copy[exIdx] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
  };

  const handleSaveWorkout = async () => {
    const completedSeries = [];
    exercises.forEach((ex) => {
      ex.series.forEach((s) => {
        const peso = parseFloat(s.peso_kg) || 0;
        const reps = parseInt(s.repeticiones) || 0;
        // Tomar cualquier serie marcada o con datos, o incluir series de ejercicios presentes
        if (s.completada || peso > 0 || reps > 0 || ex.series.length > 0) {
          completedSeries.push({
            ejercicio_id: ex.ejercicio_id || 1,
            numero_serie: s.numero_serie || 1,
            peso_kg: peso,
            repeticiones: reps > 0 ? reps : 10,
            rpe: parseFloat(s.rpe) || null,
            completada: true,
            notas: s.notas || null,
          });
        }
      });
    });

    // Si aún no hay series (sesión libre vacía o cardio/movilidad)
    if (completedSeries.length === 0) {
      completedSeries.push({
        ejercicio_id: 1,
        numero_serie: 1,
        peso_kg: 0,
        repeticiones: 1,
        rpe: null,
        completada: true,
        notas: "Sesión Libre / Movilidad"
      });
    }

    try {
      setSaving(true);
      const payload = {
        nombre: sessionName || 'Entrenamiento Libre',
        dia_rutina_id: workoutData?.dia_rutina_id || null,
        duracion_segundos: elapsedSeconds || 60,
        series: completedSeries,
      };

      const result = await api.createSesion(payload);
      
      const totalVolumen = completedSeries.reduce((acc, s) => acc + (s.peso_kg * s.repeticiones), 0);
      const prCount = result?.series?.filter((s) => s.es_pr)?.length || 0;

      try {
        if (prCount > 0) {
          sound.playPRCelebration();
        } else {
          sound.playTimerDone();
        }
      } catch (audioErr) {
        console.warn("Audio feedback error", audioErr);
      }

      // Mostrar modal de éxito
      setCompletedModalData({
        nombre: sessionName || 'Entrenamiento Libre',
        duracion: formatDuration(elapsedSeconds || 60),
        totalSeries: completedSeries.length,
        volumen: Math.round(totalVolumen),
        prs: prCount,
        sessionResult: result || payload
      });

    } catch (e) {
      console.error("Error al finalizar entrenamiento:", e);
      // Fallback infalible para asegurar que la sesión siempre finalice
      onFinishWorkout({ nombre: sessionName || 'Entrenamiento Libre', duracion_segundos: elapsedSeconds });
    } finally {
      setSaving(false);
    }
  };

  const handleFinishAndRedirect = () => {
    if (completedModalData) {
      onFinishWorkout(completedModalData.sessionResult);
    }
  };

  const formatDuration = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const filteredCatalog = catalogEjercicios.filter((e) => {
    const matchesGroup = muscleFilter === 'Todos' || e.grupo_muscular === muscleFilter;
    const matchesSearch = e.nombre.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  // Si el modo activo es Running, Ciclismo o Montañismo, renderizar el rastreador al aire libre
  if (workoutMode === 'running' || workoutMode === 'ciclismo' || workoutMode === 'montanismo') {
    return (
      <OutdoorWorkoutTracker
        defaultActivity={workoutMode}
        onFinish={async (outdoorData) => {
          try {
            const res = await api.createSesion(outdoorData);
            onFinishWorkout(res || outdoorData);
          } catch (e) {
            onFinishWorkout(outdoorData);
          }
        }}
        onCancel={onCancelWorkout}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 space-y-5 pb-36">
      {/* Selector de Modo de Entrenamiento (Fuerza vs Deportes Outdoor) */}
      <div className="flex items-center justify-between gap-1 p-1 bg-slate-900 rounded-2xl border border-slate-800">
        <button
          type="button"
          onClick={() => setWorkoutMode('gimnasio')}
          className="flex-1 py-1.5 px-2 rounded-xl text-xs font-black bg-sky-500 text-slate-950 shadow-md flex items-center justify-center gap-1.5"
        >
          <span>🏋️</span>
          <span>Gimnasio & Fuerza</span>
        </button>

        <button
          type="button"
          onClick={() => setWorkoutMode('running')}
          className="flex-1 py-1.5 px-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5"
        >
          <span>🏃</span>
          <span>Running</span>
        </button>

        <button
          type="button"
          onClick={() => setWorkoutMode('ciclismo')}
          className="flex-1 py-1.5 px-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5"
        >
          <span>🚴</span>
          <span>Bicicleta</span>
        </button>

        <button
          type="button"
          onClick={() => setWorkoutMode('montanismo')}
          className="flex-1 py-1.5 px-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5"
        >
          <span>⛰️</span>
          <span>Montañismo</span>
        </button>
      </div>

      {/* Top Bar Entrenamiento */}
      <div className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md -mx-3 px-3 py-3 border-b border-slate-800/90 flex items-center justify-between gap-2 shadow-lg">
        <button
          onClick={onCancelWorkout}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Salir del entrenamiento"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center flex-1 min-w-0">
          <input
            type="text"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            className="bg-transparent text-center font-black text-base md:text-lg text-white border-b border-transparent focus:border-sky-500 focus:outline-none w-full truncate"
          />
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-emerald-400 font-semibold mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {formatDuration(elapsedSeconds)}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setTimerSeconds(90);
              setIsTimerOpen(true);
            }}
            className="flex items-center gap-1 p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-sky-400 hover:bg-slate-800 text-xs font-bold"
            title="Cronómetro de descanso"
          >
            <Timer className="w-4 h-4" />
            <span className="hidden sm:inline">Cronómetro</span>
          </button>

          <button
            onClick={handleSaveWorkout}
            disabled={saving}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
            title="Guardar y finalizar"
          >
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            <span>Finalizar</span>
          </button>
        </div>
      </div>

      {/* Lista de Ejercicios */}
      {exercises.length === 0 ? (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-3xl">
              ⚡
            </div>
            <div>
              <h3 className="font-black text-xl text-white">Sesión Libre</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
                Añade ejercicios individuales del catálogo o carga un bloque completo de movilidad y salud con 1 toque.
              </p>
            </div>
            <button
              onClick={() => setShowAddExerciseModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-sm shadow-lg shadow-sky-500/25 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> Añadir Ejercicio del Catálogo
            </button>
          </div>

          {/* Bloques Rápidos de Salud y Movilidad */}
          <div className="bg-slate-900/60 border border-slate-800/90 rounded-3xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300">Cargar Bloque Rápido a la Sesión</h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => handleLoadPreset('calentamiento')}
                className="p-3.5 rounded-2xl bg-slate-950 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/40 text-left transition-all active:scale-95 group"
              >
                <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">🔥</div>
                <div className="font-black text-xs text-white group-hover:text-amber-400">+ Calentamiento</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Movilidad articular</div>
              </button>

              <button
                type="button"
                onClick={() => handleLoadPreset('rodilla')}
                className="p-3.5 rounded-2xl bg-slate-950 hover:bg-emerald-500/10 border border-slate-800 hover:border-emerald-500/40 text-left transition-all active:scale-95 group"
              >
                <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">🦵</div>
                <div className="font-black text-xs text-white group-hover:text-emerald-400">+ Rehab Rodilla</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Wall sit, TKE, glúteo</div>
              </button>

              <button
                type="button"
                onClick={() => handleLoadPreset('tobillo')}
                className="p-3.5 rounded-2xl bg-slate-950 hover:bg-sky-500/10 border border-slate-800 hover:border-sky-500/40 text-left transition-all active:scale-95 group"
              >
                <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">🦶</div>
                <div className="font-black text-xs text-white group-hover:text-sky-400">+ Rehab Tobillo</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Dorsiflexión y gemelos</div>
              </button>

              <button
                type="button"
                onClick={() => handleLoadPreset('estiramientos')}
                className="p-3.5 rounded-2xl bg-slate-950 hover:bg-purple-500/10 border border-slate-800 hover:border-purple-500/40 text-left transition-all active:scale-95 group"
              >
                <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">🧘</div>
                <div className="font-black text-xs text-white group-hover:text-purple-400">+ Estiramientos</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Flexibilidad y calma</div>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {exercises.map((ex, exIdx) => {
            const lastLog = previousRecords[ex.ejercicio_id];
            return (
              <div
                key={exIdx}
                className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-4 sm:p-5 space-y-4 shadow-xl"
              >
                {/* Header Ejercicio */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-sky-500/10 text-sky-400 text-[11px] font-bold uppercase tracking-wider border border-sky-500/20">
                        {ex.grupo_muscular}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Objetivo: {ex.reps_objetivo} reps
                      </span>
                    </div>
                    <div className="flex items-center flex-wrap gap-2 mt-1">
                      <h3 className="font-black text-white text-base sm:text-lg">{ex.nombre}</h3>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedVisualExercise({ id: ex.ejercicio_id, nombre: ex.nombre, grupo_muscular: ex.grupo_muscular })}
                          className="p-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/25 flex items-center gap-1 text-[10px] font-bold transition-colors"
                          title="Ver GIF y técnica correcta"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Técnica</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSwapExerciseIndex(exIdx);
                            setShowAddExerciseModal(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 flex items-center gap-1 text-[10px] font-bold transition-colors"
                          title="Cambiar este ejercicio por otro del catálogo"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Cambiar</span>
                        </button>
                      </div>
                    </div>

                    {/* Referencia Anterior */}
                    {lastLog && lastLog.length > 0 && (
                      <div className="flex items-center gap-1.5 text-xs text-amber-400/90 mt-1 font-mono font-medium">
                        <Flame className="w-3.5 h-3.5" />
                        <span>
                          Última vez: {lastLog.map((s) => `${s.peso_kg}kg×${s.repeticiones}`).join(' • ')}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <div className="flex flex-col gap-0.5">
                      <button
                        type="button"
                        disabled={exIdx === 0}
                        onClick={() => handleMoveLiveExercise(exIdx, -1)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-20 transition-colors"
                        title="Mover ejercicio arriba"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={exIdx === exercises.length - 1}
                        onClick={() => handleMoveLiveExercise(exIdx, 1)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-20 transition-colors"
                        title="Mover ejercicio abajo"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveExercise(exIdx)}
                      className="text-slate-600 hover:text-rose-400 p-2 rounded-xl hover:bg-rose-500/10 transition-colors ml-1"
                      title="Eliminar ejercicio de la sesión"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Tabla de Series */}
                <div className="space-y-2">
                  {/* Encabezados de Columna */}
                  <div className="grid grid-cols-12 gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2">
                    <span className="col-span-2 text-center">Serie</span>
                    <span className="col-span-3 text-center">Anterior</span>
                    <span className="col-span-3 text-center">Kg</span>
                    <span className="col-span-2 text-center">Reps</span>
                    <span className="col-span-2 text-center">Hecho</span>
                  </div>

                  {/* Filas de Series */}
                  {ex.series.map((set, setIdx) => {
                    const prevSet = lastLog && lastLog[setIdx];
                    return (
                      <div
                        key={setIdx}
                        className={`grid grid-cols-12 gap-2 items-center p-2 rounded-2xl transition-all border ${
                          set.completada
                            ? 'bg-emerald-950/20 border-emerald-500/30'
                            : 'bg-slate-950/60 border-slate-800/80'
                        }`}
                      >
                        {/* Número Serie */}
                        <div className="col-span-2 text-center font-bold text-sm font-mono text-slate-300">
                          {set.numero_serie}
                        </div>

                        {/* Marca Anterior */}
                        <div className="col-span-3 text-center text-xs font-mono text-slate-400 truncate">
                          {prevSet ? `${prevSet.peso_kg}kg × ${prevSet.repeticiones}` : '-'}
                        </div>

                        {/* Input Peso */}
                        <div className="col-span-3">
                          <input
                            type="number"
                            step="0.5"
                            inputMode="decimal"
                            placeholder="0"
                            value={set.peso_kg}
                            onChange={(e) => handleUpdateSetField(exIdx, setIdx, 'peso_kg', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700/80 focus:border-sky-400 rounded-xl py-2 px-1 text-center font-black font-mono text-white text-base focus:outline-none"
                          />
                        </div>

                        {/* Input Reps */}
                        <div className="col-span-2">
                          <input
                            type="number"
                            inputMode="numeric"
                            placeholder="0"
                            value={set.repeticiones}
                            onChange={(e) => handleUpdateSetField(exIdx, setIdx, 'repeticiones', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700/80 focus:border-sky-400 rounded-xl py-2 px-1 text-center font-black font-mono text-white text-base focus:outline-none"
                          />
                        </div>

                        {/* Check Button */}
                        <div className="col-span-2 flex justify-center">
                          <button
                            type="button"
                            onClick={() => handleToggleSet(exIdx, setIdx)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                              set.completada
                                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 scale-105'
                                : 'bg-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            <Check className={`w-5 h-5 stroke-[3] ${set.completada ? 'stroke-slate-950' : ''}`} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Botón Añadir Serie */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => handleAddSet(exIdx)}
                    className="flex items-center gap-1.5 text-xs font-bold text-sky-400 hover:text-sky-300 bg-sky-500/10 px-3 py-1.5 rounded-xl border border-sky-500/20 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Añadir Serie
                  </button>

                  {ex.series.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSet(exIdx, ex.series.length - 1)}
                      className="text-slate-500 hover:text-rose-400 text-xs px-2 py-1"
                    >
                      Quitar última
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Botones Inferiores de Acción */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={() => setShowAddExerciseModal(true)}
          className="w-full py-3.5 rounded-2xl border-2 border-dashed border-slate-800 hover:border-sky-500/50 bg-slate-900/40 hover:bg-sky-500/5 text-slate-300 hover:text-sky-400 font-bold text-sm flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Añadir Ejercicio a la Sesión
        </button>

        <button
          type="button"
          disabled={saving}
          onClick={handleSaveWorkout}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
        >
          <CheckCircle2 className="w-5 h-5 fill-current" />
          {saving ? 'Guardando...' : 'Finalizar y Guardar Entrenamiento'}
        </button>
      </div>

      {/* Modal Agregar / Crear Ejercicio */}
      {showAddExerciseModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-white">Añadir Ejercicio</h3>
                <p className="text-xs text-slate-400">Elige del catálogo o crea uno nuevo</p>
              </div>
              <button
                onClick={() => {
                  setShowAddExerciseModal(false);
                  setShowCreateCustomExercise(false);
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Alternar entre Catálogo y Crear Nuevo */}
            {!showCreateCustomExercise ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Buscar ejercicio..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <button
                    onClick={() => setShowCreateCustomExercise(true)}
                    className="flex items-center gap-1 px-3 py-2.5 rounded-2xl bg-sky-500/15 border border-sky-500/30 text-sky-400 font-bold text-xs whitespace-nowrap hover:bg-sky-500/25"
                  >
                    <Plus className="w-3.5 h-3.5" /> + Crear
                  </button>
                </div>

                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {['Todos', 'Glúteos', 'Pecho', 'Espalda', 'Piernas', 'Hombros', 'Brazos', 'Core', 'Calentamiento', 'Rehabilitación', 'Estiramientos', 'Cardio', 'Montañismo'].map((group) => (
                    <button
                      key={group}
                      onClick={() => setMuscleFilter(group)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap ${
                        muscleFilter === group
                          ? 'bg-sky-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {group}
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                  {filteredCatalog.map((ej) => (
                    <div
                      key={ej.id}
                      className="p-3 rounded-2xl bg-slate-950 hover:bg-sky-500/10 border border-slate-800/80 hover:border-sky-500/40 flex items-center justify-between transition-all"
                    >
                      <div 
                        onClick={() => handleAddExerciseFromCatalog(ej)}
                        className="flex-1 cursor-pointer"
                      >
                        <h4 className="font-bold text-white text-sm">{ej.nombre}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-sky-400 font-semibold">{ej.grupo_muscular}</span>
                          {ej.equipo && <span className="text-[10px] text-slate-500">• {ej.equipo}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedVisualExercise(ej)}
                          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-sky-400 border border-slate-800"
                          title="Ver técnica"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteCatalogExercise(e, ej.id)}
                          className="p-2 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 border border-slate-800 transition-colors"
                          title="Eliminar del catálogo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddExerciseFromCatalog(ej)}
                          className="p-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold"
                          title="Seleccionar este ejercicio"
                        >
                          <Plus className="w-4 h-4 stroke-[3]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* Formulario Crear Ejercicio Personalizado */
              <form onSubmit={handleCreateAndAddCustomExercise} className="space-y-3 pt-1">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Nombre del Ejercicio</label>
                  <input
                    type="text"
                    placeholder="Ej. Press Francés con Mancuerna"
                    value={newCustomEx.nombre}
                    onChange={(e) => setNewCustomEx({ ...newCustomEx, nombre: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Grupo Muscular</label>
                    <select
                      value={newCustomEx.grupo_muscular}
                      onChange={(e) => setNewCustomEx({ ...newCustomEx, grupo_muscular: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                    >
                      {['Pecho', 'Espalda', 'Piernas', 'Hombros', 'Brazos', 'Core', 'Cardio'].map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Equipo / Tipo</label>
                    <select
                      value={newCustomEx.equipo}
                      onChange={(e) => setNewCustomEx({ ...newCustomEx, equipo: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                    >
                      {['Mancuerna', 'Barra', 'Máquina', 'Polea', 'Peso Corporal'].map(eq => (
                        <option key={eq} value={eq}>{eq}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Notas / Instrucciones (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Ej. Altura en posición 4"
                    value={newCustomEx.descripcion}
                    onChange={(e) => setNewCustomEx({ ...newCustomEx, descripcion: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowCreateCustomExercise(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    Volver al Catálogo
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs shadow-md shadow-sky-500/20"
                  >
                    Guardar y Usar Ejercicio
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal de Éxito / Celebración al Finalizar */}
      {completedModalData && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 w-full max-w-sm text-center space-y-5 shadow-2xl shadow-emerald-500/10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
              <Check className="w-8 h-8 text-slate-950 stroke-[3]" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">¡Buen trabajo!</span>
              <h3 className="text-xl font-black text-white mt-0.5">Entrenamiento Guardado</h3>
              <p className="text-xs text-slate-400 mt-1 font-medium">{completedModalData.nombre}</p>
            </div>

            {/* Resumen Métricas */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Tiempo</span>
                <span className="text-base font-black text-white font-mono">{completedModalData.duracion}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Series</span>
                <span className="text-base font-black text-sky-400 font-mono">{completedModalData.totalSeries}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Volumen</span>
                <span className="text-base font-black text-emerald-400 font-mono">{completedModalData.volumen} kg</span>
              </div>
            </div>

            {completedModalData.prs > 0 && (
              <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center gap-2 text-amber-300 text-xs font-bold">
                <Trophy className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>¡Lograste {completedModalData.prs} nuevo(s) Récord(s) Personal(es)!</span>
              </div>
            )}

            <button
              onClick={handleFinishAndRedirect}
              className="w-full py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-sm shadow-xl shadow-sky-500/20 transition-all active:scale-95"
            >
              Ver en Historial
            </button>
          </div>
        </div>
      )}

      {/* Temporizador de descanso */}
      {isTimerOpen && (
        <RestTimer
          initialSeconds={timerSeconds}
          onClose={() => setIsTimerOpen(false)}
        />
      )}

      {/* Modal de Demostración Visual / GIF & Técnica */}
      {selectedVisualExercise && (
        <ExerciseModal
          exercise={selectedVisualExercise}
          onClose={() => setSelectedVisualExercise(null)}
          onUpdateExercise={async (updated) => {
            await api.updateEjercicio(updated.id, updated);
            setExercises((prev) =>
              prev.map((e) =>
                e.ejercicio_id === updated.id ? { ...e, nombre: updated.nombre } : e
              )
            );
            setSelectedVisualExercise(null);
          }}
        />
      )}
    </div>
  );
}
