import React, { useState, useEffect, useRef } from 'react';
import { 
  Footprints, Trophy, Plus, Minus, Play, Pause, RotateCcw, 
  Flame, MapPin, Target, Sparkles, X, CheckCircle2, ChevronRight, TrendingUp
} from 'lucide-react';

const STORAGE_STEPS_KEY = 'mbtracker_steps_data';
const STORAGE_GOAL_KEY = 'mbtracker_steps_goal';

export default function PasosTrackerModal({ isOpen, onClose }) {
  const getTodayStr = () => new Date().toISOString().split('T')[0];

  const [stepsGoal, setStepsGoal] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_GOAL_KEY);
      return saved ? parseInt(saved) : 10000;
    } catch (e) {
      return 10000;
    }
  });

  const [allStepsData, setAllStepsData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_STEPS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const todayStr = getTodayStr();
  const currentTodaySteps = allStepsData[todayStr] || 0;

  // Estado del sensor podómetro en vivo
  const [isTrackingLive, setIsTrackingLive] = useState(false);
  const [liveSessionSteps, setLiveSessionSteps] = useState(0);
  const [sensorPermission, setSensorPermission] = useState('unknown'); // 'granted', 'denied', 'unsupported'
  const [customInputVal, setCustomInputVal] = useState('');

  const lastAccelRef = useRef({ x: 0, y: 0, z: 0 });
  const lastStepTimeRef = useRef(0);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_STEPS_KEY, JSON.stringify(allStepsData));
    } catch (e) {}
  }, [allStepsData]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_GOAL_KEY, stepsGoal.toString());
    } catch (e) {}
  }, [stepsGoal]);

  // Manejar el podómetro en tiempo real con acelerómetro del móvil
  useEffect(() => {
    if (!isTrackingLive) return;

    const handleMotion = (event) => {
      const acc = event.accelerationIncludingGravity || event.acceleration;
      if (!acc) return;

      const x = acc.x || 0;
      const y = acc.y || 0;
      const z = acc.z || 0;

      // Calcular magnitud del vector de aceleración
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      const delta = Math.abs(magnitude - 9.8); // Desviación respecto a la gravedad

      const now = Date.now();
      // Umbral de paso humano típico (delta > 3.0 m/s^2) y al menos 280ms entre pasos
      if (delta > 2.8 && now - lastStepTimeRef.current > 280) {
        lastStepTimeRef.current = now;
        setLiveSessionSteps((prev) => prev + 1);
        addStepsToToday(1);
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [isTrackingLive]);

  const requestSensorPermissionAndStart = async () => {
    // Para dispositivos iOS 13+ (Safari requiere permiso explícito para devicemotion)
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const response = await DeviceMotionEvent.requestPermission();
        if (response === 'granted') {
          setSensorPermission('granted');
          setIsTrackingLive(true);
        } else {
          setSensorPermission('denied');
          alert('Permiso de sensor denegado. Puedes sumar pasos manualmente.');
        }
      } catch (err) {
        console.warn('Sensor permission error', err);
        setIsTrackingLive(true);
      }
    } else {
      // Android / navegadores estándar
      setSensorPermission('granted');
      setIsTrackingLive(true);
    }
  };

  const addStepsToToday = (amount) => {
    setAllStepsData((prev) => {
      const current = prev[todayStr] || 0;
      const updated = Math.max(0, current + amount);
      return { ...prev, [todayStr]: updated };
    });
  };

  const handleSetExactSteps = () => {
    const val = parseInt(customInputVal);
    if (!isNaN(val) && val >= 0) {
      setAllStepsData((prev) => ({ ...prev, [todayStr]: val }));
      setCustomInputVal('');
    }
  };

  const handleResetToday = () => {
    if (confirm('¿Deseas reiniciar el contador de pasos de hoy a 0?')) {
      setAllStepsData((prev) => ({ ...prev, [todayStr]: 0 }));
      setLiveSessionSteps(0);
    }
  };

  // Cálculos derivados
  const percentComplete = Math.min(100, Math.round((currentTodaySteps / stepsGoal) * 100));
  const kmEstimated = (currentTodaySteps * 0.00076).toFixed(2); // ~0.76 metros por paso promedio
  const kcalEstimated = Math.round(currentTodaySteps * 0.04); // ~0.04 kcal por paso

  // Últimos 7 días para historial
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const steps = allStepsData[dateStr] || 0;
    const dayLabel = d.toLocaleDateString('es-ES', { weekday: 'narrow' }).toUpperCase();
    last7Days.push({ dateStr, steps, dayLabel, isToday: dateStr === todayStr });
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-xl shadow-md">
              👟
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-white text-base">Podómetro & Pasos Diarios</h3>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/30">
                  MB ACTIVIDAD
                </span>
              </div>
              <p className="text-xs text-slate-400">Contador en tiempo real y registro de actividad diaria</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-5">
          
          {/* Círculo Principal de Progreso */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 border border-emerald-500/30 shadow-xl text-center relative overflow-hidden">
            <div className="flex flex-col items-center justify-center space-y-2">
              
              <div className="flex items-center gap-2">
                <span className="text-3xl">🚶‍♀️</span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Pasos de Hoy</span>
              </div>

              <div className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                {currentTodaySteps.toLocaleString('es-ES')}
              </div>

              <div className="text-xs text-slate-400 font-medium">
                Meta diaria: <strong className="text-white">{stepsGoal.toLocaleString('es-ES')}</strong> pasos ({percentComplete}%)
              </div>

              {/* Barra de progreso */}
              <div className="w-full max-w-xs bg-slate-800/80 rounded-full h-3.5 p-0.5 border border-slate-700 mt-2">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500 shadow-lg shadow-emerald-500/30"
                  style={{ width: `${percentComplete}%` }}
                />
              </div>

              {percentComplete >= 100 && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 animate-bounce mt-2">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>¡Meta diaria completada con éxito! 🎉</span>
                </div>
              )}
            </div>

            {/* Métricas: Distancia y Calorías */}
            <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-slate-800">
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-center gap-1">
                  <MapPin className="w-3 h-3 text-sky-400" /> Distancia Aprox.
                </span>
                <span className="text-lg font-black text-sky-400 font-mono mt-0.5 block">
                  {kmEstimated} km
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-center gap-1">
                  <Flame className="w-3 h-3 text-amber-400" /> Calorías Estimadas
                </span>
                <span className="text-lg font-black text-amber-400 font-mono mt-0.5 block">
                  {kcalEstimated} kcal
                </span>
              </div>
            </div>
          </div>

          {/* Podómetro Activo en Tiempo Real */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <h4 className="font-bold text-white text-sm">Podómetro en Vivo (Caminar con el Celular)</h4>
              </div>
              {isTrackingLive && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  Contando
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400">
              {isTrackingLive 
                ? 'El sensor del celular está detectando tus pasos activamente mientras caminas o trotas.' 
                : 'Activa el podómetro para que el teléfono cuente tus pasos automáticamente al moverte.'}
            </p>

            <div className="flex items-center gap-2">
              {!isTrackingLive ? (
                <button
                  onClick={requestSensorPermissionAndStart}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-98 transition-all"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Activar Podómetro en Vivo</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsTrackingLive(false)}
                  className="flex-1 py-3 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  <Pause className="w-4 h-4" />
                  <span>Pausar Podómetro</span>
                </button>
              )}
            </div>
          </div>

          {/* Sumar Pasos Rápidos (Smartwatch / Cinta / Manual) */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <span>⚡</span>
              <span>Sumar Pasos Rápidos (Reloj o Cinta de Gym)</span>
            </h4>
            
            <div className="grid grid-cols-4 gap-2">
              {[500, 1000, 2500, 5000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => addStepsToToday(amt)}
                  className="py-2.5 rounded-xl bg-slate-900 hover:bg-sky-500/20 border border-slate-800 hover:border-sky-500/40 text-slate-200 hover:text-sky-300 font-mono font-bold text-xs transition-all active:scale-95 flex flex-col items-center justify-center"
                >
                  <span className="text-sky-400 text-[10px] font-sans font-bold">+</span>
                  <span>{amt >= 1000 ? `${amt / 1000}k` : amt}</span>
                </button>
              ))}
            </div>

            {/* Ingresar valor exacto */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="number"
                value={customInputVal}
                onChange={(e) => setCustomInputVal(e.target.value)}
                placeholder="Ingresar total exacto (ej: 8400)"
                className="flex-1 bg-slate-900 border border-slate-800 focus:border-sky-500 text-white rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
              <button
                onClick={handleSetExactSteps}
                disabled={!customInputVal}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-30 text-slate-950 font-bold text-xs transition-all active:scale-95"
              >
                Fijar
              </button>
            </div>
          </div>

          {/* Historial Últimos 7 Días */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Últimos 7 Días</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono font-normal">
                Promedio: {Math.round(last7Days.reduce((acc, d) => acc + d.steps, 0) / 7).toLocaleString('es-ES')} pasos/día
              </span>
            </h4>

            <div className="grid grid-cols-7 gap-1.5 items-end h-24 pt-2">
              {last7Days.map((d, idx) => {
                const heightPct = Math.min(100, Math.max(10, Math.round((d.steps / stepsGoal) * 100)));
                const isGoalMet = d.steps >= stepsGoal;
                return (
                  <div key={idx} className="flex flex-col items-center justify-end h-full gap-1">
                    <span className="text-[9px] font-mono text-slate-400">
                      {d.steps > 0 ? (d.steps >= 1000 ? `${(d.steps / 1000).toFixed(1)}k` : d.steps) : '0'}
                    </span>
                    <div className="w-full bg-slate-900 rounded-t-lg h-full max-h-16 flex items-end p-0.5">
                      <div 
                        className={`w-full rounded-t-md transition-all ${
                          d.isToday 
                            ? 'bg-amber-400 shadow-md shadow-amber-500/40' 
                            : isGoalMet 
                              ? 'bg-emerald-400' 
                              : 'bg-slate-700'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className={`text-[10px] font-bold ${d.isToday ? 'text-amber-400' : 'text-slate-500'}`}>
                      {d.dayLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ajustar Meta Diaria & Reiniciar */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Meta:</span>
              {[6000, 8000, 10000, 12000].map((goal) => (
                <button
                  key={goal}
                  onClick={() => setStepsGoal(goal)}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono font-bold transition-all ${
                    stepsGoal === goal 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {goal / 1000}k
                </button>
              ))}
            </div>

            <button
              onClick={handleResetToday}
              className="text-slate-500 hover:text-rose-400 text-[11px] font-semibold transition-colors"
            >
              Reiniciar hoy
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
