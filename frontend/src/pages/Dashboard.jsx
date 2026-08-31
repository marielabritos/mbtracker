import React, { useState, useEffect } from 'react';
import { 
  Play, Flame, Trophy, Dumbbell, Clock, ChevronRight, TrendingUp, 
  CalendarCheck, Calendar, Check, X, Eye, Sparkles, CheckCircle2, Zap 
} from 'lucide-react';
import { api } from '../services/api';
import ExerciseModal from '../components/ExerciseModal';

const PROTOCOLS = {
  calentamiento: {
    key: 'calentamiento',
    icon: '🔥',
    nombre: '🔥 Calentamiento & Movilidad Articular',
    descripcion: 'Movilidad escapular, columna y apertura de caderas para preparar el cuerpo.',
    tag: '4 Ejercicios • ~5-8 min',
    badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    ejercicios: [
      { ejercicio_id: 28, nombre: 'Dislocaciones de Hombro con Banda / Pica', grupo_muscular: 'Calentamiento', reps_objetivo: '15 reps', descanso_segundos: 30 },
      { ejercicio_id: 29, nombre: 'Gato-Camello (Cat-Cow) Columna', grupo_muscular: 'Calentamiento', reps_objetivo: '12 reps', descanso_segundos: 30 },
      { ejercicio_id: 30, nombre: 'Rotación Torácica en Cuadrupedia', grupo_muscular: 'Calentamiento', reps_objetivo: '10/lado', descanso_segundos: 30 },
      { ejercicio_id: 31, nombre: 'Apertura de Cadera en 90/90', grupo_muscular: 'Calentamiento', reps_objetivo: '10 reps', descanso_segundos: 30 },
    ]
  },
  rodilla: {
    key: 'rodilla',
    icon: '🦵',
    nombre: '🦵 Rehabilitación de Rodilla & Piernas',
    descripcion: 'Fortalece el tendón rotuliano, activa el vasto medial y estabiliza cadera.',
    tag: '5 Ejercicios • ~10-12 min',
    badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    ejercicios: [
      { ejercicio_id: 32, nombre: 'Sentadilla Isométrica en Pared (Wall Sit)', grupo_muscular: 'Rehabilitación', reps_objetivo: '45s', descanso_segundos: 45 },
      { ejercicio_id: 33, nombre: 'Extensiones Terminales de Rodilla con Banda (TKE)', grupo_muscular: 'Rehabilitación', reps_objetivo: '15/lado', descanso_segundos: 45 },
      { ejercicio_id: 34, nombre: 'Puente de Glúteo Unipodal', grupo_muscular: 'Rehabilitación', reps_objetivo: '12/lado', descanso_segundos: 45 },
      { ejercicio_id: 35, nombre: 'Clamshells / Almejas con Banda', grupo_muscular: 'Rehabilitación', reps_objetivo: '15/lado', descanso_segundos: 45 },
      { ejercicio_id: 36, nombre: 'Monster Walk / Pasos con Banda', grupo_muscular: 'Rehabilitación', reps_objetivo: '20 pasos', descanso_segundos: 45 },
    ]
  },
  tobillo: {
    key: 'tobillo',
    icon: '🦶',
    nombre: '🦶 Rehabilitación de Tobillo & Pie',
    descripcion: 'Mejora la dorsiflexión, previene esguinces y fortalece tendón de Aquiles.',
    tag: '3 Ejercicios • ~8 min',
    badgeColor: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
    ejercicios: [
      { ejercicio_id: 37, nombre: 'Dorsiflexión de Tobillo en Pared', grupo_muscular: 'Rehabilitación', reps_objetivo: '15/lado', descanso_segundos: 30 },
      { ejercicio_id: 38, nombre: 'Elevación de Gemelos Excéntrica a 1 Pierna', grupo_muscular: 'Rehabilitación', reps_objetivo: '12/lado', descanso_segundos: 45 },
      { ejercicio_id: 39, nombre: 'Caminata en Talones y Puntas', grupo_muscular: 'Rehabilitación', reps_objetivo: '40 pasos', descanso_segundos: 30 },
    ]
  },
  estiramientos: {
    key: 'estiramientos',
    icon: '🧘',
    nombre: '🧘 Estiramientos & Vuelta a la Calma',
    descripcion: 'Descompresión de columna, flexibilidad de isquios, cuádriceps y pecho.',
    tag: '5 Ejercicios • ~8-10 min',
    badgeColor: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    ejercicios: [
      { ejercicio_id: 40, nombre: 'Estiramiento de Isquiosurales en Suelo', grupo_muscular: 'Estiramientos', reps_objetivo: '30s', descanso_segundos: 30 },
      { ejercicio_id: 41, nombre: 'Estiramiento de Cuádriceps y Psoas', grupo_muscular: 'Estiramientos', reps_objetivo: '30s', descanso_segundos: 30 },
      { ejercicio_id: 42, nombre: 'Posición del Niño (Child\'s Pose)', grupo_muscular: 'Estiramientos', reps_objetivo: '45s', descanso_segundos: 30 },
      { ejercicio_id: 43, nombre: 'Cobra / Extensión Lumbar Suave', grupo_muscular: 'Estiramientos', reps_objetivo: '30s', descanso_segundos: 30 },
      { ejercicio_id: 44, nombre: 'Estiramiento Pectoral en Pared', grupo_muscular: 'Estiramientos', reps_objetivo: '30s', descanso_segundos: 30 },
    ]
  }
};

export default function Dashboard({ onStartWorkout, onNavigateTab, onOpenCoach }) {
  const [stats, setStats] = useState(null);
  const [rutinas, setRutinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRutinaId, setSelectedRutinaId] = useState('');
  const [selectedDiaId, setSelectedDiaId] = useState('');
  const [activeProtocolModal, setActiveProtocolModal] = useState(null);
  const [selectedExerciseIds, setSelectedExerciseIds] = useState(new Set());
  const [selectedVisualExercise, setSelectedVisualExercise] = useState(null);

  const handleOpenProtocolModal = (protoKey) => {
    const proto = PROTOCOLS[protoKey];
    setActiveProtocolModal(proto);
    setSelectedExerciseIds(new Set(proto.ejercicios.map(e => e.ejercicio_id)));
  };

  const handleToggleExerciseSelection = (ejId) => {
    setSelectedExerciseIds(prev => {
      const next = new Set(prev);
      if (next.has(ejId)) {
        next.delete(ejId);
      } else {
        next.add(ejId);
      }
      return next;
    });
  };

  const handleStartProtocolWorkout = () => {
    if (!activeProtocolModal) return;
    const chosen = activeProtocolModal.ejercicios.filter(e => selectedExerciseIds.has(e.ejercicio_id));
    if (chosen.length === 0) return alert("Por favor selecciona al menos un ejercicio.");

    onStartWorkout({
      nombre: activeProtocolModal.nombre,
      dia_rutina_id: null,
      ejercicios: chosen
    });
    setActiveProtocolModal(null);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, rutinasData] = await Promise.all([
        api.getDashboardStats().catch(() => null),
        api.getRutinas().catch(() => [])
      ]);
      setStats(statsData);
      setRutinas(rutinasData);
      if (rutinasData.length > 0 && rutinasData[0].dias.length > 0) {
        setSelectedRutinaId(rutinasData[0].id);
        setSelectedDiaId(rutinasData[0].dias[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRutinaChange = (rutinaId) => {
    setSelectedRutinaId(rutinaId);
    const rutina = rutinas.find(r => r.id === parseInt(rutinaId));
    if (rutina && rutina.dias.length > 0) {
      setSelectedDiaId(rutina.dias[0].id);
    } else {
      setSelectedDiaId('');
    }
  };

  const handleStartSelected = () => {
    const rutina = rutinas.find(r => r.id === parseInt(selectedRutinaId));
    const dia = rutina?.dias?.find(d => d.id === parseInt(selectedDiaId));
    onStartWorkout({
      nombre: dia ? `${dia.nombre}` : 'Entrenamiento Libre',
      dia_rutina_id: dia?.id || null,
      ejercicios: dia?.ejercicios?.map(e => ({
        ejercicio_id: e.ejercicio_id,
        nombre: e.ejercicio?.nombre || 'Ejercicio',
        grupo_muscular: e.ejercicio?.grupo_muscular || 'General',
        series_objetivo: e.series_objetivo || 3,
        reps_objetivo: e.reps_objetivo || '8-12',
        descanso_segundos: e.descanso_segundos || 90
      })) || []
    });
  };

  const handleStartQuickEmpty = () => {
    onStartWorkout({
      nombre: 'Entrenamiento Libre',
      dia_rutina_id: null,
      ejercicios: []
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-28">
      {/* Header Saludo con Logo MB */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="MB" 
            className="w-12 h-12 rounded-2xl object-contain bg-black border border-slate-800 shadow-xl p-0.5" 
          />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">MB Training Fitness • Mariela Britos</span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">¿Listo para entrenar hoy?</h2>
          </div>
        </div>
        <button
          onClick={handleStartQuickEmpty}
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold border border-slate-700 transition-all"
        >
          <Dumbbell className="w-4 h-4 text-sky-400" />
          Sesión Libre
        </button>
      </div>

      {/* TARJETA INTERACTIVA: 🤖 COACH VIRTUAL MB & CHECK-IN DE ÁNIMO */}
      <div 
        onClick={onOpenCoach}
        className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/80 border border-sky-500/40 hover:border-sky-400/90 transition-all cursor-pointer shadow-xl relative overflow-hidden group active:scale-98"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative shrink-0">
              <img 
                src="/logo.png" 
                alt="Coach MB" 
                className="w-12 h-12 rounded-2xl object-contain bg-black border border-slate-700 p-0.5 shadow-lg group-hover:scale-105 transition-transform" 
              />
              <span className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900 absolute -bottom-0.5 -right-0.5 animate-pulse" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base text-white group-hover:text-sky-300 truncate">
                  Coach Virtual MB • Check-in Diario
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/30">
                  Ánimo & Registro
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-snug">
                ¿Qué vas a entrenar hoy? Registra tu ánimo y molestias para medirlas en el historial.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-sky-500/20 group-hover:brightness-110 transition-all">
            <span>Check-in</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </div>
      </div>

      {/* Hero: Empezar Entrenamiento */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 via-sky-700 to-indigo-950 p-5 sm:p-7 md:p-8 shadow-2xl text-white">
        <div className="relative z-10 space-y-4 max-w-full">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold tracking-wide uppercase text-sky-200 border border-white/15">
            <Flame className="w-3.5 h-3.5 text-amber-300" />
            Entrenamiento del Día
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-tight">Inicia tu rutina ahora</h3>
            <p className="text-sky-100/80 text-xs sm:text-sm mt-1">
              Registra tus series en vivo, visualiza tus pesos anteriores y usa el cronómetro de descanso.
            </p>
          </div>

          {/* Selectores de Rutina & Día Responsivos */}
          {rutinas.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div className="space-y-1 min-w-0">
                <label className="text-[11px] font-bold uppercase tracking-wider text-sky-200 block">Rutina</label>
                <select
                  value={selectedRutinaId}
                  onChange={(e) => handleRutinaChange(e.target.value)}
                  className="w-full bg-slate-900/90 border border-white/20 text-white rounded-2xl px-3.5 py-3 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-400 truncate shadow-inner"
                >
                  {rutinas.map((r) => (
                    <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                      {r.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 min-w-0">
                <label className="text-[11px] font-bold uppercase tracking-wider text-sky-200 block">Día</label>
                <select
                  value={selectedDiaId}
                  onChange={(e) => setSelectedDiaId(e.target.value)}
                  className="w-full bg-slate-900/90 border border-white/20 text-white rounded-2xl px-3.5 py-3 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-400 truncate shadow-inner"
                >
                  {rutinas
                    .find((r) => r.id === parseInt(selectedRutinaId))
                    ?.dias?.map((d) => (
                      <option key={d.id} value={d.id} className="bg-slate-900 text-white">
                        {d.nombre}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          )}

          {/* Badges de Duración y Tiempo */}
          {selectedRutinaId && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-200 bg-black/25 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                <Calendar className="w-3.5 h-3.5 text-amber-300" />
                Vigencia: {rutinas.find(r => r.id === parseInt(selectedRutinaId))?.duracion_semanas || '4 semanas'}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-200 bg-black/25 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                <Clock className="w-3.5 h-3.5 text-sky-300" />
                ~{rutinas.find(r => r.id === parseInt(selectedRutinaId))?.duracion_estimada_minutos || 50} min por sesión
              </span>
            </div>
          )}

          {/* Botones de Acción */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={handleStartSelected}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-black text-sm sm:text-base shadow-xl transition-all active:scale-95"
            >
              <Play className="w-5 h-5 fill-current text-sky-600" />
              Empezar Entrenamiento
            </button>
            <button
              onClick={handleStartQuickEmpty}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/15 transition-all"
            >
              <Dumbbell className="w-4 h-4 text-sky-300" />
              Sesión Libre (Sin Rutina)
            </button>
          </div>
        </div>
      </div>

      {/* Sección Dedicada: Calentamiento, Rehabilitación y Estiramientos */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="font-black text-lg text-white">Movilidad & Rehabilitación</h3>
            <p className="text-xs text-slate-400">Sesiones rápidas para articulaciones, rodilla, tobillo y flexibilidad</p>
          </div>
          <span className="text-[11px] font-bold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/20">
            1 toque
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div 
            onClick={() => handleOpenProtocolModal('calentamiento')}
            className="p-4 rounded-3xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-500/70 hover:bg-slate-800/80 transition-all cursor-pointer group shadow-lg flex flex-col justify-between active:scale-98"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                🔥
              </div>
              <h4 className="font-black text-sm text-white group-hover:text-amber-400">Calentamiento</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">Hombros, columna y caderas</p>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-bold text-amber-400">
              <span>Elegir Ejercicios</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div 
            onClick={() => handleOpenProtocolModal('rodilla')}
            className="p-4 rounded-3xl bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-500/70 hover:bg-slate-800/80 transition-all cursor-pointer group shadow-lg flex flex-col justify-between active:scale-98"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                🦵
              </div>
              <h4 className="font-black text-sm text-white group-hover:text-emerald-400">Rehab Rodilla</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">Tendón rotuliano y glúteo medio</p>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-bold text-emerald-400">
              <span>Elegir Ejercicios</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div 
            onClick={() => handleOpenProtocolModal('tobillo')}
            className="p-4 rounded-3xl bg-slate-900/90 border border-sky-500/30 hover:border-sky-500/70 hover:bg-slate-800/80 transition-all cursor-pointer group shadow-lg flex flex-col justify-between active:scale-98"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                🦶
              </div>
              <h4 className="font-black text-sm text-white group-hover:text-sky-400">Rehab Tobillo</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">Dorsiflexión y tendón de Aquiles</p>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-bold text-sky-400">
              <span>Elegir Ejercicios</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div 
            onClick={() => handleOpenProtocolModal('estiramientos')}
            className="p-4 rounded-3xl bg-slate-900/90 border border-purple-500/30 hover:border-purple-500/70 hover:bg-slate-800/80 transition-all cursor-pointer group shadow-lg flex flex-col justify-between active:scale-98"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                🧘
              </div>
              <h4 className="font-black text-sm text-white group-hover:text-purple-400">Estiramientos</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">Flexibilidad y descompresión</p>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-bold text-purple-400">
              <span>Elegir Ejercicios</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN DESTACADA: 🎯 FUERZA 1RM & 📅 CALENDARIO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Calendario Card */}
        <div 
          onClick={() => onNavigateTab && onNavigateTab('calendario')}
          className="p-5 rounded-3xl bg-gradient-to-br from-sky-950/40 via-slate-900 to-slate-900 border border-sky-500/40 hover:border-sky-400/80 transition-all cursor-pointer group shadow-xl relative overflow-hidden active:scale-98 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-md shadow-sky-500/20 shrink-0">
              📅
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base text-white group-hover:text-sky-400 truncate">
                  Calendario de Sesiones
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-black border border-sky-500/30">
                  NUEVO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-snug truncate">
                Vista mensual interactiva, días activos, constancia y registros.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs shadow-md">
            <span>Ver</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </div>

        {/* 1RM Card */}
        <div 
          onClick={() => onNavigateTab && onNavigateTab('fuerza_1rm')}
          className="p-5 rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/40 hover:border-amber-400/80 transition-all cursor-pointer group shadow-xl relative overflow-hidden active:scale-98 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-md shadow-amber-500/20 shrink-0">
              🎯
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base text-white group-hover:text-amber-400 truncate">
                  Fuerza 1RM (RPMs)
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-snug truncate">
                Calcula tu 1RM, zonas de carga (%1RM) y prueba tu fuerza.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md">
            <span>Calcular</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </div>
      </div>

      {/* SECCIÓN NUEVA: 🏃 DEPORTES Y AIRE LIBRE */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏃</span>
            <h3 className="font-bold text-base sm:text-lg text-white">Deportes & Aire Libre</h3>
          </div>
          <span className="text-xs font-bold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20">
            GPS • KM • Ritmo • Desnivel
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Running */}
          <div
            onClick={() => onStartWorkout({ tipo: 'outdoor_cardio', deporte: 'running', nombre: 'Sesión de Running' })}
            className="p-5 rounded-3xl bg-slate-900/90 border border-sky-500/30 hover:border-sky-400 hover:bg-slate-800/90 transition-all cursor-pointer group shadow-xl flex flex-col justify-between active:scale-98"
          >
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-md shadow-sky-500/20">
                🏃
              </div>
              <h4 className="font-black text-base text-white group-hover:text-sky-400">Running / Carrera</h4>
              <p className="text-xs text-slate-400 leading-snug">
                Seguimiento de distancia (km), ritmo (min/km), calorías, parciales por vuelta y pulsaciones.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-black text-sky-400">
              <span>Iniciar Carrera</span>
              <div className="w-6 h-6 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center shadow-md">
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </div>
            </div>
          </div>

          {/* Bicicleta */}
          <div
            onClick={() => onStartWorkout({ tipo: 'outdoor_cardio', deporte: 'ciclismo', nombre: 'Ruta en Bicicleta' })}
            className="p-5 rounded-3xl bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-400 hover:bg-slate-800/90 transition-all cursor-pointer group shadow-xl flex flex-col justify-between active:scale-98"
          >
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-md shadow-emerald-500/20">
                🚴
              </div>
              <h4 className="font-black text-base text-white group-hover:text-emerald-400">Bicicleta / Ciclismo</h4>
              <p className="text-xs text-slate-400 leading-snug">
                Ruta, montaña o spinning con velocidad media (km/h), tiempo de pedaleo y desnivel.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-black text-emerald-400">
              <span>Iniciar Pedaleo</span>
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-md">
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </div>
            </div>
          </div>

          {/* Montañismo */}
          <div
            onClick={() => onStartWorkout({ tipo: 'outdoor_cardio', deporte: 'montanismo', nombre: 'Ascenso & Montañismo' })}
            className="p-5 rounded-3xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-400 hover:bg-slate-800/90 transition-all cursor-pointer group shadow-xl flex flex-col justify-between active:scale-98"
          >
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-md shadow-amber-500/20">
                ⛰️
              </div>
              <h4 className="font-black text-base text-white group-hover:text-amber-400">Montañismo & Trekking</h4>
              <p className="text-xs text-slate-400 leading-snug">
                Ascensos y senderismo con desnivel positivo acumulado (+D m), peso de mochila (kg) y terreno.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-black text-amber-400">
              <span>Iniciar Trekking</span>
              <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-md">
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas / Estadísticas Rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 md:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total Sesiones</span>
            <Dumbbell className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-black text-white">
              {stats?.total_entrenamientos || 0}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">completadas</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 md:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Racha mensual</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-black text-amber-400">
              {stats?.racha_dias_mes || 0}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">días este mes</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 md:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Volumen 7d</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-black text-emerald-400">
              {stats?.volumen_semanal_kg ? `${Math.round(stats.volumen_semanal_kg).toLocaleString()} kg` : '0 kg'}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">levantados</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 md:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Tiempo Total</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-black text-white">
              {stats?.tiempo_total_minutos ? `${stats.tiempo_total_minutos}m` : '0m'}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">en el gimnasio</span>
          </div>
        </div>
      </div>

      {/* Récords Personales (PRs) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-lg text-white">Tus Mejores Marcas (PRs)</h3>
          </div>
          <button
            onClick={() => onNavigateTab('progreso')}
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
          >
            Ver Progreso <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {stats?.ultimos_prs && stats.ultimos_prs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {stats.ultimos_prs.map((pr) => (
              <div
                key={pr.ejercicio_id}
                className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 transition-all"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/90 block">
                  {pr.grupo_muscular}
                </span>
                <h4 className="font-bold text-slate-200 text-sm mt-0.5 truncate" title={pr.ejercicio_nombre}>
                  {pr.ejercicio_nombre}
                </h4>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-amber-400 font-mono">
                    {pr.peso_maximo_kg} kg
                  </span>
                  <span className="text-xs text-slate-400">× {pr.repeticiones} reps</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 text-center text-slate-400">
            <p className="text-sm">Aún no has registrado récords. ¡Completa tu primer entrenamiento para ver tus marcas aquí!</p>
          </div>
        )}
      </div>

      {/* Últimos Entrenamientos */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-lg text-white">Actividad Reciente</h3>
          </div>
          <button
            onClick={() => onNavigateTab('historial')}
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
          >
            Ver Todo <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {stats?.ultimas_sesiones && stats.ultimas_sesiones.length > 0 ? (
          <div className="space-y-2">
            {stats.ultimas_sesiones.map((sesion) => (
              <div
                key={sesion.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between hover:bg-slate-800/50 transition-all cursor-pointer"
                onClick={() => onNavigateTab('historial')}
              >
                <div>
                  <h4 className="font-bold text-white text-sm">{sesion.nombre}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span>{new Date(sesion.fecha_inicio).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                    <span>•</span>
                    <span>{sesion.series.length} series registradas</span>
                    {sesion.duracion_segundos > 0 && (
                      <>
                        <span>•</span>
                        <span>{Math.round(sesion.duracion_segundos / 60)} min</span>
                      </>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500" />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 text-center text-slate-400">
            <p className="text-sm">No hay entrenamientos recientes registrados.</p>
          </div>
        )}
      </div>

      {/* Modal Interactivo de Protocolo (Calentamiento / Rehabilitación / Estiramientos) */}
      {activeProtocolModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            {/* Header del Protocolo */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{activeProtocolModal.icon}</span>
                  <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border ${activeProtocolModal.badgeColor}`}>
                    {activeProtocolModal.tag}
                  </span>
                </div>
                <h3 className="font-black text-lg sm:text-xl text-white mt-1">
                  {activeProtocolModal.nombre}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {activeProtocolModal.descripcion}
                </p>
              </div>

              <button
                onClick={() => setActiveProtocolModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selector: Seleccionar Todo / Deseleccionar */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="font-semibold">
                Seleccionados: <strong className="text-sky-400">{selectedExerciseIds.size}</strong> de {activeProtocolModal.ejercicios.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedExerciseIds(new Set(activeProtocolModal.ejercicios.map(e => e.ejercicio_id)))}
                  className="text-sky-400 hover:underline font-bold"
                >
                  Todos
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setSelectedExerciseIds(new Set())}
                  className="text-slate-400 hover:underline"
                >
                  Ninguno
                </button>
              </div>
            </div>

            {/* Lista de Ejercicios con Checkbox y Ver Video / Técnica */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {activeProtocolModal.ejercicios.map((ej) => {
                const isSelected = selectedExerciseIds.has(ej.ejercicio_id);
                return (
                  <div
                    key={ej.ejercicio_id}
                    onClick={() => handleToggleExerciseSelection(ej.ejercicio_id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-slate-950 border-sky-500/50 shadow-md'
                        : 'bg-slate-950/40 border-slate-800/80 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                        isSelected ? 'bg-sky-500 text-slate-950' : 'border border-slate-700 bg-slate-900'
                      }`}>
                        {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>

                      <div className="min-w-0">
                        <h4 className="font-bold text-white text-xs sm:text-sm truncate">{ej.nombre}</h4>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-mono">
                          <span className="text-sky-400 font-semibold">{ej.reps_objetivo}</span>
                          <span>• descanso {ej.descanso_segundos}s</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVisualExercise({ id: ej.ejercicio_id, nombre: ej.nombre, grupo_muscular: ej.grupo_muscular });
                      }}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-sky-400 hover:text-sky-300 border border-slate-800 flex items-center gap-1 text-xs font-bold shrink-0 transition-colors"
                      title="Ver técnica y video real de YouTube"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Técnica</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Botón Inferior: Play y Comenzar Sesión */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleStartProtocolWorkout}
                disabled={selectedExerciseIds.size === 0}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-sky-500/25 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-40"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Empezar Sesión ({selectedExerciseIds.size} ejercicios)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Demostración Visual / Video de YouTube */}
      {selectedVisualExercise && (
        <ExerciseModal
          exercise={selectedVisualExercise}
          onClose={() => setSelectedVisualExercise(null)}
        />
      )}
    </div>
  );
}
