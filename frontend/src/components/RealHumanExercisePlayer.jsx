import React, { useState, useEffect } from 'react';
import { Play, Pause, RefreshCw, Sparkles, Activity, Image as ImageIcon, Film } from 'lucide-react';

export default function RealHumanExercisePlayer({ exerciseName, muscleGroup, frames, gifUrl, imgUrl }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [repCount, setRepCount] = useState(1);
  const [phase, setPhase] = useState('En Movimiento');
  const [imgError, setImgError] = useState(false);
  const [viewMode, setViewMode] = useState('gif'); // 'gif' | 'photo'

  const images = frames && frames.length > 0 
    ? frames.map(f => f.startsWith('http') ? f : `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${f}`)
    : [];

  const effectiveGif = gifUrl;
  const effectiveImg = imgUrl || (images.length > 0 ? images[0] : null);

  // Bucle de animación fotográfica continua en caso de usar frames
  useEffect(() => {
    if (!isPlaying || images.length < 2 || (effectiveGif && viewMode === 'gif')) return;

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
  }, [isPlaying, images, effectiveGif, viewMode]);

  return (
    <div className="w-full bg-slate-950 rounded-2xl border border-slate-800 p-3 sm:p-4 space-y-3 shadow-2xl overflow-hidden relative select-none">
      {/* Header con Estado, Modo de Vista y Controles */}
      <div className="flex items-center justify-between text-xs gap-2 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{viewMode === 'gif' && isPlaying ? 'Demostración en GIF' : 'Fotograma Detenido'}</span>
        </div>

        {/* Switcher GIF vs Foto HD si ambos están disponibles */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {effectiveGif && (
            <button
              type="button"
              onClick={() => { setViewMode('gif'); setIsPlaying(true); }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black transition-all ${
                viewMode === 'gif' && isPlaying
                  ? 'bg-sky-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Film className="w-3 h-3" />
              <span>GIF</span>
            </button>
          )}

          {effectiveImg && (
            <button
              type="button"
              onClick={() => { setViewMode('photo'); setIsPlaying(false); }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black transition-all ${
                viewMode === 'photo' || !isPlaying
                  ? 'bg-sky-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3 h-3" />
              <span>Foto HD</span>
            </button>
          )}
        </div>
      </div>

      {/* Contenedor Visual de Alta Definición */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 flex items-center justify-center shadow-inner group">
        {effectiveGif && viewMode === 'gif' && isPlaying && !imgError ? (
          <img
            src={effectiveGif}
            alt={exerciseName}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain object-center bg-black/40"
          />
        ) : effectiveImg ? (
          <img
            src={effectiveImg}
            alt={exerciseName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain object-center bg-black/40"
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
            <p className="text-xs font-semibold">Demostración disponible en video real abajo en YouTube HD.</p>
          </div>
        )}
      </div>

      {/* Pie con Etiqueta de Origen y Calidad */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
        <span className="flex items-center gap-1.5 text-slate-300 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Biblioteca OpenGym & Visuales Biomecánicos</span>
        </span>
        <span className="font-mono text-xs text-emerald-400 font-bold">
          HD Loop
        </span>
      </div>
    </div>
  );
}
