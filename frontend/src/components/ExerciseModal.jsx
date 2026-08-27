import React, { useState } from 'react';
import { X, Info, Dumbbell, Sparkles, Check, Edit3, Activity, Play, RefreshCw } from 'lucide-react';
import { getExerciseVisual } from '../utils/exerciseVisuals';

export default function ExerciseModal({ exercise, onClose, onUpdateExercise }) {
  const [isEditing, setIsEditing] = useState(false);
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
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl space-y-4 my-6 max-h-[90vh] overflow-y-auto">
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
              title="Editar nombre y detalles del ejercicio"
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
              <label className="text-xs font-bold text-slate-300 block mb-1">URL de GIF o Animación (Opcional)</label>
              <input
                type="url"
                placeholder="https://ejemplo.com/ejercicio.gif"
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
            {/* Visual GIF Animado en Movimiento */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner group">
              {displayGif && !imgError ? (
                <div className="relative aspect-video w-full flex items-center justify-center bg-black overflow-hidden">
                  <img
                    key={displayGif}
                    src={displayGif}
                    alt={exercise.nombre}
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-contain object-center"
                  />
                  <div className="absolute bottom-2 left-3 flex items-center gap-1.5 text-[11px] font-bold text-sky-300 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Animación en Movimiento</span>
                  </div>
                </div>
              ) : (
                /* Animación / Esquema Biomecánico Dinámico */
                <div className="aspect-video flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-slate-900 to-slate-950 text-slate-300 space-y-2">
                  <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/25 flex items-center justify-center text-sky-400 animate-bounce">
                    <Dumbbell className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{exercise.nombre}</h4>
                    <span className="text-xs text-sky-400">{visualData.musculo_principal}</span>
                  </div>
                </div>
              )}
            </div>

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
