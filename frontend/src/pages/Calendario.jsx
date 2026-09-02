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
  const [statsViewMode, setStatsViewMode] = useState('mes'); // 'mes' | 'total'

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

  // Métricas globales / todos los tiempos (desde 26-08)
  const totalTrainedDays = new Set(sesiones.map(s => new Date(s.fecha_inicio || s.fecha).toISOString().split('T')[0])).size;
  const totalAllVolume = sesiones.reduce((acc, s) => {
    return acc + (s.series || []).reduce((sAcc, item) => sAcc + ((parseFloat(item.peso_kg) || 0) * (parseInt(item.repeticiones) || 0)), 0);
  }, 0);
  const totalAllSecs = sesiones.reduce((acc, s) => acc + (parseInt(s.duracion_segundos) || 0), 0);
  const totalPRs = sesiones.reduce((acc, s) => acc + (s.series || []).filter(item => item.es_pr).length, 0);

  const isViewingTotal = statsViewMode === 'total';
  const displayDays = isViewingTotal ? totalTrainedDays : monthTrainedDays;
  const displaySessionsCount = isViewingTotal ? sesiones.length : sessionsThisMonth.length;
  const displayVolume = isViewingTotal ? totalAllVolume : monthTotalVolume;
  const displaySecs = isViewingTotal ? totalAllSecs : monthTotalSecs;
  const displayPRs = isViewingTotal ? totalPRs : monthPRs;

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

        <div className="flex items-center gap-2">
          {/* Switcher Mes Actual vs Racha Total */}
          <div className="flex items-center p-1 bg-slate-900 rounded-2xl border border-slate-800 text-xs">
            <button
              onClick={() => setStatsViewMode('mes')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                !isViewingTotal ? 'bg-sky-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {MONTH_NAMES[month]}
            </button>
            <button
              onClick={() => setStatsViewMode('total')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                isViewingTotal ? 'bg-sky-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Racha Total (26-08)
            </button>
          </div>

          <button
            onClick={handleGoToday}
            className="px-3.5 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all w-fit"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Ir a Hoy</span>
          </button>
        </div>
      </div>

      {/* Banner de Racha Activa y Próximo Día */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-sky-950/50 border border-emerald-500/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/20 shrink-0">
            🔥
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-white text-base">¡Llevas 3 días completados de gimnasio!</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/30">
                INICIO: 26-08
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Completaste los días <strong>26-08, 28-08 y 31-08</strong>. ¡Hoy cuando entrenes será tu <strong>Día 4</strong>! 💪
            </p>
          </div>
        </div>

        <button
          onClick={() => onStartWorkout && onStartWorkout({ tipo: 'gimnasio', nombre: 'Día 4: Entrenamiento de Fuerza & Glúteos' })}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all shrink-0"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Iniciar Día 4 de Hoy</span>
        </button>
      </div>

      {/* Resumen Mensual / Global de Constancia */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>Días Activos</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1 pt-1">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">{displayDays}</span>
            <span className="text-xs text-slate-500 font-bold">/ {isViewingTotal ? '30 días' : `${daysInMonth} días`}</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold block">
            {isViewingTotal ? 'Racha activa desde 26-08' : `${Math.round((displayDays / daysInMonth) * 100)}% de constancia`}
          </span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>Sesiones {isViewingTotal ? 'Totales' : 'Mes'}</span>
            <Dumbbell className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-1 pt-1">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">{displaySessionsCount}</span>
            <span className="text-xs text-slate-500 font-bold">completadas</span>
          </div>
          <span className="text-[10px] text-sky-400 font-bold block">
            {Math.round(displaySecs / 3600 * 10) / 10} horas totales
          </span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>Volumen {isViewingTotal ? 'Total' : 'Mensual'}</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1 pt-1">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">
              {(displayVolume / 1000).toFixed(1)}k
            </span>
            <span className="text-xs text-slate-500 font-bold">kg</span>
          </div>
          <span className="text-[10px] text-amber-400 font-bold block">
            {displayVolume.toLocaleString('es-ES')} kg levantados
          </span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>Récords (PRs)</span>
            <Trophy className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="flex items-baseline gap-1 pt-1">
            <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">{displayPRs}</span>
            <span className="text-xs text-slate-500 font-bold">marcas</span>
          </div>
          <span className="text-[10px] text-slate-400 font-bold block">
            {isViewingTotal ? 'Fuerza en ascenso' : `en ${MONTH_NAMES[month]} ${year}`}
          </span>
        </div>
      </div>

      {/* Tarjeta Calendario Mensual */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 space-y-4 shadow-xl">
        {/* Selector de Mes */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-black text-lg sm:text-xl text-white">
              {MONTH_NAMES[month]} <span className="text-sky-400 font-mono">{year}</span>
            </h3>
            {monthTrainedDays > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                {monthTrainedDays} días entrenados
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Mes anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Mes siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Encabezados Días de la Semana */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider py-1 border-b border-slate-800">
          {DAY_NAMES.map((d, i) => (
            <div key={i} className={i === 0 || i === 6 ? 'text-rose-400/80' : ''}>
              {d}
            </div>
          ))}
        </div>

        {/* Días del Calendario */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {calendarDays.map((item, idx) => {
            const hasSessions = !!sessionsByDate[item.dateStr];
            const isSelected = selectedDateStr === item.dateStr;
            const isToday = item.dateStr === todayStr;
            const daySessions = sessionsByDate[item.dateStr] || [];
            const dayVol = daySessions.reduce((acc, s) => {
              return acc + (s.series || []).reduce((sAcc, it) => sAcc + ((parseFloat(it.peso_kg) || 0) * (parseInt(it.repeticiones) || 0)), 0);
            }, 0);

            return (
              <button
                key={idx}
                onClick={() => setSelectedDateStr(item.dateStr)}
                className={`min-h-[64px] sm:min-h-[82px] p-1.5 sm:p-2 rounded-2xl border flex flex-col justify-between text-left transition-all relative group ${
                  isSelected
                    ? 'border-sky-400 bg-sky-950/40 shadow-lg shadow-sky-500/10'
                    : isToday
                      ? 'border-amber-400/60 bg-amber-500/10'
                      : hasSessions
                        ? 'border-emerald-500/40 bg-emerald-950/20 hover:border-emerald-400'
                        : item.isCurrentMonth
                          ? 'border-slate-800/80 bg-slate-950/50 hover:border-slate-700'
                          : 'border-transparent bg-slate-950/20 opacity-30'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs sm:text-sm font-mono font-bold ${
                      isToday
                        ? 'px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black'
                        : hasSessions
                          ? 'text-emerald-400'
                          : item.isCurrentMonth
                            ? 'text-slate-300'
                            : 'text-slate-600'
                    }`}
                  >
                    {item.dayNum}
                  </span>

                  {hasSessions && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </div>

                {/* Badges de Sesión en la casilla */}
                {hasSessions && (
                  <div className="space-y-0.5 mt-1">
                    {daySessions.slice(0, 1).map((s, sIdx) => (
                      <div
                        key={sIdx}
                        className="text-[9px] sm:text-[10px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-1.5 py-0.5 rounded-lg truncate flex items-center gap-1"
                      >
                        <span>{getSportIcon(s)}</span>
                        <span className="truncate">{s.nombre}</span>
                      </div>
                    ))}
                    {dayVol > 0 && (
                      <span className="text-[8px] sm:text-[9px] text-slate-400 font-mono block truncate">
                        {(dayVol / 1000).toFixed(1)}k kg
                      </span>
                    )}
                  </div>
                )}

                {isToday && !hasSessions && (
                  <div className="text-[9px] text-amber-300 font-bold truncate">
                    ⭐ Hoy (Día 4)
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Detalle del Día Seleccionado */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📋</span>
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg">
                Sesiones del {new Date(`${selectedDateStr}T12:00:00`).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </h3>
              <p className="text-xs text-slate-400">
                {selectedSessions.length === 0
                  ? 'No hay registros guardados en esta fecha'
                  : `${selectedSessions.length} sesión(es) completada(s)`}
              </p>
            </div>
          </div>

          <button
            onClick={() => onStartWorkout && onStartWorkout({ tipo: 'gimnasio', nombre: 'Entrenamiento del Día' })}
            className="px-3.5 py-2 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Entrenar Este Día</span>
          </button>
        </div>

        {selectedSessions.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-xl text-slate-400">
              ☕
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
              Día de descanso o sin sesión registrada. Toca "Entrenar Este Día" para iniciar tu sesión.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedSessions.map((s, idx) => {
              const isExpanded = expandedSessionId === s.id;
              const hasPR = (s.series || []).some(item => item.es_pr);
              const vol = (s.series || []).reduce((acc, it) => acc + ((parseFloat(it.peso_kg) || 0) * (parseInt(it.repeticiones) || 0)), 0);

              return (
                <div key={s.id || idx} className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
                  <div
                    onClick={() => setExpandedSessionId(isExpanded ? null : s.id)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-900/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-xl shrink-0">
                        {getSportIcon(s)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-white text-sm sm:text-base truncate">{s.nombre}</h4>
                          {hasPR && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[10px] font-bold">
                              🏆 PR
                            </span>
                          )}
                          {s.animo && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold">
                              {s.animo.emoji || '🔥'} {s.animo.label || s.animo}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                          {s.duracion_segundos > 0 && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {Math.round(s.duracion_segundos / 60)} min
                            </span>
                          )}
                          {vol > 0 && (
                            <span className="flex items-center gap-1 font-mono text-emerald-400 font-bold">
                              <Dumbbell className="w-3.5 h-3.5" />
                              {vol.toLocaleString('es-ES')} kg
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-slate-400 p-1">
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-sky-400" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>

                  {isExpanded && s.series && s.series.length > 0 && (
                    <div className="border-t border-slate-800 p-4 bg-slate-900/60 space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                        Series Registradas ({s.series.length}):
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {s.series.map((item, itIdx) => (
                          <div
                            key={itIdx}
                            className={`p-2 rounded-xl border text-xs font-mono flex items-center justify-between ${
                              item.es_pr ? 'bg-amber-950/20 border-amber-500/40 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-300'
                            }`}
                          >
                            <span className="truncate max-w-[120px] font-sans font-bold">{item.ejercicio?.nombre || item.nombre_ejercicio || `Serie #${item.numero_serie}`}</span>
                            <span className="font-bold shrink-0">{item.peso_kg}kg × {item.repeticiones}</span>
                          </div>
                        ))}
                      </div>
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
