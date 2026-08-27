import React, { useState } from 'react';
import { X, Info, Dumbbell, Sparkles, Check, Edit3, Activity, Play, RefreshCw, Zap } from 'lucide-react';
import { getExerciseVisual } from '../utils/exerciseVisuals';
import AnimatedExercisePlayer from './AnimatedExercisePlayer';

export default function ExerciseModal({ exercise, onClose, onUpdateExercise }) {
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState('animation'); // 'animation' | 'gif'
  const [customName, setCustomName] = useState(exercise?.nombre || '');
  const [customGif, setCustomGif] = useState(exercise?.gif_url || '');
  const [customDesc, setCustomDesc] = useState(exercise?.descripcion || '');
  const [imgError, setImgError] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!exercise) return null;

  const visualData = getExerciseVisual(exercise.nombre, exercise.grupo_muscular);
  const displayGif = customGif || exercise.gif_url || visualData.gif;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!customName.trim()) return;

    try {
      setSaving(true);
      if (onUpdateExercise) {
        await onUpdateExercise({
          ...exercise,
          nombre: customName,
          gif_url: customGif,
          descripcion: customDesc
        });
      }
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 w-full max-w-lg shadow-2xl space-y-4 my-6 max-h-[92vh] overflow-y-auto">
        {/* Header Modal */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-sky-500/15 text-sky-400 text-[11px] font-bold uppercase tracking-wider border border-sky-500/25">
                {exercise.grupo_muscular}
              </span>
              {exercise.equipo && (
                <span className="text-xs text-slate-400 font-medium">
                  • {exercise.equipo}
                </span>
              )}
            </div>
            <h3 className="font-black text-lg sm:text-xl text-white mt-1">
              {exercise.nombre}
            </h3>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                isEditing
                  ? 'bg-sky-500 text-slate-950 border-sky-400'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title="Editar nombre y notas del ejercicio"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modo Edición de Nombre / GIF */}
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Nombre del Ejercicio</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500 font-bold"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">URL de GIF o Video Personalizado (Opcional)</label>
              <input
                type="url"
                placeholder="https://media.giphy.com/media/.../giphy.gif"
                value={customGif}
                onChange={(e) => {
                  setCustomGif(e.target.value);
                  setImgError(false);
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Notas o Consejos Personales</label>
              <textarea
                rows="2"
                placeholder="Ej. Agarre supino ancho, pausa 1s abajo"
                value={customDesc}
                onChange={(e) => setCustomDesc(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md"
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* Selector de Modo de Visualización (Video Real YouTube vs Animación 60 FPS) */}
            <div className="flex items-center justify-center gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('animation')}
                className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  viewMode === 'animation'
                    ? 'bg-sky-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Animación 60 FPS</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('video')}
                className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  viewMode === 'video'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Video Real (YouTube)</span>
              </button>
            </div>

            {/* Render según modo */}
            {viewMode === 'animation' ? (
              <AnimatedExercisePlayer
                exerciseName={exercise.nombre}
                muscleGroup={exercise.grupo_muscular}
                animationType={visualData.animacion_tipo}
              />
            ) : (
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl aspect-video w-full flex flex-col items-center justify-center">
                  {visualData.youtube_id ? (
                    <iframe
                      title={`Video ${exercise.nombre}`}
                      src={`https://www.youtube.com/embed/${visualData.youtube_id}?rel=0&modestbranding=1&playsinline=1`}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <div className="aspect-video flex flex-col items-center justify-center p-6 text-center text-slate-400 space-y-2">
                      <Play className="w-10 h-10 text-rose-500 fill-rose-500" />
                      <p className="text-xs font-semibold">Toca el botón inferior para abrir la técnica completa en YouTube.</p>
                    </div>
                  )}
                </div>

                <a
                  href={visualData.youtube_id ? `https://www.youtube.com/watch?v=${visualData.youtube_id}` : `https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.nombre + ' tecnica explicacion gym')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-600/25 active:scale-98"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>▶️ Ver Video en Pantalla Completa / App de YouTube</span>
                </a>
              </div>
            )}

            {/* Músculos Involucrados */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 shrink-0">Principal:</span>
                <span className="text-xs font-semibold text-white">{visualData.musculo_principal}</span>
              </div>
              {visualData.musculos_secundarios && visualData.musculos_secundarios.length > 0 && (
                <div className="flex items-start gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">Secundarios:</span>
                  <span className="text-xs text-slate-300 font-medium">
                    {visualData.musculos_secundarios.join(', ')}
                  </span>
                </div>
              )}
            </div>

            {/* Claves de Técnica y Ejecución */}
            {visualData.tips && visualData.tips.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Técnica Correcta
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {visualData.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/50">
                      <span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Respiración */}
            {visualData.respiracion && (
              <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-200 flex items-start gap-2">
                <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-sky-300 font-bold">Respiración:</strong>
                  <span>{visualData.respiracion}</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
