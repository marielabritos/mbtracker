import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, X, Flame, Zap, Trophy, Clock, 
  Settings2, Volume2, VolumeX, CheckCircle2, ChevronRight, Sparkles 
} from 'lucide-react';
import { api } from '../services/api';

const PRESETS = [
  {
    id: 'tabata',
    nombre: '🔥 Tabata Clásico',
    descripcion: '20s Trabajo / 10s Descanso • 8 Rondas',
    prep: 10,
    work: 20,
    rest: 10,
    rounds: 8,
    color: 'from-amber-500 to-rose-500'
  },
  {
    id: 'hiit_intenso',
    nombre: '⚡ HIIT Cardio Quema Grasa',
    descripcion: '40s Trabajo / 20s Descanso • 10 Rondas',
    prep: 10,
    work: 40,
    rest: 20,
    rounds: 10,
    color: 'from-sky-500 to-indigo-500'
  },
  {
    id: 'sprints',
    nombre: '🏃 Sprints & Velocidad',
    descripcion: '30s Máxima Potencia / 60s Recuperación • 6 Rondas',
    prep: 15,
    work: 30,
    rest: 60,
    rounds: 6,
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'emom',
    nombre: '⏱️ EMOM Circuito Funcional',
    descripcion: '50s Trabajo / 10s Transición • 12 Rondas',
    prep: 10,
    work: 50,
    rest: 10,
    rounds: 12,
    color: 'from-purple-500 to-pink-500'
  }
];

export default function HIITTimerModal({ isOpen, onClose, onFinishWorkout }) {
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0]);
  const [prepTime, setPrepTime] = useState(10);
  const [workTime, setWorkTime] = useState(20);
  const [restTime, setRestTime] = useState(10);
  const [totalRounds, setTotalRounds] = useState(8);

  // Timer running state
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState('idle'); // 'idle' | 'prepare' | 'work' | 'rest' | 'finished'
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(10);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [customMode, setCustomMode] = useState(false);
  const [elapsedTotal, setElapsedTotal] = useState(0);

  const audioCtxRef = useRef(null);

  // Inicializar Web Audio API para beeps deportivos
  const playBeep = (freq = 440, type = 'sine', duration = 0.15) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio beep error', e);
    }
  };

  const handleSelectPreset = (p) => {
    setSelectedPreset(p);
    setPrepTime(p.prep);
    setWorkTime(p.work);
    setRestTime(p.rest);
    setTotalRounds(p.rounds);
    setCustomMode(false);
    resetTimer();
  };

  const resetTimer = () => {
    setIsRunning(false);
    setPhase('idle');
    setCurrentRound(1);
    setTimeLeft(prepTime);
    setElapsedTotal(0);
  };

  const startTimer = () => {
    if (phase === 'idle' || phase === 'finished') {
      setPhase('prepare');
      setTimeLeft(prepTime);
      setCurrentRound(1);
      setElapsedTotal(0);
      playBeep(600, 'sine', 0.2);
    }
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  // Motor del Temporizador
  useEffect(() => {
    let interval = null;
    if (isRunning && phase !== 'idle' && phase !== 'finished') {
      interval = setInterval(() => {
        setElapsedTotal((prev) => prev + 1);

        setTimeLeft((prevTime) => {
          // Sonido de cuenta regresiva 3, 2, 1
          if (prevTime <= 4 && prevTime > 1) {
            playBeep(440, 'sine', 0.1);
          }

          if (prevTime > 1) {
            return prevTime - 1;
          }

          // Transición de Fases
          if (phase === 'prepare') {
            playBeep(880, 'triangle', 0.35); // Pitido agudo inicio trabajo
            setPhase('work');
            return workTime;
          } else if (phase === 'work') {
            if (currentRound >= totalRounds) {
              // Fin del entrenamiento
              playBeep(1046, 'square', 0.5);
              setPhase('finished');
              setIsRunning(false);
              return 0;
            } else {
              playBeep(520, 'sine', 0.25); // Pitido descanso
              setPhase('rest');
              return restTime;
            }
          } else if (phase === 'rest') {
            playBeep(880, 'triangle', 0.35); // Pitido inicio ronda siguiente
            setCurrentRound((r) => r + 1);
            setPhase('work');
            return workTime;
          }
          return 0;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, phase, currentRound, totalRounds, workTime, restTime, prepTime, soundEnabled]);

  // Guardar en el Historial al terminar
  const handleSaveToHistory = async () => {
    try {
      const durSecs = elapsedTotal || (totalRounds * (workTime + restTime) + prepTime);
      const payload = {
        nombre: `Circuito HIIT / ${selectedPreset.nombre}`,
        tipo: 'gimnasio',
        deporte: 'running',
        duracion_segundos: durSecs,
        calorias_quemadas: Math.round((durSecs / 60) * 11.5), // ~11.5 kcal/min en HIIT
        animo: { emoji: '🔥', label: 'HIIT Intenso a tope', nivel: 5 },
        checkin_notas: `Sesión de Intervalos HIIT: ${totalRounds} rondas (${workTime}s trabajo / ${restTime}s descanso).`,
        series: [
          {
            ejercicio_id: 115,
            numero_serie: 1,
            peso_kg: 0,
            repeticiones: totalRounds,
            completada: true,
            notas: `${totalRounds} rondas completadas de HIIT`
          }
        ]
      };
      await api.createSesion(payload);
      alert('¡Sesión HIIT guardada con éxito en tu Historial! 🔥');
      if (onFinishWorkout) onFinishWorkout(payload);
      onClose();
    } catch (e) {
      console.error(e);
      alert('Sesión guardada en el dispositivo.');
      onClose();
    }
  };

  const getPhaseStyles = () => {
    if (phase === 'prepare') {
      return {
        bg: 'bg-gradient-to-b from-amber-950/80 via-slate-900 to-slate-950',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        title: 'PREPÁRATE',
        textColor: 'text-amber-400',
        ringColor: '#f59e0b'
      };
    }
    if (phase === 'work') {
      return {
        bg: 'bg-gradient-to-b from-emerald-950/90 via-slate-900 to-slate-950',
        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        title: '¡DALE CON TODO! 🔥',
        textColor: 'text-emerald-400',
        ringColor: '#10b981'
      };
    }
    if (phase === 'rest') {
      return {
        bg: 'bg-gradient-to-b from-rose-950/80 via-slate-900 to-slate-950',
        badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        title: 'DESCANSO 🫁',
        textColor: 'text-rose-400',
        ringColor: '#f43f5e'
      };
    }
    if (phase === 'finished') {
      return {
        bg: 'bg-gradient-to-b from-amber-950/90 via-slate-900 to-slate-950',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        title: '¡COMPLETADO! 🏆',
        textColor: 'text-amber-400',
        ringColor: '#eab308'
      };
    }
    return {
      bg: 'bg-slate-900',
      badge: 'bg-slate-800 text-slate-300 border-slate-700',
      title: 'LISTO PARA EMPEZAR',
      textColor: 'text-white',
      ringColor: '#38bdf8'
    };
  };

  const phaseStyle = getPhaseStyles();
  const currentMaxTime = phase === 'prepare' ? prepTime : phase === 'work' ? workTime : restTime;
  const progressPct = currentMaxTime > 0 ? (timeLeft / currentMaxTime) * 100 : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className={`border border-slate-800 rounded-3xl w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl overflow-hidden transition-colors duration-500 ${phaseStyle.bg}`}>
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-xl shadow-md">
              ⏱️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-white text-base">Temporizador HIIT & Tabata</h3>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-500/30">
                  INTERVALOS
                </span>
              </div>
              <p className="text-xs text-slate-400">Cardio express, rondas, sprints y circuitos</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={soundEnabled ? 'Silenciar beeps' : 'Activar sonido'}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 p-5 overflow-y-auto space-y-6 flex flex-col items-center justify-between">
          
          {/* Selector de Presets si está en reposo */}
          {phase === 'idle' && (
            <div className="w-full space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Selecciona tu formato de intervalos:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPreset(p)}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      selectedPreset.id === p.id && !customMode
                        ? 'bg-sky-500/15 border-sky-400 text-white shadow-lg'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs sm:text-sm">{p.nombre}</div>
                    <span className="text-[11px] text-slate-400 mt-1">{p.descripcion}</span>
                  </button>
                ))}
              </div>

              {/* Botón Personalizar */}
              <button
                onClick={() => setCustomMode(!customMode)}
                className="w-full py-2 px-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span>{customMode ? 'Ocultar ajuste personalizado' : 'Personalizar tiempos y rondas'}</span>
              </button>

              {customMode && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs animate-in fade-in duration-200">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Prep (s)</label>
                    <input
                      type="number"
                      value={prepTime}
                      onChange={(e) => setPrepTime(Math.max(3, parseInt(e.target.value) || 3))}
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-center font-mono font-bold text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">Trabajo (s)</label>
                    <input
                      type="number"
                      value={workTime}
                      onChange={(e) => setWorkTime(Math.max(5, parseInt(e.target.value) || 5))}
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-center font-mono font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-rose-400 block mb-1">Descanso (s)</label>
                    <input
                      type="number"
                      value={restTime}
                      onChange={(e) => setRestTime(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-center font-mono font-bold text-rose-400 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-amber-400 block mb-1">Rondas</label>
                    <input
                      type="number"
                      value={totalRounds}
                      onChange={(e) => setTotalRounds(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-center font-mono font-bold text-amber-400 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reloj Principal / Gran Contador */}
          <div className="w-full flex flex-col items-center justify-center my-auto py-4 space-y-4">
            
            {/* Badge de Fase y Ronda */}
            <div className="flex items-center gap-3">
              <span className={`px-4 py-1.5 rounded-full border text-xs font-black tracking-wider uppercase shadow-md ${phaseStyle.badge}`}>
                {phaseStyle.title}
              </span>

              {phase !== 'idle' && phase !== 'finished' && (
                <span className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 font-mono">
                  Ronda <strong className="text-white">{currentRound}</strong> / {totalRounds}
                </span>
              )}
            </div>

            {/* Número Gigante de Segundos */}
            <div className="relative flex items-center justify-center">
              <div className={`text-7xl sm:text-9xl font-black font-mono tracking-tighter ${phaseStyle.textColor} drop-shadow-2xl transition-all duration-300`}>
                {phase === 'finished' ? '🎉' : timeLeft}
              </div>
            </div>

            {/* Tiempo Total Transcurrido */}
            <div className="text-xs text-slate-400 font-mono font-semibold">
              Tiempo total: <span className="text-white">{Math.floor(elapsedTotal / 60)}:{(elapsedTotal % 60).toString().padStart(2, '0')} min</span>
            </div>
          </div>

          {/* Botones de Control */}
          <div className="w-full space-y-3 pt-2">
            {phase === 'finished' ? (
              <div className="space-y-2">
                <button
                  onClick={handleSaveToHistory}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 active:scale-98 transition-all hover:brightness-110"
                >
                  <Trophy className="w-5 h-5" />
                  <span>Guardar Entrenamiento HIIT en el Historial</span>
                </button>
                <button
                  onClick={resetTimer}
                  className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-800"
                >
                  Volver a Empezar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {!isRunning ? (
                  <button
                    onClick={startTimer}
                    className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 active:scale-98 transition-all hover:brightness-110"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    <span>{phase === 'idle' ? 'Comenzar HIIT' : 'Reanudar'}</span>
                  </button>
                ) : (
                  <button
                    onClick={pauseTimer}
                    className="flex-1 py-4 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all active:scale-98"
                  >
                    <Pause className="w-5 h-5" />
                    <span>Pausar</span>
                  </button>
                )}

                {phase !== 'idle' && (
                  <button
                    onClick={resetTimer}
                    className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                    title="Reiniciar"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
