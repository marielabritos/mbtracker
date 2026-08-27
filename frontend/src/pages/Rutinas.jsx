import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Edit3, ChevronDown, ChevronUp, Dumbbell, 
  Play, Search, X, Check, Clock, ArrowUp, ArrowDown, Calendar, CheckCircle2, Save, Sparkles, Eye, Info 
} from 'lucide-react';
import { api } from '../services/api';
import ExerciseModal from '../components/ExerciseModal';

export default function Rutinas({ onStartWorkout }) {
  const [rutinas, setRutinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRutina, setExpandedRutina] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRutinaId, setEditingRutinaId] = useState(null);
  const [catalogEjercicios, setCatalogEjercicios] = useState([]);
  const [selectedMuscle, setSelectedMuscle] = useState('Todos');
  const [searchEj, setSearchEj] = useState('');
  const [showCreateCustomExercise, setShowCreateCustomExercise] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedVisualExercise, setSelectedVisualExercise] = useState(null);

  // Formulario nuevo ejercicio personalizado
  const [newCustomEx, setNewCustomEx] = useState({
    nombre: '',
    grupo_muscular: 'Pecho',
    equipo: 'Mancuerna',
    descripcion: '',
    gif_url: ''
  });

  // Estado del formulario de creación / edición de rutina
  const [formRutina, setFormRutina] = useState({
    nombre: '',
    descripcion: '',
    duracion_semanas: '4 semanas',
    duracion_estimada_minutos: 50,
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

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

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
      duracion_semanas: '4 semanas',
      duracion_estimada_minutos: 50,
      dias: [
        {
          nombre: 'Día 1',
          orden: 1,
          ejercicios: []
        }
      ]
    });
    setShowCreateCustomExercise(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (rutina) => {
    setEditingRutinaId(rutina.id);
    setFormRutina({
      nombre: rutina.nombre,
      descripcion: rutina.descripcion || '',
      duracion_semanas: rutina.duracion_semanas || '4 semanas',
      duracion_estimada_minutos: rutina.duracion_estimada_minutos || 50,
      dias: (rutina.dias || []).map((d, dIdx) => ({
        nombre: d.nombre,
        orden: dIdx + 1,
        ejercicios: (d.ejercicios || []).map((e, eIdx) => ({
          ejercicio_id: e.ejercicio_id,
          ejercicio: e.ejercicio || catalogEjercicios.find(x => x.id === e.ejercicio_id) || { nombre: 'Ejercicio' },
          series_objetivo: e.series_objetivo || 3,
          reps_objetivo: e.reps_objetivo || '8-12',
          descanso_segundos: e.descanso_segundos || 90,
          orden: eIdx + 1,
          notas: e.notas || ''
        }))
      }))
    });
    setShowCreateCustomExercise(false);
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
    showToast(`✓ "${ejercicio.nombre}" añadido`);
  };

  const handleCreateCustomExercise = async (e) => {
    e.preventDefault();
    if (!newCustomEx.nombre.trim()) return alert("Por favor ingresa el nombre del ejercicio");
    try {
      const created = await api.createEjercicio(newCustomEx);
      setCatalogEjercicios(prev => [created, ...prev]);
      handleAddExerciseToDay(created);
      setShowCreateCustomExercise(false);
      setNewCustomEx({ nombre: '', grupo_muscular: 'Pecho', equipo: 'Mancuerna', descripcion: '', gif_url: '' });
    } catch (err) {
      alert("Error al crear ejercicio: " + err.message);
    }
  };

  const handleUpdateExerciseFromModal = async (updatedExercise) => {
    try {
      await api.updateEjercicio(updatedExercise.id, updatedExercise);
      setCatalogEjercicios(prev => prev.map(e => e.id === updatedExercise.id ? updatedExercise : e));
      
      // Actualizar en el formulario de la rutina
      setFormRutina(prev => ({
        ...prev,
        dias: prev.dias.map(d => ({
          ...d,
          ejercicios: d.ejercicios.map(ej => {
            if (ej.ejercicio_id === updatedExercise.id) {
              return { ...ej, ejercicio: updatedExercise };
            }
            return ej;
          })
        }))
      }));

      setSelectedVisualExercise(updatedExercise);
      showToast("✓ Ejercicio actualizado correctamente");
      loadData();
    } catch (err) {
      alert("Error al actualizar ejercicio");
    }
  };

  const handleSaveRutina = async (e) => {
    if (e) e.preventDefault();
    if (!formRutina.nombre.trim()) return alert("Por favor ingresa un nombre para la rutina");

    // Guardar cambios en nombres de ejercicios si fueron editados inline
    for (const dia of formRutina.dias) {
      for (const ej of dia.ejercicios) {
        if (ej.ejercicio?.nombre && ej.ejercicio_id) {
          api.updateEjercicio(ej.ejercicio_id, {
            nombre: ej.ejercicio.nombre,
            grupo_muscular: ej.ejercicio.grupo_muscular || 'General'
          }).catch(() => {});
        }
      }
    }

    const payload = {
      nombre: formRutina.nombre,
      descripcion: formRutina.descripcion,
      duracion_semanas: formRutina.duracion_semanas || '4 semanas',
      duracion_estimada_minutos: parseInt(formRutina.duracion_estimada_minutos) || 50,
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
        showToast("✓ Rutina actualizada y guardada correctamente");
      } else {
        await api.createRutina(payload);
        showToast("✓ Nueva rutina creada con éxito");
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
      showToast("Rutina eliminada");
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
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 space-y-6 pb-28">
      {/* Toast Notificación */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-2xl shadow-xl font-black text-sm flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Mis Rutinas</h2>
          <p className="text-sm text-slate-400">Organiza, edita y planifica tus ciclos de entrenamiento</p>
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
                  className="p-4 sm:p-5 flex items-start sm:items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors gap-3"
                  onClick={() => setExpandedRutina(isExpanded ? null : rutina.id)}
                >
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-black shrink-0">
                      {rutina.dias?.length || 0}d
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-white text-base md:text-lg truncate">{rutina.nombre}</h3>
                      
                      {/* Badges de Duración y Tiempo */}
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                          <Calendar className="w-3 h-3" /> {rutina.duracion_semanas || '4 semanas'}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/20">
                          <Clock className="w-3 h-3" /> {rutina.duracion_estimada_minutos || 50} min / sesión
                        </span>
                      </div>

                      {rutina.descripcion && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1">{rutina.descripcion}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 sm:gap-2 shrink-0">
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
                  <div className="border-t border-slate-800/80 p-4 sm:p-5 space-y-4 bg-slate-950/40">
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
                                  ejercicios: (dia.ejercicios || []).map((e) => ({
                                    ejercicio_id: e.ejercicio_id,
                                    nombre: e.ejercicio?.nombre || 'Ejercicio',
                                    grupo_muscular: e.ejercicio?.grupo_muscular || 'General',
                                    series_objetivo: e.series_objetivo || 3,
                                    reps_objetivo: e.reps_objetivo || '8-12',
                                    descanso_segundos: e.descanso_segundos || 90
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
                              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60 text-xs gap-2"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="font-mono text-slate-500 font-bold w-4">
                                  {index + 1}.
                                </span>
                                <span className="font-semibold text-slate-200 truncate">
                                  {ej.ejercicio?.nombre}
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-sky-400 font-medium shrink-0">
                                  {ej.ejercicio?.grupo_muscular}
                                </span>
                                
                                <button
                                  type="button"
                                  onClick={() => setSelectedVisualExercise(ej.ejercicio)}
                                  className="p-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 shrink-0"
                                  title="Ver animación / GIF y técnica"
                                >
                                  <Eye className="w-3 h-3" />
                                </button>
                              </div>
                              <div className="flex items-center gap-2 sm:gap-3 text-slate-400 font-mono shrink-0">
                                <span>{ej.series_objetivo} series</span>
                                <span>•</span>
                                <span>{ej.reps_objetivo} reps</span>
                                <span>•</span>
                                <span>{ej.descanso_segundos}s</span>
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
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-black text-xl text-white">
                  {editingRutinaId ? 'Editar Rutina' : 'Crear Nueva Rutina'}
                </h3>
                <p className="text-xs text-slate-400">Edita nombres de ejercicios, reordena y define la duración</p>
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
                  placeholder="Ej: Tren Superior: Tracción & Brazos"
                  value={formRutina.nombre}
                  onChange={(e) => setFormRutina({ ...formRutina, nombre: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              {/* Duración de la Rutina & Tiempo estimado */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Duración del Plan / Ciclo</label>
                  <select
                    value={formRutina.duracion_semanas}
                    onChange={(e) => setFormRutina({ ...formRutina, duracion_semanas: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="2 semanas">2 semanas</option>
                    <option value="4 semanas">4 semanas (1 mes)</option>
                    <option value="6 semanas">6 semanas</option>
                    <option value="8 semanas">8 semanas (2 meses)</option>
                    <option value="12 semanas">12 semanas (3 meses)</option>
                    <option value="Continuo">Continuo</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Tiempo Estimado (min)</label>
                  <input
                    type="number"
                    min="15"
                    max="180"
                    step="5"
                    value={formRutina.duracion_estimada_minutos}
                    onChange={(e) => setFormRutina({ ...formRutina, duracion_estimada_minutos: parseInt(e.target.value) || 45 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Descripción u Objetivo</label>
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
                    {/* Header Día */}
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

                    {/* Lista de Ejercicios */}
                    <div className="space-y-2.5">
                      {dia.ejercicios.map((ej, ejIdx) => (
                        <div 
                          key={ejIdx} 
                          className="bg-slate-900 border border-slate-800/90 p-3.5 sm:p-4 rounded-2xl space-y-2.5 shadow-lg transition-all"
                        >
                          {/* Fila 1: Flechas + Nombre Amplio + Ver GIF + Eliminar */}
                          <div className="flex items-center gap-2">
                            <div className="flex flex-col gap-0.5 shrink-0">
                              <button
                                type="button"
                                disabled={ejIdx === 0}
                                onClick={() => handleMoveExercise(diaIdx, ejIdx, -1)}
                                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-20 transition-colors"
                                title="Mover arriba"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={ejIdx === dia.ejercicios.length - 1}
                                onClick={() => handleMoveExercise(diaIdx, ejIdx, 1)}
                                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-20 transition-colors"
                                title="Mover abajo"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <span className="font-mono text-slate-400 font-black text-sm shrink-0">{ejIdx + 1}.</span>

                            {/* Input de Nombre Completo y Legible */}
                            <div className="flex-1 min-w-0">
                              <input
                                type="text"
                                value={ej.ejercicio?.nombre || ''}
                                onChange={(e) => {
                                  const newDias = [...formRutina.dias];
                                  newDias[diaIdx].ejercicios[ejIdx].ejercicio = {
                                    ...newDias[diaIdx].ejercicios[ejIdx].ejercicio,
                                    nombre: e.target.value
                                  };
                                  setFormRutina({ ...formRutina, dias: newDias });
                                }}
                                placeholder="Nombre del ejercicio..."
                                className="w-full bg-slate-950 border border-slate-700/90 focus:border-sky-400 rounded-xl px-3 py-2 font-bold text-white text-sm focus:outline-none shadow-inner"
                              />
                            </div>

                            {/* Botón GIF y Eliminar */}
                            <button
                              type="button"
                              onClick={() => setSelectedVisualExercise(ej.ejercicio)}
                              className="p-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 border border-sky-500/30 flex items-center gap-1.5 text-xs font-bold shrink-0 transition-colors"
                              title="Ver demostración GIF y técnica"
                            >
                              <Eye className="w-4 h-4" />
                              <span className="hidden sm:inline">Ver GIF</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const newDias = [...formRutina.dias];
                                newDias[diaIdx].ejercicios = newDias[diaIdx].ejercicios.filter((_, idx) => idx !== ejIdx);
                                newDias[diaIdx].ejercicios.forEach((e, i) => { e.orden = i + 1; });
                                setFormRutina({ ...formRutina, dias: newDias });
                              }}
                              className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
                              title="Quitar ejercicio"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Fila 2: Músculo + Configuración de Series, Repeticiones y Descanso */}
                          <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-slate-800/60">
                            <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-[11px] text-sky-400 font-bold border border-slate-800">
                              {ej.ejercicio?.grupo_muscular || 'General'}
                            </span>

                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800">
                                <span className="text-slate-400 text-xs font-semibold">Series:</span>
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
                                  className="w-10 bg-transparent text-center text-white font-mono font-bold focus:outline-none text-xs"
                                />
                              </div>

                              <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800">
                                <span className="text-slate-400 text-xs font-semibold">Reps:</span>
                                <input
                                  type="text"
                                  value={ej.reps_objetivo}
                                  onChange={(e) => {
                                    const newDias = [...formRutina.dias];
                                    newDias[diaIdx].ejercicios[ejIdx].reps_objetivo = e.target.value;
                                    setFormRutina({ ...formRutina, dias: newDias });
                                  }}
                                  className="w-14 bg-transparent text-center text-white font-mono font-bold focus:outline-none text-xs"
                                />
                              </div>

                              <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800">
                                <span className="text-slate-400 text-xs font-semibold">Desc:</span>
                                <input
                                  type="number"
                                  step="15"
                                  value={ej.descanso_segundos}
                                  onChange={(e) => {
                                    const newDias = [...formRutina.dias];
                                    newDias[diaIdx].ejercicios[ejIdx].descanso_segundos = parseInt(e.target.value) || 60;
                                    setFormRutina({ ...formRutina, dias: newDias });
                                  }}
                                  className="w-12 bg-transparent text-center text-white font-mono font-bold focus:outline-none text-xs"
                                />
                                <span className="text-slate-500 text-[10px]">s</span>
                              </div>
                            </div>
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

              {/* Botón Guardar Cambios Destacado */}
              <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-md pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  <Save className="w-4 h-4 fill-current" />
                  {editingRutinaId ? 'Guardar Cambios' : 'Guardar Rutina'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Selector & Creador de Ejercicios */}
      {exerciseSelectorTarget !== null && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-white">Seleccionar Ejercicio</h3>
                <p className="text-xs text-slate-400">Elige del catálogo o crea uno personalizado</p>
              </div>
              <button
                onClick={() => {
                  setExerciseSelectorTarget(null);
                  setShowCreateCustomExercise(false);
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!showCreateCustomExercise ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Buscar por nombre..."
                      value={searchEj}
                      onChange={(e) => setSearchEj(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <button
                    onClick={() => setShowCreateCustomExercise(true)}
                    className="flex items-center gap-1 px-3 py-2.5 rounded-2xl bg-sky-500/15 border border-sky-500/30 text-sky-400 font-bold text-xs whitespace-nowrap hover:bg-sky-500/25"
                  >
                    <Plus className="w-3.5 h-3.5" /> + Crear
                  </button>
                </div>

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

                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                  {filteredEjercicios.map((ej) => (
                    <div
                      key={ej.id}
                      className="p-3 rounded-2xl bg-slate-950 hover:bg-sky-500/10 border border-slate-800/80 hover:border-sky-500/40 flex items-center justify-between transition-all"
                    >
                      <div 
                        onClick={() => handleAddExerciseToDay(ej)}
                        className="flex-1 cursor-pointer"
                      >
                        <h4 className="font-bold text-white text-sm">{ej.nombre}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-sky-400 font-semibold">{ej.grupo_muscular}</span>
                          {ej.equipo && <span className="text-[10px] text-slate-500">• {ej.equipo}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedVisualExercise(ej)}
                          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-sky-400 border border-slate-800"
                          title="Ver demostración GIF"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddExerciseToDay(ej)}
                          className="p-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold"
                          title="Añadir a la rutina"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <form onSubmit={handleCreateCustomExercise} className="space-y-3 pt-1">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Nombre del Ejercicio</label>
                  <input
                    type="text"
                    placeholder="Ej. Press Guillotina"
                    value={newCustomEx.nombre}
                    onChange={(e) => setNewCustomEx({ ...newCustomEx, nombre: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Grupo Muscular</label>
                    <select
                      value={newCustomEx.grupo_muscular}
                      onChange={(e) => setNewCustomEx({ ...newCustomEx, grupo_muscular: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                    >
                      {['Pecho', 'Espalda', 'Piernas', 'Hombros', 'Brazos', 'Core', 'Cardio'].map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Equipo</label>
                    <select
                      value={newCustomEx.equipo}
                      onChange={(e) => setNewCustomEx({ ...newCustomEx, equipo: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                    >
                      {['Mancuerna', 'Barra', 'Máquina', 'Polea', 'Peso Corporal'].map(eq => (
                        <option key={eq} value={eq}>{eq}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">URL de GIF o Animación (Opcional)</label>
                  <input
                    type="url"
                    placeholder="https://ejemplo.com/demostracion.gif"
                    value={newCustomEx.gif_url}
                    onChange={(e) => setNewCustomEx({ ...newCustomEx, gif_url: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Notas (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Ej. En banco inclinado a 30°"
                    value={newCustomEx.descripcion}
                    onChange={(e) => setNewCustomEx({ ...newCustomEx, descripcion: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowCreateCustomExercise(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    Volver al Catálogo
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20"
                  >
                    Guardar y Añadir a la Rutina
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal de Demostración Visual / GIF & Técnica */}
      {selectedVisualExercise && (
        <ExerciseModal
          exercise={selectedVisualExercise}
          onClose={() => setSelectedVisualExercise(null)}
          onUpdateExercise={handleUpdateExerciseFromModal}
        />
      )}
    </div>
  );
}
