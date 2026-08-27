import React, { useState, useEffect } from 'react';
import { Play, Pause, RefreshCw, Sparkles, Activity } from 'lucide-react';

export default function RealHumanExercisePlayer({ exerciseName, muscleGroup, frames, gifUrl }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [repCount, setRepCount] = useState(1);
  const [phase, setPhase] = useState('Inicio (Excéntrica)');
  const [imgError, setImgError] = useState(false);

  const images = frames && frames.length > 0 
    ? frames.map(f => f.startsWith('http') ? f : `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${f}`)
    : [];

  // Bucle de animación fotográfica continua en vivo
  useEffect(() => {
    if (!isPlaying || images.length < 2) return;

    const interval = setInterval(() => {
      setCurrentFrame((prev) => {
        const next = (prev + 1) % images.length;
        if (next === 1) {
          setPhase('Contracción (Concéntrica)');
        } else {
          setPhase('Extensión / Retorno');
          setRepCount(r => (r >= 12 ? 1 : r + 1));
        }
        return next;
      });
    }, 850);

    return () => clearInterval(interval);
  }, [isPlaying, images]);

  return (
    <div className="w-full bg-slate-950 rounded-2xl border border-slate-800 p-3 sm:p-4 space-y-3 shadow-2xl overflow-hidden relative select-none">
      {/* Header con Estado y Contador */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{phase}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono font-bold text-[11px]">
            Rep #{repCount}
          </span>
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title={isPlaying ? "Pausar" : "Reproducir"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Contenedor Visual de Fotogramas Reales del Ejercicio */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 flex items-center justify-center shadow-inner">
        {gifUrl && !imgError ? (
          <img
            src={gifUrl}
            alt={exerciseName}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain object-center"
          />
        ) : images.length > 0 ? (
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            {images.map((src, idx) => (
              <img
                key={src}
                src={src}
                alt={`${exerciseName} frame ${idx}`}
                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
                  currentFrame === idx ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                loading="eager"
              />
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-slate-400 space-y-2">
            <Activity className="w-8 h-8 text-sky-400 mx-auto" />
            <p className="text-xs font-semibold">Demostración en video disponible en YouTube HD.</p>
          </div>
        )}
      </div>

      {/* Indicador de Movimiento y Técnica */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
        <span className="flex items-center gap-1 text-slate-300 font-medium">
          <Sparkles className="w-3 h-3 text-amber-400" />
          Demostración Real de Atleta en Bucle
        </span>
        <span className="font-mono text-slate-500">
          Posición {currentFrame + 1} de {images.length || 1}
        </span>
      </div>
    </div>
  );
}
