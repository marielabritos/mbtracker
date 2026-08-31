import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Trophy, Dumbbell, 
  Clock, Flame, MapPin, Mountain, TrendingUp, CheckCircle2, ChevronDown, 
  ChevronUp, Sparkles, Activity, Plus, Play, Award 
} from 'lucide-react';
import { api } from '../services/api';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export default function Calendario({ onStartWorkout, onNavigateTab }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [sesiones, setSesiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSessionId, setExpandedSessionId] = useState(null);

  useEffect(() => {
    loadSesiones();
  }, []);

  const loadSesiones = async () => {
    try {
      setLoading(true);
      const data = await api.getSesiones(200);
      setSesiones(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleGoToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDateStr(today.toISOString().split('T')[0]);
  };

  // Mapear sesiones por fecha YYYY-MM-DD
  const sessionsByDate = {};
  sesiones.forEach(s => {
    const rawDate = s.fecha_inicio || s.fecha;
    if (rawDate) {
      const dStr = new Date(rawDate).toISOString().split('T')[0];
      if (!sessionsByDate[dStr]) {
        sessionsByDate[dStr] = [];
      }
      sessionsByDate[dStr].push(s);
    }
  });

  // Generar cuadrícula del mes
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const calendarDays = [];

  // Días del mes anterior
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dNum = prevMonthDays - i;
    const prevM = month === 0 ? 11 : month - 1;
    const prevY = month === 0 ? year - 1 : year;
    const dateStr = `${prevY}-${String(prevM + 1).padStart(2, '0')}-${String(dNum).padStart(2, '0')}`;
    calendarDays.push({ dayNum: dNum, dateStr, isCurrentMonth: false });
  }

  // Días del mes actual
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    calendarDays.push({ dayNum: i, dateStr, isCurrentMonth: true });
  }

  // Días del mes siguiente para completar múltiplos de 7
  const remaining = 42 - calendarDays.length;
  for (let i = 1; i <= remaining; i++) {
    const nextM = month === 11 ? 0 : month + 1;
    const nextY = month === 11 ? year + 1 : year;
    const dateStr = `${nextY}-${String(nextM + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    calendarDays.push({ dayNum: i, dateStr, isCurrentMonth: false });
  }

  // Métricas del mes seleccionado
  const sessionsThisMonth = sesiones.filter(s => {
    const rawDate = s.fecha_inicio || s.fecha;
    if (!rawDate) return false;
    const d = new Date(rawDate);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  const monthTrainedDays = new Set(sessionsThisMonth.map(s => new Date(s.fecha_inicio || s.fecha).toISOString().split('T')[0])).size;
  const monthTotalVolume = sessionsThisMonth.reduce((acc, s) => {
    return acc + (s.series || []).reduce((sAcc, item) => sAcc + ((parseFloat(item.peso_kg) || 0) * (parseInt(item.repeticiones) || 0)), 0);
  }, 0);
  const monthTotalSecs = sessionsThisMonth.reduce((acc, s) => acc + (parseInt(s.duracion_segundos) || 0), 0);
  const monthPRs = sessionsThisMonth.reduce((acc, s) => acc + (s.series || []).filter(item => item.es_pr).length, 0);

  const selectedSessions = sessionsByDate[selectedDateStr] || [];
  const todayStr = new Date().toISOString().split('T')[0];

  // Helper de iconos de deporte
  const getSportIcon = (s) => {
    if (s.deporte === 'running') return '🏃';
    if (s.deporte === 'ciclismo') return '🚴';
    if (s.deporte === 'montanismo') return '⛰️';
    if (s.nombre?.toLowerCase().includes('calentam')) return '🔥';
    if (s.nombre?.toLowerCase().includes('rehab')) return '🦵';
    if (s.nombre?.toLowerCase().includes('estira')) return '🧘';
    return '🏋️';
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 space-y-6 pb-28 font-sans">
      {/* Encabezado Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-sky-500/15 border border-sky-500/30 text-sky-400 text-xl">
              📅
            </span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Calendario de Entrenamientos</h2>
              <p className="text-xs sm:text-sm text-slate-400">Planifica, revisa tu constancia y revive cada sesión completada</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleGoToday}
          className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all w-fit"
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>Ir a Hoy</span>
        </button>
      </div>

      {/* Resumen Mensual de Constancia */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>Días Activos</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1 pt-1">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">{monthTrainedDays}</span>
            <span className="text-xs text-slate-500 font-bold">/ {daysInMonth} días</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold block">
            {Math.round((monthTrainedDays / daysInMonth) * 100)}% de constancia
          </span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>Sesiones Mes</span>
            <Dumbbell className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-1 pt-1">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">{sessionsThisMonth.length}</span>
            <span className="text-xs text-slate-500 font-bold">completadas</span>
          </div>
          <span className="text-[10px] text-sky-400 font-bold block">
            {Math.round(monthTotalSecs / 3600 * 10) / 10} horas totales
          </span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>Volumen Mensual</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1 pt-1">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">
              {Math.round(monthTotalVolume / 1000)}k
            </span>
            <span className="text-xs text-slate-500 font-bold">kg</span>
          </div>
          <span className="text-[10px] text-amber-400 font-bold block">
            {monthTotalVolume.toLocaleString('es-ES')} kg levantados
          </span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>Récords (PRs)</span>
            <Trophy className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="flex items-baseline gap-1 pt-1">
            <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">{monthPRs}</span>
            <span className="text-xs text-slate-500 font-bold">nuevas marcas</span>
          </div>
          <span className="text-[10px] text-slate-400 font-bold block">
            en {MONTH_NAMES[month]} {year}
          </span>
        </div>
      </div>

      {/* Tarjeta Calendario Mensual */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 space-y-4 shadow-xl">
        {/* Selector de Mes */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-sky-400" />
            <h3 className="font-black text-lg sm:text-xl text-white tracking-tight">
              {MONTH_NAMES[month]} <span className="text-sky-400 font-mono">{year}</span>
            </h3>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-all active:scale-95"
              title="Mes Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-all active:scale-95"
              title="Mes Siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Encabezado Días de la Semana */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-black uppercase text-slate-500 tracking-wider pb-1">
          {DAY_NAMES.map((d) => (
            <div key={d} className="py-1">{d}</div>
          ))}
        </div>

        {/* Cuadrícula de Días */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {calendarDays.map((item, idx) => {
            const isToday = item.dateStr === todayStr;
            const isSelected = item.dateStr === selectedDateStr;
            const daySessions = sessionsByDate[item.dateStr] || [];
            const hasWorkout = daySessions.length > 0;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedDateStr(item.dateStr)}
                className={`min-h-[60px] sm:min-h-[76px] p-1.5 sm:p-2 rounded-2xl flex flex-col justify-between items-start transition-all relative text-left select-none ${
                  !item.isCurrentMonth ? 'opacity-30 bg-slate-950/40' : 'bg-slate-950/80 hover:bg-slate-800/60 border border-slate-800/80'
                } ${
                  isSelected ? 'ring-2 ring-sky-400 bg-sky-500/10 border-sky-500/50' : ''
                } ${
                  isToday ? 'border-amber-500/50 bg-amber-500/5' : ''
                }`}
              >
                {/* Número del día + Indicador Hoy */}
                <div className="w-full flex items-center justify-between">
                  <span className={`text-xs sm:text-sm font-mono font-black ${
                    isToday ? 'text-amber-400' : isSelected ? 'text-sky-300' : item.isCurrentMonth ? 'text-white' : 'text-slate-500'
                  }`}>
                    {item.dayNum}
                  </span>
                  {isToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  )}
                </div>

                {/* Badges de entrenamientos en ese día */}
                <div className="w-full mt-1 flex flex-wrap gap-1 items-center">
                  {daySessions.slice(0, 2).map((s, sIdx) => (
                    <span 
                      key={sIdx} 
                      className="text-[11px] sm:text-xs" 
                      title={s.nombre}
                    >
                      {getSportIcon(s)}
                    </span>
                  ))}
                  {daySessions.length > 2 && (
                    <span className="text-[9px] font-mono font-bold text-sky-400">
                      +{daySessions.length - 2}
                    </span>
                  )}
                </div>

                {/* Barra de estado inferior */}
                {hasWorkout && (
                  <div className="w-full mt-auto pt-1">
                    <div className="w-full h-1 rounded-full bg-gradient-to-r from-emerald-400 to-sky-400 shadow-sm" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Detalle del Día Seleccionado */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📋</span>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white">
                Entrenamientos del {new Date(selectedDateStr + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {selectedSessions.length === 0 ? 'Sin sesiones registradas en esta fecha' : `${selectedSessions.length} sesión(es) completada(s)`}
              </span>
            </div>
          </div>

          {onStartWorkout && (
            <button
              onClick={() => onStartWorkout({ nombre: 'Entrenamiento Libre', tipo: 'gimnasio' })}
              className="px-4 py-2 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all w-fit"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Registrar Entrenamiento</span>
            </button>
          )}
        </div>

        {selectedSessions.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/40 rounded-2xl border border-slate-800/60 space-y-2">
            <CalendarIcon className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-slate-300">No hay sesiones en esta fecha</p>
            <p className="text-xs text-slate-500">Toca "Registrar Entrenamiento" o realiza una sesión para verla aquí.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {selectedSessions.map((sesion) => {
              const isExpanded = expandedSessionId === sesion.id;
              const isOutdoor = sesion.tipo === 'outdoor_cardio' || sesion.deporte;
              const totalVol = (sesion.series || []).reduce((acc, s) => acc + ((parseFloat(s.peso_kg) || 0) * (parseInt(s.repeticiones) || 0)), 0);

              return (
                <div
                  key={sesion.id}
                  className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-md"
                >
                  <div 
                    onClick={() => setExpandedSessionId(isExpanded ? null : sesion.id)}
                    className="flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-xl shrink-0">
                        {getSportIcon(sesion)}
                      </div>
                      <div>
                        <h4 className="font-black text-white text-base">{sesion.nombre}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-0.5">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-sky-400" />
                            {Math.round((sesion.duracion_segundos || 0) / 60)} min
                          </span>
                          {!isOutdoor && totalVol > 0 && (
                            <span className="flex items-center gap-1 text-emerald-400">
                              <Dumbbell className="w-3.5 h-3.5" />
                              {Math.round(totalVol)} kg
                            </span>
                          )}
                          {isOutdoor && (
                            <span className="flex items-center gap-1 text-amber-400">
                              <MapPin className="w-3.5 h-3.5" />
                              {sesion.distancia_km} km
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="p-2 rounded-xl text-slate-400 hover:text-white"
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Detalle desplegable de series / ejercicios */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-slate-800 space-y-3 animate-in fade-in duration-200">
                      {isOutdoor ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-900/60 p-3 rounded-2xl border border-slate-800 text-xs font-mono">
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase">Ritmo / Velocidad</span>
                            <span className="font-black text-white">{sesion.ritmo_min_km || `${sesion.velocidad_kmh} km/h`}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase">Calorías</span>
                            <span className="font-black text-amber-400">{sesion.calorias_quemadas || 0} kcal</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase">Desnivel</span>
                            <span className="font-black text-emerald-400">+{sesion.desnivel_positivo_m || 0} m</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase">Pulsaciones</span>
                            <span className="font-black text-rose-400">{sesion.frecuencia_cardiaca_media || '--'} bpm</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {(sesion.series || []).map((serie, sIdx) => (
                            <div
                              key={sIdx}
                              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-300 font-mono font-bold flex items-center justify-center text-[10px]">
                                  {serie.numero_serie || sIdx + 1}
                                </span>
                                <span className="font-bold text-white">
                                  {serie.ejercicio?.nombre || serie.nombre_ejercicio || 'Ejercicio'}
                                </span>
                              </div>

                              <div className="flex items-center gap-3 font-mono font-bold">
                                <span className="text-sky-400">{serie.peso_kg} kg</span>
                                <span className="text-slate-400">× {serie.repeticiones} reps</span>
                                {serie.es_pr && (
                                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-black border border-amber-500/30">
                                    PR
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
