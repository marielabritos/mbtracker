import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, RefreshCw, Flag, MapPin, Flame, 
  TrendingUp, Mountain, Compass, Heart, Award, 
  Sparkles, CheckCircle2, ChevronRight, ArrowLeft, Save, Plus, Trash2, Clock 
} from 'lucide-react';
import { sound } from '../utils/sound';

export default function OutdoorWorkoutTracker({ defaultActivity = 'running', onFinish, onCancel }) {
  const [activity, setActivity] = useState(defaultActivity); // 'running' | 'ciclismo' | 'montanismo'
  const [sessionTitle, setSessionTitle] = useState(() => {
    if (defaultActivity === 'running') return 'Sesión de Running';
    if (defaultActivity === 'ciclismo') return 'Ruta en Bicicleta';
    if (defaultActivity === 'montanismo') return 'Ascenso & Montañismo';
    return 'Entrenamiento al Aire Libre';
  });

  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [distanceKm, setDistanceKm] = useState('0.00');
  const [elevationGainM, setElevationGainM] = useState('0');
  const [backpackKg, setBackpackKg] = useState('0');
  const [heartRateBpm, setHeartRateBpm] = useState('140');
  const [notes, setNotes] = useState('');
  const [laps, setLaps] = useState([]);
  const [userWeight, setUserWeight] = useState(62);

  // Cargar peso del perfil para cálculo calórico exacto
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('mbtracker_user_profile');
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        if (parsed.peso_kg) setUserWeight(parseFloat(parsed.peso_kg) || 62);
      }
    } catch (e) {}
  }, []);

  // Cronómetro en vivo
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const handleToggleTimer = () => {
    if (!isActive) {
      sound.playSuccess();
    } else {
      sound.playClick();
    }
    setIsActive(!isActive);
  };

  const handleResetTimer = () => {
    if (confirm("¿Deseas reiniciar el cronómetro de la sesión?")) {
      setIsActive(false);
      setSeconds(0);
      setLaps([]);
    }
  };

  // Formato HH:MM:SS
  const formatTime = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs > 0 ? String(hrs).padStart(2, '0') + ':' : ''}${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const distNum = parseFloat(distanceKm) || 0;
  const elevNum = parseFloat(elevationGainM) || 0;
  const packNum = parseFloat(backpackKg) || 0;
  const hrNum = parseInt(heartRateBpm) || 140;

  // Cálculo de Ritmo y Velocidad
  let paceMinPerKm = 0;
  let paceFormatted = "--'--\"";
  let speedKmH = 0;

  if (distNum > 0 && seconds > 0) {
    speedKmH = (distNum / (seconds / 3600)).toFixed(1);
    const paceSeconds = Math.round(seconds / distNum);
    const paceMins = Math.floor(paceSeconds / 60);
    const paceSecs = paceSeconds % 60;
    paceFormatted = `${paceMins}'${String(paceSecs).padStart(2, '0')}"`;
    paceMinPerKm = (paceSeconds / 60).toFixed(2);
  }

  // Cálculo de Calorías Quemadas (Fórmula MET)
  // Running: MET ~9.8 | Ciclismo: MET ~7.5 | Montañismo con mochila: MET ~8.5 + lastre
  let met = 9.8;
  if (activity === 'ciclismo') met = 7.5;
  if (activity === 'montanismo') met = 8.5 + (packNum * 0.15);

  const durationHours = seconds / 3600;
  const totalCalories = Math.round(met * (userWeight + packNum) * durationHours);

  // Zona Cardíaca estimada (Basado en FC Max = 220 - 28 = 192 aprox)
  const getHeartRateZone = (hr) => {
    if (hr < 115) return { zone: 'Zona 1', name: 'Recuperación Activa', color: 'text-sky-400 bg-sky-500/10' };
    if (hr < 135) return { zone: 'Zona 2', name: 'Quema de Grasa / Aeróbico Base', color: 'text-emerald-400 bg-emerald-500/10' };
    if (hr < 155) return { zone: 'Zona 3', name: 'Ritmo Aeróbico / Resistencia', color: 'text-amber-400 bg-amber-500/10' };
    if (hr < 172) return { zone: 'Zona 4', name: 'Umbral Anaeróbico', color: 'text-orange-400 bg-orange-500/10' };
    return { zone: 'Zona 5', name: 'Máximo Esfuerzo / VO2 Max', color: 'text-rose-400 bg-rose-500/10' };
  };

  const hrZone = getHeartRateZone(hrNum);

  // Agregar Lap / Vuelta
  const handleAddLap = () => {
    sound.playClick();
    const newLap = {
      numero: laps.length + 1,
      tiempo: formatTime(seconds),
      distancia: distNum.toFixed(2),
      ritmo: paceFormatted
    };
    setLaps(prev => [newLap, ...prev]);
  };

  // Botones de incremento rápido de distancia
  const handleAddDistance = (kmToAdd) => {
    setDistanceKm(prev => {
      const cur = parseFloat(prev) || 0;
      return (cur + kmToAdd).toFixed(2);
    });
  };

  // Guardar y Finalizar
  const handleSaveOutdoorWorkout = () => {
    if (seconds < 10 && distNum <= 0) {
      return alert("Por favor registra al menos unos segundos o distancia antes de guardar.");
    }

    sound.playWorkoutComplete();

    const outdoorData = {
      id: Date.now(),
      fecha: new Date().toISOString(),
      nombre: sessionTitle || `Sesión de ${activity.toUpperCase()}`,
      tipo: 'outdoor_cardio',
      deporte: activity,
      duracion_segundos: seconds,
      duracion_minutos: Math.max(Math.round(seconds / 60), 1),
      distancia_km: distNum,
      velocidad_kmh: parseFloat(speedKmH) || 0,
      ritmo_min_km: paceFormatted,
      desnivel_positivo_m: elevNum,
      peso_mochila_kg: packNum,
      frecuencia_cardiaca_media: hrNum,
      calorias_quemadas: totalCalories,
      vueltas_laps: laps,
      notas: notes,
      dia_rutina_id: null,
      series: [
        {
          ejercicio_id: activity === 'running' ? 45 : activity === 'ciclismo' ? 47 : 49,
          nombre_ejercicio: activity === 'running' ? 'Running' : activity === 'ciclismo' ? 'Ciclismo' : 'Montañismo',
          numero_serie: 1,
          peso_kg: distNum,
          repeticiones: formatTime(seconds),
          completada: true
        }
      ]
    };

    if (onFinish) {
      onFinish(outdoorData);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-5 pb-28 font-sans animate-in fade-in duration-200 select-none">
      {/* Barra Superior con Selector de Deporte */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={onCancel}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Salir sin guardar"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Switcher de Actividades */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setActivity('running');
              setSessionTitle('Sesión de Running');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activity === 'running'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🏃</span>
            <span>Running</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActivity('ciclismo');
              setSessionTitle('Ruta en Bicicleta');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activity === 'ciclismo'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🚴</span>
            <span>Bicicleta</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActivity('montanismo');
              setSessionTitle('Ascenso & Montañismo');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activity === 'montanismo'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>⛰️</span>
            <span>Montañismo</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleSaveOutdoorWorkout}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-1.5 active:scale-95 transition-transform"
        >
          <Save className="w-4 h-4" />
          <span>Finalizar</span>
        </button>
      </div>

      {/* Título de la sesión */}
      <input
        type="text"
        value={sessionTitle}
        onChange={(e) => setSessionTitle(e.target.value)}
        className="w-full bg-transparent border-b border-slate-800 text-xl sm:text-2xl font-black text-white px-1 py-1 focus:outline-none focus:border-sky-500"
      />

      {/* Panel Principal: Cronómetro Gigante */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl relative overflow-hidden">
        <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
          {activity === 'running' ? '🏃 Tiempo de Carrera' : activity === 'ciclismo' ? '🚴 Tiempo de Pedaleo' : '⛰️ Tiempo de Trekking'}
        </div>

        <div className="text-5xl sm:text-7xl font-black font-mono tracking-tight text-white drop-shadow-md">
          {formatTime(seconds)}
        </div>

        {/* Botones de Control de Cronómetro */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleToggleTimer}
            className={`px-8 py-4 rounded-2xl font-black text-base sm:text-lg flex items-center gap-2 shadow-xl transition-all active:scale-95 ${
              isActive
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'bg-gradient-to-r from-sky-500 to-emerald-400 hover:from-sky-400 hover:to-emerald-300 text-slate-950 shadow-sky-500/30'
            }`}
          >
            {isActive ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>{seconds === 0 ? 'Iniciar Actividad' : 'Reanudar'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleAddLap}
            disabled={seconds === 0}
            className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors"
            title="Marcar Vuelta / Lap"
          >
            <Flag className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleResetTimer}
            disabled={seconds === 0}
            className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-40 transition-colors"
            title="Reiniciar"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Métricas Principales en Tiempo Real (Distancia, Ritmo, Calorías, Desnivel) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* 1. Distancia */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase">Distancia</span>
            <MapPin className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <input
              type="number"
              step="0.01"
              value={distanceKm}
              onChange={(e) => setDistanceKm(e.target.value)}
              className="w-24 bg-transparent font-black text-2xl sm:text-3xl text-white focus:outline-none font-mono"
            />
            <span className="text-xs text-slate-400 font-bold">km</span>
          </div>
          {/* Botones rápidos */}
          <div className="flex items-center gap-1 pt-1">
            <button
              type="button"
              onClick={() => handleAddDistance(0.5)}
              className="px-2 py-0.5 rounded-lg bg-slate-800 text-[10px] font-bold text-sky-400 hover:bg-slate-700"
            >
              +0.5
            </button>
            <button
              type="button"
              onClick={() => handleAddDistance(1.0)}
              className="px-2 py-0.5 rounded-lg bg-slate-800 text-[10px] font-bold text-sky-400 hover:bg-slate-700"
            >
              +1k
            </button>
            <button
              type="button"
              onClick={() => handleAddDistance(5.0)}
              className="px-2 py-0.5 rounded-lg bg-slate-800 text-[10px] font-bold text-sky-400 hover:bg-slate-700"
            >
              +5k
            </button>
          </div>
        </div>

        {/* 2. Ritmo / Velocidad */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase">
              {activity === 'ciclismo' ? 'Velocidad' : 'Ritmo Medio'}
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {activity === 'ciclismo' ? `${speedKmH} km/h` : paceFormatted}
          </div>
          <span className="text-[10px] text-slate-400 block">
            {activity === 'ciclismo' ? 'promedio' : 'por kilómetro'}
          </span>
        </div>

        {/* 3. Calorías */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase">Calorías</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
            {totalCalories}
          </div>
          <span className="text-[10px] text-slate-400 block">kcal estimadas</span>
        </div>

        {/* 4. Desnivel Positivo (+D) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase">Desnivel (+D)</span>
            <Mountain className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg text-purple-400 font-bold">+</span>
            <input
              type="number"
              value={elevationGainM}
              onChange={(e) => setElevationGainM(e.target.value)}
              className="w-20 bg-transparent font-black text-2xl sm:text-3xl text-white focus:outline-none font-mono"
            />
            <span className="text-xs text-slate-400 font-bold">m</span>
          </div>
          <span className="text-[10px] text-slate-400 block">metros de subida</span>
        </div>
      </div>

      {/* Parámetros Específicos para Montañismo y Frecuencia Cardíaca */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Frecuencia Cardíaca */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
              <span className="text-xs font-bold uppercase text-slate-300">Frecuencia Cardíaca</span>
            </div>
            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase border border-slate-700 ${hrZone.color}`}>
              {hrZone.zone}: {hrZone.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="number"
              value={heartRateBpm}
              onChange={(e) => setHeartRateBpm(e.target.value)}
              className="w-24 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-lg font-black text-white focus:outline-none font-mono"
            />
            <span className="text-xs text-slate-400 font-semibold">PPM (Pulsaciones por minuto)</span>
          </div>
        </div>

        {/* Peso de Mochila (Para Montañismo / Rucking) */}
        {activity === 'montanismo' && (
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase text-slate-300">Peso de Mochila (Lastre)</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={backpackKg}
                onChange={(e) => setBackpackKg(e.target.value)}
                className="w-24 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-lg font-black text-white focus:outline-none font-mono"
              />
              <span className="text-xs text-slate-400 font-semibold">kg de carga en la espalda</span>
            </div>
          </div>
        )}
      </div>

      {/* Lista de Vueltas / Laps Registrados */}
      {laps.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-4 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Flag className="w-3.5 h-3.5 text-sky-400" />
            Parciales / Vueltas Marcadas ({laps.length})
          </h4>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {laps.map((lap) => (
              <div key={lap.numero} className="flex items-center justify-between text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <span className="font-bold text-sky-400">Vuelta #{lap.numero}</span>
                <span className="font-mono text-white">{lap.tiempo}</span>
                <span className="font-mono text-slate-300">{lap.distancia} km</span>
                <span className="font-mono text-emerald-400 font-semibold">{lap.ritmo}/km</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notas de la Ruta y Sensaciones */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-4 space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
          Notas de la Ruta, Clima o Terreno
        </label>
        <textarea
          rows="2"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ej. Trote matutino por asfalto, 18°C, ritmo progresivo sin molestias en rodilla."
          className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-500 resize-none"
        />
      </div>
    </div>
  );
}
