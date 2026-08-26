import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Edit3, ChevronDown, ChevronUp, Dumbbell, 
  Play, Search, X, Check, Clock, ArrowUp, ArrowDown, GripVertical 
} from 'lucide-react';
import { api } from '../services/api';

export default function Rutinas({ onStartWorkout }) {
  const [rutinas, setRutinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRutina, setExpandedRutina] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRutinaId, setEditingRutinaId] = useState(null);
  const [catalogEjercicios, setCatalogEjercicios] = useState([]);
  const [selectedMuscle, setSelectedMuscle] = useState('Todos');
  const [searchEj, setSearchEj] = useState('');

  // Estado del formulario de creación / edición
  const [formRutina, setFormRutina] = useState({
    nombre: '',
    descripcion: '',
    dias: [
      {
        nombre: 'Día 1',
        orden: 1,
        ejercicios: []
      }
    ]
  });

  // Modal selector de ejercicio
  const [exerciseSelectorTarget, setExerciseSelectorTarget] = useState(null); // { diaIndex }

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rData, eData] = await Promise.all([
        api.getRutinas(),
        api.getEjercicios()
      ]);
      setRutinas(rData);
      setCatalogEjercicios(eData);
      if (rData.length > 0 && !expandedRutina) {
        setExpandedRutina(rData[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingRutinaId(null);
    setFormRutina({
      nombre: '',
      descripcion: '',
      dias: [
        {
          nombre: 'Día 1',
          orden: 1,
          ejercicios: []
        }
      ]
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (rutina) => {
    setEditingRutinaId(rutina.id);
    setFormRutina({
      nombre: rutina.nombre,
      descripcion: rutina.descripcion || '',
      dias: rutina.dias.map((d, dIdx) => ({
        nombre: d.nombre,
        orden: dIdx + 1,
        ejercicios: d.ejercicios.map((e, eIdx) => ({
          ejercicio_id: e.ejercicio_id,
          ejercicio: e.ejercicio,
          series_objetivo: e.series_objetivo,
          reps_objetivo: e.reps_objetivo,
          descanso_segundos: e.descanso_segundos,
          orden: eIdx + 1,
          notas: e.notas || ''
        }))
      }))
    });
    setIsModalOpen(true);
  };

  const handleAddDay = () => {
    setFormRutina(prev => ({
      ...prev,
      dias: [
        ...prev.dias,
        {
          nombre: `Día ${prev.dias.length + 1}`,
          orden: prev.dias.length + 1,
          ejercicios: []
        }
      ]
    }));
  };

  const handleRemoveDay = (diaIdx) => {
    setFormRutina(prev => ({
      ...prev,
      dias: prev.dias.filter((_, idx) => idx !== diaIdx)
    }));
  };

  const handleMoveDay = (diaIdx, direction) => {
    const targetIdx = diaIdx + direction;
    if (targetIdx < 0 || targetIdx >= formRutina.dias.length) return;

    setFormRutina(prev => {
      const newDias = [...prev.dias];
      const temp = newDias[diaIdx];
      newDias[diaIdx] = newDias[targetIdx];
      newDias[targetIdx] = temp;
      // Re-indexar orden
      newDias.forEach((d, i) => { d.orden = i + 1; });
      return { ...prev, dias: newDias };
    });
  };

  const handleMoveExercise = (diaIdx, ejIdx, direction) => {
    const targetIdx = ejIdx + direction;
    const currentExercises = formRutina.dias[diaIdx].ejercicios;
    if (targetIdx < 0 || targetIdx >= currentExercises.length) return;

    setFormRutina(prev => {
      const newDias = [...prev.dias];
      const exList = [...newDias[diaIdx].ejercicios];
      const temp = exList[ejIdx];
      exList[ejIdx] = exList[targetIdx];
      exList[targetIdx] = temp;
      // Re-indexar orden
      exList.forEach((e, i) => { e.orden = i + 1; });
      newDias[diaIdx].ejercicios = exList;
      return { ...prev, dias: newDias };
    });
  };

  const handleAddExerciseToDay = (ejercicio) => {
    if (exerciseSelectorTarget === null) return;
    const diaIdx = exerciseSelectorTarget.diaIndex;

    setFormRutina(prev => {
      const newDias = [...prev.dias];
      newDias[diaIdx].ejercicios.push({
        ejercicio_id: ejercicio.id,
        ejercicio: ejercicio,
        series_objetivo: 3,
        reps_objetivo: "8-12",
        descanso_segundos: 90,
        orden: newDias[diaIdx].ejercicios.length + 1,
        notas: ""
      });
      return { ...prev, dias: newDias };
    });

    setExerciseSelectorTarget(null);
  };

  const handleSaveRutina = async (e) => {
    e.preventDefault();
    if (!formRutina.nombre.trim()) return alert("Por favor ingresa un nombre para la rutina");

    // Formatear payload asegurando numeración secuencial de orden
    const payload = {
      nombre: formRutina.nombre,
      descripcion: formRutina.descripcion,
      activa: true,
      dias: formRutina.dias.map((d, dIdx) => ({
        nombre: d.nombre,
        orden: dIdx + 1,
        ejercicios: d.ejercicios.map((e, eIdx) => ({
          ejercicio_id: e.ejercicio_id,
          series_objetivo: parseInt(e.series_objetivo) || 3,
          reps_objetivo: String(e.reps_objetivo || "8-12"),
          descanso_segundos: parseInt(e.descanso_segundos) || 90,
          orden: eIdx + 1,
          notas: e.notas || null
        }))
      }))
    };

    try {
      if (editingRutinaId) {
        await api.updateRutina(editingRutinaId, payload);
      } else {
        await api.createRutina(payload);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      alert("Error al guardar la rutina: " + err.message);
    }
  };

  const handleDeleteRutina = async (rutinaId) => {
    if (!confirm("¿Seguro que deseas eliminar esta rutina?")) return;
    try {
      await api.deleteRutina(rutinaId);
      loadData();
    } catch (err) {
      alert("Error al eliminar la rutina");
    }
  };

  const muscleGroups = ['Todos', 'Pecho', 'Espalda', 'Piernas', 'Hombros', 'Brazos', 'Core'];

  const filteredEjercicios = catalogEjercicios.filter(e => {
    const matchesGroup = selectedMuscle === 'Todos' || e.grupo_muscular === selectedMuscle;
    const matchesSearch = e.nombre.toLowerCase().includes(searchEj.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Mis Rutinas</h2>
          <p className="text-sm text-slate-400">Crea, edita y ordena tus ejercicios y días de entreno</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm shadow-lg shadow-sky-500/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Nueva Rutina
        </button>
      </div>

      {/* Lista de Rutinas */}
      {rutinas.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center space-y-4">
          <Dumbbell className="w-12 h-12 text-slate-600 mx-auto" />
          <div>
            <h3 className="text-lg font-bold text-white">No tienes rutinas creadas</h3>
            <p className="text-sm text-slate-400 mt-1">Crea tu primera rutina para empezar a registrar tus sesiones.</p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 text-slate-950 font-bold text-sm"
          >
            <Plus className="w-4 h-4" /> Crear Rutina
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {rutinas.map((rutina) => {
            const isExpanded = expandedRutina === rutina.id;
            return (
              <div
                key={rutina.id}
                className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl transition-all"
              >
                {/* Header Rutina */}
                <div
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors"
                  onClick={() => setExpandedRutina(isExpanded ? null : rutina.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-black">
                      {rutina.dias?.length || 0}d
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base md:text-lg">{rutina.nombre}</h3>
                      {rutina.descripcion && (
                        <p className="text-xs text-slate-400 mt-0.5">{rutina.descripcion}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 sm:gap-2">
                    {/* Botón Editar */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEditModal(rutina);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300 text-xs font-bold border border-slate-700 transition-colors"
                      title="Editar rutina y ejercicios"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Editar</span>
                    </button>

                    {/* Botón Eliminar */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRutina(rutina.id);
                      }}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Eliminar rutina"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="p-2 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Días y Ejercicios desplegables */}
                {isExpanded && (
                  <div className="border-t border-slate-800/80 p-5 space-y-4 bg-slate-950/40">
                    {rutina.dias?.map((dia) => (
                      <div
                        key={dia.id}
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-sky-400" />
                            {dia.nombre}
                          </h4>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenEditModal(rutina)}
                              className="text-xs text-slate-400 hover:text-sky-400 font-medium px-2 py-1"
                            >
                              Modificar orden
                            </button>
                            <button
                              onClick={() =>
                                onStartWorkout({
                                  nombre: dia.nombre,
                                  dia_rutina_id: dia.id,
                                  ejercicios: dia.ejercicios.map((e) => ({
                                    ejercicio_id: e.ejercicio_id,
                                    nombre: e.ejercicio.nombre,
                                    grupo_muscular: e.ejercicio.grupo_muscular,
                                    series_objetivo: e.series_objetivo,
                                    reps_objetivo: e.reps_objetivo,
                                    descanso_segundos: e.descanso_segundos
                                  }))
                                })
                              }
                              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" /> Entrenar Día
                            </button>
                          </div>
                        </div>

                        {/* Lista de Ejercicios del Día */}
                        <div className="space-y-1.5">
                          {dia.ejercicios?.map((ej, index) => (
                            <div
                              key={ej.id}
                              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60 text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-slate-500 font-bold w-4">
                                  {index + 1}.
                                </span>
                                <span className="font-semibold text-slate-200">
                                  {ej.ejercicio?.nombre}
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-sky-400 font-medium">
                                  {ej.ejercicio?.grupo_muscular}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-slate-400 font-mono">
                                <span>{ej.series_objetivo} series</span>
                                <span>•</span>
                                <span>{ej.reps_objetivo} reps</span>
                                <span>•</span>
                                <span>{ej.descanso_segundos}s desc.</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Crear / Editar Rutina */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 w-full max-w-2xl shadow-2xl space-y-5 my-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-black text-xl text-white">
                  {editingRutinaId ? 'Editar Rutina y Ejercicios' : 'Crear Nueva Rutina'}
                </h3>
                <p className="text-xs text-slate-400">Reordena los ejercicios y ajusta series, repeticiones y descanso</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRutina} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Nombre de la Rutina</label>
                <input
                  type="text"
                  placeholder="Ej: Torso / Pierna 4 Días"
                  value={formRutina.nombre}
                  onChange={(e) => setFormRutina({ ...formRutina, nombre: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Descripción / Objetivo (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: Enfoque en hipertrofia y sobrecarga progresiva"
                  value={formRutina.descripcion}
                  onChange={(e) => setFormRutina({ ...formRutina, descripcion: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Días y Reordenación de Ejercicios */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Días y Ejercicios</span>
                  <button
                    type="button"
                    onClick={handleAddDay}
                    className="flex items-center gap-1 text-xs font-bold text-sky-400 hover:text-sky-300 bg-sky-500/10 px-3 py-1.5 rounded-xl border border-sky-500/20"
                  >
                    <Plus className="w-3.5 h-3.5" /> Agregar Día
                  </button>
                </div>

                {formRutina.dias.map((dia, diaIdx) => (
                  <div key={diaIdx} className="bg-slate-950 border border-slate-800/90 rounded-2xl p-4 space-y-3">
                    {/* Header Día con Mover Día */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-800/60 pb-2">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-xs font-bold text-sky-400 font-mono">Día {diaIdx + 1}:</span>
                        <input
                          type="text"
                          value={dia.nombre}
                          onChange={(e) => {
                            const newDias = [...formRutina.dias];
                            newDias[diaIdx].nombre = e.target.value;
                            setFormRutina({ ...formRutina, dias: newDias });
                          }}
                          className="bg-transparent font-bold text-sm text-white border-b border-transparent focus:border-sky-500 focus:outline-none px-1 flex-1"
                        />
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={diaIdx === 0}
                          onClick={() => handleMoveDay(diaIdx, -1)}
                          className="p-1 rounded-lg text-slate-400 hover:text-white disabled:opacity-30"
                          title="Subir día"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={diaIdx === formRutina.dias.length - 1}
                          onClick={() => handleMoveDay(diaIdx, 1)}
                          className="p-1 rounded-lg text-slate-400 hover:text-white disabled:opacity-30"
                          title="Bajar día"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        {formRutina.dias.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveDay(diaIdx)}
                            className="text-slate-500 hover:text-rose-400 text-xs p-1 ml-1"
                            title="Eliminar día"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Lista de Ejercicios del Día con Botones de Reordenar */}
                    <div className="space-y-2">
                      {dia.ejercicios.map((ej, ejIdx) => (
                        <div 
                          key={ejIdx} 
                          className="bg-slate-900 border border-slate-800/80 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          {/* Reordenar Flechas & Nombre */}
                          <div className="flex items-center gap-2">
                            <div className="flex flex-col gap-0.5">
                              <button
                                type="button"
                                disabled={ejIdx === 0}
                                onClick={() => handleMoveExercise(diaIdx, ejIdx, -1)}
                                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-20 transition-colors"
                                title="Mover arriba"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                disabled={ejIdx === dia.ejercicios.length - 1}
                                onClick={() => handleMoveExercise(diaIdx, ejIdx, 1)}
                                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-20 transition-colors"
                                title="Mover abajo"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                            </div>

                            <span className="font-mono text-slate-500 font-bold text-xs">{ejIdx + 1}.</span>

                            <div>
                              <span className="font-bold text-slate-200 block text-sm">
                                {ej.ejercicio?.nombre || 'Ejercicio'}
                              </span>
                              <span className="text-[10px] text-sky-400">
                                {ej.ejercicio?.grupo_muscular || ''}
                              </span>
                            </div>
                          </div>

                          {/* Ajustes de Series, Reps y Descanso */}
                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            {/* Series */}
                            <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                              <span className="text-slate-500 text-[10px]">Series:</span>
                              <input
                                type="number"
                                min="1"
                                max="20"
                                value={ej.series_objetivo}
                                onChange={(e) => {
                                  const newDias = [...formRutina.dias];
                                  newDias[diaIdx].ejercicios[ejIdx].series_objetivo = parseInt(e.target.value) || 1;
                                  setFormRutina({ ...formRutina, dias: newDias });
                                }}
                                className="w-8 bg-transparent text-center text-white font-mono font-bold focus:outline-none"
                              />
                            </div>

                            {/* Reps */}
                            <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                              <span className="text-slate-500 text-[10px]">Reps:</span>
                              <input
                                type="text"
                                value={ej.reps_objetivo}
                                onChange={(e) => {
                                  const newDias = [...formRutina.dias];
                                  newDias[diaIdx].ejercicios[ejIdx].reps_objetivo = e.target.value;
                                  setFormRutina({ ...formRutina, dias: newDias });
                                }}
                                className="w-14 bg-transparent text-center text-white font-mono font-bold focus:outline-none"
                              />
                            </div>

                            {/* Descanso */}
                            <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                              <span className="text-slate-500 text-[10px]">Desc:</span>
                              <input
                                type="number"
                                step="15"
                                value={ej.descanso_segundos}
                                onChange={(e) => {
                                  const newDias = [...formRutina.dias];
                                  newDias[diaIdx].ejercicios[ejIdx].descanso_segundos = parseInt(e.target.value) || 60;
                                  setFormRutina({ ...formRutina, dias: newDias });
                                }}
                                className="w-10 bg-transparent text-center text-white font-mono font-bold focus:outline-none"
                              />
                              <span className="text-slate-500 text-[10px]">s</span>
                            </div>

                            {/* Eliminar ejercicio */}
                            <button
                              type="button"
                              onClick={() => {
                                const newDias = [...formRutina.dias];
                                newDias[diaIdx].ejercicios = newDias[diaIdx].ejercicios.filter((_, idx) => idx !== ejIdx);
                                newDias[diaIdx].ejercicios.forEach((e, i) => { e.orden = i + 1; });
                                setFormRutina({ ...formRutina, dias: newDias });
                              }}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="Quitar ejercicio"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => setExerciseSelectorTarget({ diaIndex: diaIdx })}
                        className="w-full py-2.5 border border-dashed border-slate-800 hover:border-sky-500/50 hover:bg-sky-500/5 rounded-xl text-xs font-semibold text-slate-400 hover:text-sky-400 flex items-center justify-center gap-1.5 transition-all mt-2"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" /> Añadir Ejercicio a este día
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm shadow-lg shadow-sky-500/20 active:scale-95 transition-all"
                >
                  {editingRutinaId ? 'Guardar Cambios' : 'Crear Rutina'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Selector de Ejercicio */}
      {exerciseSelectorTarget !== null && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-white">Seleccionar Ejercicio</h3>
              <button
                onClick={() => setExerciseSelectorTarget(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Buscador */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={searchEj}
                onChange={(e) => setSearchEj(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Filtros de Músculos */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {muscleGroups.map((group) => (
                <button
                  key={group}
                  onClick={() => setSelectedMuscle(group)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedMuscle === group
                      ? 'bg-sky-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>

            {/* Lista de Resultados */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {filteredEjercicios.map((ej) => (
                <div
                  key={ej.id}
                  onClick={() => handleAddExerciseToDay(ej)}
                  className="p-3 rounded-2xl bg-slate-950 hover:bg-sky-500/10 border border-slate-800/80 hover:border-sky-500/40 flex items-center justify-between cursor-pointer transition-all"
                >
                  <div>
                    <h4 className="font-bold text-white text-sm">{ej.nombre}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-sky-400 font-semibold">{ej.grupo_muscular}</span>
                      {ej.equipo && <span className="text-[10px] text-slate-500">• {ej.equipo}</span>}
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
