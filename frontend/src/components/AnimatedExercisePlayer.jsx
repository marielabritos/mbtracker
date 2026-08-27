import React, { useState, useEffect } from 'react';
import { Dumbbell, Flame, Sparkles, Play, Pause, RefreshCw, Zap, Eye } from 'lucide-react';

export default function AnimatedExercisePlayer({ exerciseName, muscleGroup, animationType }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [phase, setPhase] = useState('Concéntrica (Contracción)');
  const [repCount, setRepCount] = useState(1);

  // Mapeo preciso del tipo de ejercicio biomecánico
  const getAnimType = () => {
    if (animationType) return animationType;
    const name = (exerciseName || '').toLowerCase();
    const group = (muscleGroup || '').toLowerCase();

    // 1. ESPALDA - REMOS
    if (name.includes('remo') || name.includes('serrucho') || name.includes('gironda') || name.includes('dorso')) {
      return 'barbell_row';
    }
    // 2. ESPALDA - TRACCIÓN VERTICAL
    if (name.includes('jalón') || name.includes('pulldown') || name.includes('dominada') || name.includes('pull-up') || name.includes('tracción')) {
      return 'lat_pulldown';
    }
    // 3. HOMBROS - PRESS MILITAR / VERTICAL
    if (name.includes('militar') || name.includes('overhead') || name.includes('press hombro') || name.includes('hombro con mancuerna')) {
      return 'overhead_press';
    }
    // 4. HOMBROS - ELEVACIONES LATERALES Y PÁJAROS
    if (name.includes('lateral') || name.includes('pájaro') || name.includes('face pull') || name.includes('vuelo') || name.includes('posterior')) {
      return 'lateral_raise';
    }
    // 5. BRAZOS - BÍCEPS
    if (name.includes('bíceps') || name.includes('biceps') || name.includes('curl') || name.includes('martillo') || name.includes('barra z')) {
      if (name.includes('femoral')) return 'hip_hinge';
      return 'bicep_curl';
    }
    // 6. BRAZOS - TRÍCEPS
    if (name.includes('tríceps') || name.includes('triceps') || name.includes('francés') || name.includes('frances') || name.includes('cuerda') || name.includes('fondos') || name.includes('dips')) {
      return 'tricep_pushdown';
    }
    // 7. PECHO - PRESS Y FLEXIONES
    if (name.includes('banca') || name.includes('pecho') || name.includes('inclinado') || name.includes('apertura') || name.includes('flexiones') || name.includes('push up') || name.includes('press plano')) {
      return 'bench_press';
    }
    // 8. PIERNAS - SENTADILLA Y PRENSA
    if (name.includes('sentadilla') || name.includes('squat') || name.includes('prensa') || name.includes('cuádriceps') || name.includes('búlgar')) {
      return 'squat';
    }
    // 9. PIERNAS & GLÚTEOS - BISAGRA Y HIP THRUST
    if (name.includes('peso muerto') || name.includes('rumano') || name.includes('rdl') || name.includes('thrust') || name.includes('glúteo') || name.includes('isquio') || name.includes('femoral')) {
      return 'hip_hinge';
    }
    // 10. CORE / ABDOMINALES
    if (name.includes('plancha') || name.includes('crunch') || name.includes('abdominal') || name.includes('core') || group.includes('core')) {
      return 'core_crunch';
    }
    // 11. CALENTAMIENTO Y MOVILIDAD
    if (name.includes('gato') || name.includes('movilidad') || name.includes('rotación') || name.includes('dislocaci') || group.includes('calentamiento')) {
      return 'lat_pulldown';
    }
    // 12. REHABILITACIÓN (RODILLA / TOBILLO)
    if (name.includes('rodilla') || name.includes('wall sit') || name.includes('tke') || name.includes('almeja') || name.includes('tobillo') || name.includes('dorsiflexi') || group.includes('rehabilitación')) {
      return 'squat';
    }
    // 13. ESTIRAMIENTOS Y FLEXIBILIDAD
    if (name.includes('estiramiento') || name.includes('niño') || name.includes('cobra') || group.includes('estiramientos')) {
      return 'hip_hinge';
    }

    // Fallback por grupo muscular
    if (group.includes('espalda')) return 'lat_pulldown';
    if (group.includes('hombro')) return 'overhead_press';
    if (group.includes('brazo')) return 'bicep_curl';
    if (group.includes('pierna')) return 'squat';
    if (group.includes('pecho')) return 'bench_press';
    if (group.includes('calentamiento')) return 'lat_pulldown';
    if (group.includes('rehabilitación')) return 'squat';
    if (group.includes('estiramiento')) return 'hip_hinge';
    return 'bench_press';
  };

  const currentType = getAnimType();

  // Bucle suave de fases
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
    }, 1400);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-4 relative overflow-hidden shadow-2xl flex flex-col items-center select-none">
      {/* Background Grid Neón */}
      <div className="absolute inset-0 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

      {/* Header Visual con Fase y Repetición */}
      <div className="w-full flex items-center justify-between z-10 text-xs mb-2">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Fase: {phase.split(' ')[0]}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono font-bold text-[11px]">
            Rep #{repCount}
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
            <linearGradient id="neonRose" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#be123c" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Línea de suelo */}
          <line x1="20" y1="175" x2="180" y2="175" stroke="#334155" strokeWidth="4" strokeLinecap="round" />

          {/* ================= 1. JALÓN AL PECHO / PULLDOWN (ESPALDA TRACCIÓN) ================= */}
          {currentType === 'lat_pulldown' && (
            <g>
              {/* Máquina polea */}
              <line x1="100" y1="15" x2="100" y2="175" stroke="#334155" strokeWidth="4" />
              <circle cx="100" cy="20" r="10" fill="#1e293b" stroke="#0284c7" strokeWidth="2" />
              <rect x="75" y="130" width="50" height="10" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="2" />

              {/* Atleta con dorsales activos */}
              <circle cx="100" cy="95" r="9" fill="#94a3b8" />
              <polygon points="100,105 80,128 120,128" fill="url(#neonEmerald)" filter="url(#glow)" />
              <polyline points="95,135 95,175" fill="none" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />

              {/* Cable & Barra dorsal bajando y subiendo */}
              <g className={`transition-all duration-700 ease-in-out ${phase.includes('Concéntrica') ? 'translate-y-8' : '-translate-y-2'}`}>
                <line x1="100" y1="20" x2="100" y2="65" stroke="#94a3b8" strokeWidth="2" strokeDasharray="2,2" />
                <path d="M 40 68 Q 100 58 160 68" fill="none" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
                {/* Brazos traccionando */}
                <line x1="55" y1="68" x2="88" y2="110" stroke="#34d399" strokeWidth="4" strokeLinecap="round" />
                <line x1="145" y1="68" x2="112" y2="110" stroke="#34d399" strokeWidth="4" strokeLinecap="round" />
              </g>
            </g>
          )}

          {/* ================= 2. REMO CON BARRA / SERRUCHO (ESPALDA GROSOR) ================= */}
          {currentType === 'barbell_row' && (
            <g>
              {/* Atleta inclinado a 45° */}
              <circle cx="75" cy="75" r="9" fill="#94a3b8" />
              {/* Espalda / Dorsales iluminados */}
              <line x1="75" y1="85" x2="115" y2="120" stroke="url(#neonEmerald)" strokeWidth="8" strokeLinecap="round" filter="url(#glow)" />
              {/* Piernas flexionadas */}
              <polyline points="115,120 110,148 105,175" fill="none" stroke="#475569" strokeWidth="5" strokeLinecap="round" />

              {/* Barra / Mancuerna remando hacia el ombligo */}
              <g className={`transition-all duration-700 ease-in-out ${phase.includes('Concéntrica') ? '-translate-y-7 translate-x-2' : 'translate-y-4'}`}>
                {/* Brazo tirando */}
                <line x1="88" y1="95" x2="95" y2="130" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                <line x1="70" y1="130" x2="125" y2="130" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
                <circle cx="70" cy="130" r="7" fill="url(#neonAmber)" />
                <circle cx="125" cy="130" r="7" fill="url(#neonAmber)" />
              </g>
            </g>
          )}

          {/* ================= 3. PRESS MILITAR / OVERHEAD (HOMBROS) ================= */}
          {currentType === 'overhead_press' && (
            <g>
              <circle cx="100" cy="70" r="9" fill="#94a3b8" />
              <line x1="100" y1="80" x2="100" y2="130" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
              <polyline points="100,130 90,175" fill="none" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
              <polyline points="100,130 110,175" fill="none" stroke="#475569" strokeWidth="5" strokeLinecap="round" />

              {/* Deltoides Iluminados */}
              <circle cx="85" cy="85" r="6" fill="url(#neonAmber)" filter="url(#glow)" />
              <circle cx="115" cy="85" r="6" fill="url(#neonAmber)" filter="url(#glow)" />

              {/* Barra empujando vertical sobre la cabeza */}
              <g className={`transition-all duration-700 ease-in-out ${phase.includes('Concéntrica') ? '-translate-y-12' : 'translate-y-2'}`}>
                <line x1="50" y1="75" x2="150" y2="75" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
                <rect x="45" y="65" width="7" height="20" rx="2" fill="url(#neonCyan)" />
                <rect x="148" y="65" width="7" height="20" rx="2" fill="url(#neonCyan)" />
                {/* Brazos */}
                <line x1="85" y1="85" x2="70" y2="75" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                <line x1="115" y1="85" x2="130" y2="75" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
              </g>
            </g>
          )}

          {/* ================= 4. ELEVACIONES LATERALES / PÁJAROS (HOMBROS) ================= */}
          {currentType === 'lateral_raise' && (
            <g>
              <circle cx="100" cy="65" r="9" fill="#94a3b8" />
              <line x1="100" y1="75" x2="100" y2="130" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
              <polyline points="100,130 90,175" fill="none" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
              <polyline points="100,130 110,175" fill="none" stroke="#475569" strokeWidth="5" strokeLinecap="round" />

              {/* Deltoides laterales activos */}
              <circle cx="86" cy="80" r="6" fill="url(#neonAmber)" filter="url(#glow)" />
              <circle cx="114" cy="80" r="6" fill="url(#neonAmber)" filter="url(#glow)" />

              {/* Brazos abriéndose como alas en vuelo */}
              <g className={`transition-all duration-700 ease-in-out ${phase.includes('Concéntrica') ? '-translate-y-8' : 'translate-y-4'}`}>
                <line x1="45" y1="90" x2="86" y2="80" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                <line x1="155" y1="90" x2="114" y2="80" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                <circle cx="45" cy="90" r="6" fill="url(#neonCyan)" />
                <circle cx="155" cy="90" r="6" fill="url(#neonCyan)" />
              </g>
            </g>
          )}

          {/* ================= 5. CURL DE BÍCEPS / MARTILLO (BRAZOS) ================= */}
          {currentType === 'bicep_curl' && (
            <g>
              <circle cx="100" cy="50" r="9" fill="#94a3b8" />
              <line x1="100" y1="60" x2="100" y2="125" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
              <polyline points="100,125 90,175" fill="none" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
              <polyline points="100,125 110,175" fill="none" stroke="#475569" strokeWidth="5" strokeLinecap="round" />

              {/* Bíceps flexionando */}
              <circle cx="86" cy="85" r="7" fill="url(#neonRose)" filter="url(#glow)" />
              <line x1="100" y1="70" x2="86" y2="95" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />

              <g className={`transition-all duration-700 ease-in-out origin-[86px_95px] ${phase.includes('Concéntrica') ? '-rotate-110' : 'rotate-0'}`}>
                <line x1="86" y1="95" x2="86" y2="135" stroke="url(#neonCyan)" strokeWidth="5" strokeLinecap="round" />
                <circle cx="86" cy="135" r="8" fill="url(#neonAmber)" />
              </g>
            </g>
          )}

          {/* ================= 6. EXTENSIÓN DE TRÍCEPS / POLEA (BRAZOS) ================= */}
          {currentType === 'tricep_pushdown' && (
            <g>
              {/* Cable de polea superior */}
              <line x1="100" y1="20" x2="100" y2="70" stroke="#94a3b8" strokeWidth="2" strokeDasharray="2,2" />
              <circle cx="100" cy="50" r="9" fill="#94a3b8" />
              <line x1="100" y1="60" x2="100" y2="125" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
              <polyline points="100,125 90,175" fill="none" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
              <polyline points="100,125 110,175" fill="none" stroke="#475569" strokeWidth="5" strokeLinecap="round" />

              {/* Tríceps iluminado */}
              <circle cx="114" cy="80" r="6" fill="url(#neonCyan)" filter="url(#glow)" />
              <line x1="100" y1="70" x2="114" y2="90" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />

              {/* Brazo empujando hacia abajo */}
              <g className={`transition-all duration-700 ease-in-out origin-[114px_90px] ${phase.includes('Concéntrica') ? 'rotate-90' : 'rotate-0'}`}>
                <line x1="114" y1="90" x2="114" y2="60" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                <rect x="105" y="55" width="18" height="6" rx="2" fill="url(#neonAmber)" />
              </g>
            </g>
          )}

          {/* ================= 7. PRESS DE BANCA / PECHO ================= */}
          {currentType === 'bench_press' && (
            <g>
              <rect x="50" y="125" width="100" height="12" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="2" />
              <line x1="65" y1="137" x2="65" y2="175" stroke="#475569" strokeWidth="4" />
              <line x1="135" y1="137" x2="135" y2="175" stroke="#475569" strokeWidth="4" />

              <circle cx="65" cy="118" r="9" fill="#94a3b8" />
              <rect x="75" y="115" width="55" height="12" rx="5" fill="url(#neonCyan)" filter="url(#glow)" />
              <polyline points="128,125 145,145 150,175" fill="none" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />

              {/* Barra subiendo y bajando */}
              <g className={`transition-all duration-700 ease-in-out ${phase.includes('Concéntrica') ? '-translate-y-9' : 'translate-y-1'}`}>
                <line x1="85" y1="120" x2="85" y2="85" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
                <line x1="115" y1="120" x2="115" y2="85" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
                <line x1="45" y1="83" x2="155" y2="83" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
                <rect x="42" y="68" width="8" height="30" rx="3" fill="url(#neonAmber)" />
                <rect x="150" y="68" width="8" height="30" rx="3" fill="url(#neonAmber)" />
              </g>
            </g>
          )}

          {/* ================= 8. SENTADILLA (PIERNAS) ================= */}
          {currentType === 'squat' && (
            <g>
              <g className={`transition-all duration-700 ease-in-out ${phase.includes('Concéntrica') ? '-translate-y-7' : 'translate-y-5'}`}>
                <circle cx="100" cy="55" r="9" fill="#94a3b8" />
                <line x1="100" y1="65" x2="100" y2="105" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" />
                <line x1="50" y1="65" x2="150" y2="65" stroke="#f8fafc" strokeWidth="5" strokeLinecap="round" />
                <rect x="46" y="50" width="8" height="30" rx="3" fill="url(#neonAmber)" />
                <rect x="146" y="50" width="8" height="30" rx="3" fill="url(#neonAmber)" />

                {/* Cuádriceps iluminados */}
                <polyline points="100,105 85,135 90,175" fill="none" stroke="url(#neonEmerald)" strokeWidth="6" strokeLinecap="round" filter="url(#glow)" />
                <polyline points="100,105 115,135 110,175" fill="none" stroke="url(#neonEmerald)" strokeWidth="6" strokeLinecap="round" filter="url(#glow)" />
              </g>
            </g>
          )}

          {/* ================= 9. HIP HINGE / PESO MUERTO (GLÚTEOS E ISQUIOS) ================= */}
          {currentType === 'hip_hinge' && (
            <g>
              <g className={`transition-all duration-700 ease-in-out ${phase.includes('Concéntrica') ? 'rotate-0 origin-[100px_130px]' : 'rotate-20 origin-[100px_130px]'}`}>
                <circle cx="100" cy="65" r="9" fill="#94a3b8" />
                <line x1="100" y1="75" x2="100" y2="120" stroke="url(#neonEmerald)" strokeWidth="7" strokeLinecap="round" filter="url(#glow)" />
                <polyline points="100,120 90,175" fill="none" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
                <polyline points="100,120 110,175" fill="none" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
                <circle cx="95" cy="140" r="8" fill="url(#neonAmber)" />
              </g>
            </g>
          )}

          {/* ================= 10. CORE / CRUNCH (ABDOMEN) ================= */}
          {currentType === 'core_crunch' && (
            <g>
              <circle cx="70" cy="120" r="9" fill="#94a3b8" />
              {/* Abdomen iluminado */}
              <line x1="78" y1="125" x2="120" y2="140" stroke="url(#neonCyan)" strokeWidth="7" strokeLinecap="round" filter="url(#glow)" />
              <polyline points="120,140 145,140 160,175" fill="none" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
            </g>
          )}
        </svg>
      </div>

      {/* Footer Informativo */}
      <div className="w-full bg-slate-950/80 rounded-xl p-2.5 border border-slate-800 text-center z-10 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Movimiento & Activación Biomecánica</span>
        </div>
        <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
          60 FPS Loop
        </span>
      </div>
    </div>
  );
}
