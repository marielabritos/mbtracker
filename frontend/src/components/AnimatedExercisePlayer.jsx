import React, { useState, useEffect } from 'react';
import { Dumbbell, Flame, Sparkles, Play, Pause, RefreshCw, Zap } from 'lucide-react';

export default function AnimatedExercisePlayer({ exerciseName, muscleGroup, animationType }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [phase, setPhase] = useState('Concéntrica (Contracción)');
  const [repCount, setRepCount] = useState(1);

  // Mapeo automático de tipo de animación si no viene definido
  const getAnimType = () => {
    if (animationType) return animationType;
    const name = (exerciseName || '').toLowerCase();
    const group = (muscleGroup || '').toLowerCase();

    if (name.includes('banca') || name.includes('inclinado') || name.includes('pecho') || name.includes('press')) {
      if (name.includes('militar') || name.includes('hombro')) return 'overhead_press';
      return 'bench_press';
    }
    if (name.includes('jalón') || name.includes('dominada') || name.includes('pull-up') || name.includes('pulldown')) return 'lat_pulldown';
    if (name.includes('remo') || name.includes('gironda') || name.includes('serrucho')) return 'barbell_row';
    if (name.includes('lateral') || name.includes('pájaro') || name.includes('face pull')) return 'lateral_raise';
    if (name.includes('sentadilla') || name.includes('prensa') || name.includes('squat')) return 'squat';
    if (name.includes('peso muerto') || name.includes('rumano') || name.includes('thrust') || name.includes('glúteo')) return 'hip_hinge';
    if (name.includes('bíceps') || name.includes('curl')) {
      if (name.includes('femoral')) return 'hip_hinge';
      return 'bicep_curl';
    }
    if (name.includes('tríceps') || name.includes('fondo') || name.includes('francés') || name.includes('cuerda')) return 'tricep_pushdown';
    if (name.includes('plancha') || name.includes('crunch') || name.includes('abdominal') || group.includes('core')) return 'core_crunch';

    if (group.includes('espalda')) return 'lat_pulldown';
    if (group.includes('pierna')) return 'squat';
    if (group.includes('hombro')) return 'overhead_press';
    if (group.includes('brazo')) return 'bicep_curl';
    return 'bench_press';
  };

  const currentType = getAnimType();

  // Simulación de fase concéntrica / excéntrica en bucle
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setPhase((prev) => {
        if (prev.includes('Concéntrica')) {
          return 'Excéntrica (Estiramiento controlado)';
        } else {
          setRepCount((r) => (r >= 12 ? 1 : r + 1));
          return 'Concéntrica (Contracción)';
        }
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-4 relative overflow-hidden shadow-2xl flex flex-col items-center select-none">
      {/* Background Grid Estético */}
      <div className="absolute inset-0 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

      {/* Header Visual con Fase y Repetición */}
      <div className="w-full flex items-center justify-between z-10 text-xs mb-2">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Fase: {phase.split(' ')[0]}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono font-bold text-[11px]">
            Repetición #{repCount}
          </span>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title={isPlaying ? "Pausar" : "Reanudar"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Canvas SVG Interactivo Animado */}
      <div className="w-full max-w-[280px] h-[190px] flex items-center justify-center relative my-1">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            {/* Gradientes Neón */}
            <linearGradient id="neonCyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="neonEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="neonAmber" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Banco / Suelo */}
          <line x1="20" y1="170" x2="180" y2="170" stroke="#334155" strokeWidth="4" strokeLinecap="round" />

          {/* ================= 1. BENCH PRESS (PECHO) ================= */}
          {currentType === 'bench_press' && (
            <g className={isPlaying ? "animate-pulse" : ""}>
              {/* Banco horizontal */}
              <rect x="50" y="125" width="100" height="12" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="2" />
              <line x1="65" y1="137" x2="65" y2="170" stroke="#475569" strokeWidth="4" />
              <line x1="135" y1="137" x2="135" y2="170" stroke="#475569" strokeWidth="4" />

              {/* Atleta acostado */}
              <circle cx="65" cy="118" r="9" fill="#94a3b8" />
              <rect x="75" y="115" width="55" height="12" rx="5" fill="url(#neonCyan)" filter="url(#glow)" />
              {/* Piernas al suelo */}
              <polyline points="128,125 145,145 150,170" fill="none" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />

              {/* Brazos & Barra moviéndose arriba y abajo */}
              <g className={`transition-all duration-700 ease-in-out ${phase.includes('Concéntrica') ? '-translate-y-9' : 'translate-y-1'}`}>
                {/* Brazos */}
                <line x1="85" y1="120" x2="85" y2="85" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
                <line x1="115" y1="120" x2="115" y2="85" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
                {/* Barra de pesas */}
                <line x1="45" y1="83" x2="155" y2="83" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
                {/* Discos */}
                <rect x="42" y="68" width="8" height="30" rx="3" fill="url(#neonAmber)" />
                <rect x="150" y="68" width="8" height="30" rx="3" fill="url(#neonAmber)" />
              </g>
            </g>
          )}

          {/* ================= 2. LAT PULLDOWN (ESPALDA TRACCIÓN) ================= */}
          {currentType === 'lat_pulldown' && (
            <g>
              {/* Máquina polea superior */}
              <line x1="100" y1="20" x2="100" y2="170" stroke="#334155" strokeWidth="4" />
              <circle cx="100" cy="25" r="10" fill="#1e293b" stroke="#0284c7" strokeWidth="2" />
              {/* Asiento */}
              <rect x="75" y="130" width="50" height="10" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="2" />

              {/* Atleta sentado */}
              <circle cx="100" cy="95" r="9" fill="#94a3b8" />
              {/* Dorsales iluminados */}
              <polygon points="100,105 82,125 118,125" fill="url(#neonEmerald)" filter="url(#glow)" />
              {/* Piernas */}
              <polyline points="95,135 95,170" fill="none" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />

              {/* Cable & Barra bajando y subiendo */}
              <g className={`transition-all duration-700 ease-in-out ${phase.includes('Concéntrica') ? 'translate-y-7' : '-translate-y-3'}`}>
                <line x1="100" y1="25" x2="100" y2="65" stroke="#94a3b8" strokeWidth="2" strokeDasharray="2,2" />
                {/* Barra dorsal curva */}
                <path d="M 40 70 Q 100 62 160 70" fill="none" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
                {/* Brazos jalando */}
                <line x1="60" y1="70" x2="88" y2="110" stroke="#34d399" strokeWidth="4" strokeLinecap="round" />
                <line x1="140" y1="70" x2="112" y2="110" stroke="#34d399" strokeWidth="4" strokeLinecap="round" />
              </g>
            </g>
          )}

          {/* ================= 3. SQUAT / SENTADILLA (PIERNAS) ================= */}
          {currentType === 'squat' && (
            <g>
              {/* Atleta flexionando rodillas y cadera */}
              <g className={`transition-all duration-700 ease-in-out ${phase.includes('Concéntrica') ? '-translate-y-6' : 'translate-y-5'}`}>
                {/* Cabeza */}
                <circle cx="100" cy="55" r="9" fill="#94a3b8" />
                {/* Torso */}
                <line x1="100" y1="65" x2="100" y2="105" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" />
                {/* Barra en hombros */}
                <line x1="50" y1="65" x2="150" y2="65" stroke="#f8fafc" strokeWidth="5" strokeLinecap="round" />
                <rect x="46" y="50" width="8" height="30" rx="3" fill="url(#neonAmber)" />
                <rect x="146" y="50" width="8" height="30" rx="3" fill="url(#neonAmber)" />

                {/* Cuádriceps / Glúteos activos */}
                <polyline points="100,105 85,135 90,170" fill="none" stroke="url(#neonEmerald)" strokeWidth="6" strokeLinecap="round" filter="url(#glow)" />
                <polyline points="100,105 115,135 110,170" fill="none" stroke="url(#neonEmerald)" strokeWidth="6" strokeLinecap="round" filter="url(#glow)" />
              </g>
            </g>
          )}

          {/* ================= 4. BICEP CURL (BRAZOS) ================= */}
          {currentType === 'bicep_curl' && (
            <g>
              {/* Atleta de pie */}
              <circle cx="100" cy="45" r="9" fill="#94a3b8" />
              <line x1="100" y1="55" x2="100" y2="120" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
              <polyline points="100,120 90,170" fill="none" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
              <polyline points="100,120 110,170" fill="none" stroke="#475569" strokeWidth="5" strokeLinecap="round" />

              {/* Bíceps y Barra flexionando */}
              <line x1="100" y1="65" x2="88" y2="95" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
              <g className={`transition-all duration-700 ease-in-out origin-[88px_95px] ${phase.includes('Concéntrica') ? '-rotate-90' : 'rotate-0'}`}>
                {/* Antebrazo con barra */}
                <line x1="88" y1="95" x2="88" y2="135" stroke="url(#neonCyan)" strokeWidth="5" strokeLinecap="round" filter="url(#glow)" />
                <circle cx="88" cy="135" r="8" fill="url(#neonAmber)" />
              </g>
            </g>
          )}

          {/* ================= 5. OVERHEAD / LATERAL RAISE (HOMBROS) ================= */}
          {(currentType === 'overhead_press' || currentType === 'lateral_raise') && (
            <g>
              <circle cx="100" cy="60" r="9" fill="#94a3b8" />
              <line x1="100" y1="70" x2="100" y2="125" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
              <line x1="100" y1="125" x2="90" y2="170" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
              <line x1="100" y1="125" x2="110" y2="170" stroke="#475569" strokeWidth="5" strokeLinecap="round" />

              {/* Deltoides Iluminados */}
              <circle cx="88" cy="75" r="5" fill="url(#neonAmber)" filter="url(#glow)" />
              <circle cx="112" cy="75" r="5" fill="url(#neonAmber)" filter="url(#glow)" />

              {/* Brazos elevándose */}
              <g className={`transition-all duration-700 ease-in-out ${phase.includes('Concéntrica') ? '-translate-y-8' : 'translate-y-2'}`}>
                <line x1="60" y1="75" x2="140" y2="75" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
                <rect x="55" y="65" width="6" height="20" rx="2" fill="url(#neonCyan)" />
                <rect x="139" y="65" width="6" height="20" rx="2" fill="url(#neonCyan)" />
              </g>
            </g>
          )}

          {/* ================= 6. ROW / HINGE (ESPALDA MEDIA & ISQUIOS) ================= */}
          {(currentType === 'barbell_row' || currentType === 'hip_hinge' || currentType === 'tricep_pushdown' || currentType === 'core_crunch') && (
            <g>
              {/* Posición inclinada */}
              <circle cx="75" cy="75" r="9" fill="#94a3b8" />
              <line x1="75" y1="85" x2="115" y2="115" stroke="url(#neonEmerald)" strokeWidth="6" strokeLinecap="round" filter="url(#glow)" />
              <polyline points="115,115 110,145 105,170" fill="none" stroke="#475569" strokeWidth="5" strokeLinecap="round" />

              {/* Barra remando hacia la cadera */}
              <g className={`transition-all duration-700 ease-in-out ${phase.includes('Concéntrica') ? '-translate-y-6 translate-x-2' : 'translate-y-3'}`}>
                <line x1="70" y1="125" x2="120" y2="125" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
                <circle cx="70" cy="125" r="6" fill="url(#neonAmber)" />
                <circle cx="120" cy="125" r="6" fill="url(#neonAmber)" />
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* Footer Informativo */}
      <div className="w-full bg-slate-950/80 rounded-xl p-2.5 border border-slate-800 text-center z-10 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Contracción & Control Óptimo</span>
        </div>
        <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
          60 FPS Loop
        </span>
      </div>
    </div>
  );
}
