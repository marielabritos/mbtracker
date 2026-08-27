import React, { useState, useEffect } from 'react';
import { Play, Flame, Trophy, Dumbbell, Clock, ChevronRight, TrendingUp, CalendarCheck } from 'lucide-react';
import { api } from '../services/api';

export default function Dashboard({ onStartWorkout, onNavigateTab }) {
  const [stats, setStats] = useState(null);
  const [rutinas, setRutinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRutinaId, setSelectedRutinaId] = useState('');
  const [selectedDiaId, setSelectedDiaId] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, rutinasData] = await Promise.all([
        api.getDashboardStats().catch(() => null),
        api.getRutinas().catch(() => [])
      ]);
      setStats(statsData);
      setRutinas(rutinasData);
      if (rutinasData.length > 0 && rutinasData[0].dias.length > 0) {
        setSelectedRutinaId(rutinasData[0].id);
        setSelectedDiaId(rutinasData[0].dias[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRutinaChange = (rutinaId) => {
    setSelectedRutinaId(rutinaId);
    const rutina = rutinas.find(r => r.id === parseInt(rutinaId));
    if (rutina && rutina.dias.length > 0) {
      setSelectedDiaId(rutina.dias[0].id);
    } else {
      setSelectedDiaId('');
    }
  };

  const handleStartSelected = () => {
    const rutina = rutinas.find(r => r.id === parseInt(selectedRutinaId));
    const dia = rutina?.dias?.find(d => d.id === parseInt(selectedDiaId));
    onStartWorkout({
      nombre: dia ? `${dia.nombre}` : 'Entrenamiento Libre',
      dia_rutina_id: dia?.id || null,
      ejercicios: dia?.ejercicios?.map(e => ({
        ejercicio_id: e.ejercicio_id,
        nombre: e.ejercicio.nombre,
        grupo_muscular: e.ejercicio.grupo_muscular,
        series_objetivo: e.series_objetivo,
        reps_objetivo: e.reps_objetivo,
        descanso_segundos: e.descanso_segundos
      })) || []
    });
  };

  const handleStartQuickEmpty = () => {
    onStartWorkout({
      nombre: 'Entrenamiento Libre',
      dia_rutina_id: null,
      ejercicios: []
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-28">
      {/* Header Saludo */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Bienvenido de nuevo</span>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">¿Listo para entrenar hoy?</h2>
        </div>
        <button
          onClick={handleStartQuickEmpty}
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold border border-slate-700 transition-all"
        >
          <Dumbbell className="w-4 h-4 text-sky-400" />
          Sesión Libre
        </button>
      </div>

      {/* Hero: Empezar Entrenamiento */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 via-sky-700 to-indigo-900 p-6 md:p-8 shadow-2xl text-white">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold tracking-wide uppercase text-sky-200 border border-white/15">
            <Flame className="w-3.5 h-3.5 text-amber-300" />
            Entrenamiento del Día
          </div>

          <div className="grid md:grid-cols-2 gap-4 items-center">
            <div>
              <h3 className="text-xl md:text-2xl font-black tracking-tight">Inicia tu rutina ahora</h3>
              <p className="text-sky-100/80 text-sm mt-1">
                Registra tus series en vivo, visualiza tus pesos anteriores y usa el cronómetro de descanso.
              </p>
            </div>

            {/* Selectores de Rutina & Día */}
            {rutinas.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={selectedRutinaId}
                  onChange={(e) => handleRutinaChange(e.target.value)}
                  className="bg-slate-900/80 border border-white/20 text-white rounded-2xl px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                  {rutinas.map((r) => (
                    <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                      {r.nombre}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedDiaId}
                  onChange={(e) => setSelectedDiaId(e.target.value)}
                  className="bg-slate-900/80 border border-white/20 text-white rounded-2xl px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                  {rutinas
                    .find((r) => r.id === parseInt(selectedRutinaId))
                    ?.dias?.map((d) => (
                      <option key={d.id} value={d.id} className="bg-slate-900 text-white">
                        {d.nombre}
                      </option>
                    ))}
                </select>
              </div>
            )}

            {/* Badges de duración en el Dashboard */}
            {selectedRutinaId && (
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-200">
                <span className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/15">
                  📅 Vigencia: {rutinas.find(r => r.id === parseInt(selectedRutinaId))?.duracion_semanas || '4 semanas'}
                </span>
                <span className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/15">
                  ⏱️ ~{rutinas.find(r => r.id === parseInt(selectedRutinaId))?.duracion_estimada_minutos || 50} min
                </span>
              </div>
            )}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleStartSelected}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-black text-base shadow-xl transition-all active:scale-95"
            >
              <Play className="w-5 h-5 fill-current text-sky-600" />
              Empezar Entrenamiento
            </button>
            <button
              onClick={handleStartQuickEmpty}
              className="sm:hidden flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/15"
            >
              Sesión Libre / Sin Rutina
            </button>
          </div>
        </div>
      </div>

      {/* Métricas / Estadísticas Rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 md:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total Sesiones</span>
            <Dumbbell className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-black text-white">
              {stats?.total_entrenamientos || 0}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">completadas</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 md:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Racha mensual</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-black text-amber-400">
              {stats?.racha_dias_mes || 0}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">días este mes</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 md:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Volumen 7d</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-black text-emerald-400">
              {stats?.volumen_semanal_kg ? `${Math.round(stats.volumen_semanal_kg).toLocaleString()} kg` : '0 kg'}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">levantados</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 md:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Tiempo Total</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-black text-white">
              {stats?.tiempo_total_minutos ? `${stats.tiempo_total_minutos}m` : '0m'}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">en el gimnasio</span>
          </div>
        </div>
      </div>

      {/* Récords Personales (PRs) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-lg text-white">Tus Mejores Marcas (PRs)</h3>
          </div>
          <button
            onClick={() => onNavigateTab('progreso')}
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
          >
            Ver Progreso <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {stats?.ultimos_prs && stats.ultimos_prs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {stats.ultimos_prs.map((pr) => (
              <div
                key={pr.ejercicio_id}
                className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 transition-all"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/90 block">
                  {pr.grupo_muscular}
                </span>
                <h4 className="font-bold text-slate-200 text-sm mt-0.5 truncate" title={pr.ejercicio_nombre}>
                  {pr.ejercicio_nombre}
                </h4>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-amber-400 font-mono">
                    {pr.peso_maximo_kg} kg
                  </span>
                  <span className="text-xs text-slate-400">× {pr.repeticiones} reps</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 text-center text-slate-400">
            <p className="text-sm">Aún no has registrado récords. ¡Completa tu primer entrenamiento para ver tus marcas aquí!</p>
          </div>
        )}
      </div>

      {/* Últimos Entrenamientos */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-lg text-white">Actividad Reciente</h3>
          </div>
          <button
            onClick={() => onNavigateTab('historial')}
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
          >
            Ver Todo <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {stats?.ultimas_sesiones && stats.ultimas_sesiones.length > 0 ? (
          <div className="space-y-2">
            {stats.ultimas_sesiones.map((sesion) => (
              <div
                key={sesion.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between hover:bg-slate-800/50 transition-all cursor-pointer"
                onClick={() => onNavigateTab('historial')}
              >
                <div>
                  <h4 className="font-bold text-white text-sm">{sesion.nombre}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span>{new Date(sesion.fecha_inicio).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                    <span>•</span>
                    <span>{sesion.series.length} series registradas</span>
                    {sesion.duracion_segundos > 0 && (
                      <>
                        <span>•</span>
                        <span>{Math.round(sesion.duracion_segundos / 60)} min</span>
                      </>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500" />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 text-center text-slate-400">
            <p className="text-sm">No hay entrenamientos recientes registrados.</p>
          </div>
        )}
      </div>
    </div>
  );
}
