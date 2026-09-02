import React, { useState, useEffect } from 'react';
import { Play, Pause, RefreshCw, Sparkles, Activity, Image as ImageIcon, Film, ChevronLeft, ChevronRight } from 'lucide-react';

export default function RealHumanExercisePlayer({ exerciseName, muscleGroup, frames, gifUrl, imgUrl }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [repCount, setRepCount] = useState(1);
  const [phase, setPhase] = useState('Posición Inicial');
  const [imgError, setImgError] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  const [viewMode, setViewMode] = useState('gif'); // 'gif' | 'photo'

  // Resetear estados cuando cambia de ejercicio
  useEffect(() => {
    setImgError(false);
    setPhotoError(false);
    setCurrentFrame(0);
    setIsPlaying(true);
  }, [exerciseName, gifUrl, imgUrl]);

  const images = frames && frames.length > 0 
    ? frames.map(f => f.startsWith('http') || f.startsWith('/') ? f : `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${f}`)
    : [];

  const hasWorkingGif = gifUrl && !imgError;
  const effectivePhoto = (!photoError && imgUrl) ? imgUrl : (images.length > 0 ? images[currentFrame % images.length] : (hasWorkingGif ? gifUrl : null));

  // Bucle de animación continua con fotogramas si estamos en modo Animación y no hay GIF nativo o si el GIF falló
  useEffect(() => {
    if (!isPlaying || images.length < 2) return;
    if (hasWorkingGif && viewMode === 'gif') return;

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
    }, 900);

    return () => clearInterval(interval);
  }, [isPlaying, images, hasWorkingGif, viewMode]);

  return (
    <div className="w-full bg-slate-950 rounded-2xl border border-slate-800 p-3 sm:p-4 space-y-3 shadow-2xl overflow-hidden relative select-none">
      {/* Header con Estado, Modo de Vista y Controles */}
      <div className="flex items-center justify-between text-xs gap-2 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 font-bold">
          <span className={`w-2 h-2 rounded-full ${isPlaying && viewMode === 'gif' ? 'bg-emerald-400 animate-ping' : 'bg-sky-400'}`} />
          <span>{viewMode === 'gif' && isPlaying ? 'Demostración Técnica' : `Foto HD: ${phase}`}</span>
        </div>

        {/* Switcher Animación vs Foto HD */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => { setViewMode('gif'); setIsPlaying(true); }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black transition-all ${
              viewMode === 'gif'
                ? 'bg-sky-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Film className="w-3 h-3" />
            <span>Animación</span>
          </button>

          <button
            type="button"
            onClick={() => { setViewMode('photo'); setIsPlaying(false); }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black transition-all ${
              viewMode === 'photo'
                ? 'bg-sky-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3 h-3" />
            <span>Foto HD</span>
          </button>
        </div>
      </div>

      {/* Contenedor Visual de Alta Definición */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 flex items-center justify-center shadow-inner group">
        {hasWorkingGif && viewMode === 'gif' ? (
          <img
            key={gifUrl}
            src={gifUrl}
            alt={exerciseName}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain object-center bg-black/40"
          />
        ) : images.length > 0 && viewMode === 'gif' ? (
          <div className="relative w-full h-full flex items-center justify-center bg-black/40">
            {images.map((src, idx) => (
              <img
                key={src}
                src={src}
                alt={`${exerciseName} paso ${idx + 1}`}
                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
                  currentFrame === idx ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                loading="eager"
              />
            ))}
          </div>
        ) : effectivePhoto ? (
          <img
            key={effectivePhoto}
            src={effectivePhoto}
            alt={exerciseName}
            referrerPolicy="no-referrer"
            onError={() => setPhotoError(true)}
            className="w-full h-full object-contain object-center bg-black/40"
          />
        ) : (
          <div className="p-6 text-center text-slate-400 space-y-2">
            <Activity className="w-8 h-8 text-sky-400 mx-auto" />
            <p className="text-xs font-semibold">Demostración técnica del ejercicio</p>
          </div>
        )}

        {/* Controles de Fotograma en Modo Foto HD */}
        {viewMode === 'photo' && images.length > 1 && (
          <div className="absolute inset-x-2 bottom-2 flex items-center justify-between pointer-events-auto">
            <button
              type="button"
              onClick={() => {
                setCurrentFrame(prev => (prev === 0 ? images.length - 1 : prev - 1));
                setPhase(currentFrame === 1 ? 'Posición Inicial' : 'Contracción');
              }}
              className="p-1.5 rounded-xl bg-slate-950/80 text-white hover:bg-sky-500 hover:text-slate-950 border border-slate-700 transition-all flex items-center gap-1 text-[11px] font-bold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <span className="px-2.5 py-1 rounded-xl bg-slate-950/85 border border-slate-800 text-[11px] font-mono text-emerald-400 font-bold">
              Foto {currentFrame + 1} de {images.length}
            </span>

            <button
              type="button"
              onClick={() => {
                setCurrentFrame(prev => (prev + 1) % images.length);
                setPhase(currentFrame === 0 ? 'Contracción' : 'Posición Inicial');
              }}
              className="p-1.5 rounded-xl bg-slate-950/80 text-white hover:bg-sky-500 hover:text-slate-950 border border-slate-700 transition-all flex items-center gap-1 text-[11px] font-bold"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Overlay con fase de movimiento en Modo GIF */}
        {viewMode === 'gif' && images.length > 1 && !hasWorkingGif && (
          <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-sm border border-slate-800 text-[10px] font-mono text-emerald-400 font-bold">
            {phase} • Paso {currentFrame + 1}/{images.length}
          </div>
        )}
      </div>

      {/* Pie con Etiqueta de Origen y Calidad */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
        <span className="flex items-center gap-1.5 text-slate-300 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Demostración Biomecánica HD</span>
        </span>
        <span className="font-mono text-xs text-emerald-400 font-bold">
          {viewMode === 'gif' ? (isPlaying ? '▶ Repetición' : '⏸ Pausado') : '📷 Foto HD'}
        </span>
      </div>
    </div>
  );
}
