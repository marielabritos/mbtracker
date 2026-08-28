import React, { useState, useEffect } from 'react';
import { TrendingUp, Trophy, Dumbbell, Award, Calendar, Activity, MapPin, Mountain, Flame, Compass } from 'lucide-react';
import { api } from '../services/api';

export default function Progreso() {
  const [stats, setStats] = useState(null);
  const [ejercicios, setEjercicios] = useState([]);
  const [selectedEjercicioId, setSelectedEjercicioId] = useState('');
  const [progresoData, setProgresoData] = useState([]);
  const [outdoorStats, setOutdoorStats] = useState({
    runningKm: 0,
    runningSecs: 0,
    ciclismoKm: 0,
    ciclismoSecs: 0,
    montanismoDesnivel: 0,
    montanismoKm: 0,
    totalCalories: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitial();
  }, []);

  const loadInitial = async () => {
    try {
      setLoading(true);
      const [statsData, ejsData, sesionesData] = await Promise.all([
        api.getDashboardStats().catch(() => null),
        api.getEjercicios().catch(() => []),
        api.getSesiones(100).catch(() => [])
      ]);
      setStats(statsData);
      setEjercicios(ejsData);

      // Calcular acumulados de deportes al aire libre
      let rKm = 0, rSecs = 0, cKm = 0, cSecs = 0, mDesn = 0, mKm = 0, totCal = 0;
      (sesionesData || []).forEach(s => {
        const d = s.deporte;
        const km = parseFloat(s.distancia_km) || 0;
        const dur = parseInt(s.duracion_segundos) || 0;
        const desn = parseFloat(s.desnivel_positivo_m) || 0;
        const cal = parseInt(s.calorias_quemadas) || 0;

        totCal += cal;
        if (d === 'running') {
          rKm += km;
          rSecs += dur;
        } else if (d === 'ciclismo') {
          cKm += km;
          cSecs += dur;
        } else if (d === 'montanismo') {
          mDesn += desn;
          mKm += km;
        }
      });

      setOutdoorStats({
        runningKm: rKm.toFixed(1),
        runningSecs: rSecs,
        ciclismoKm: cKm.toFixed(1),
        ciclismoSecs: cSecs,
        montanismoDesnivel: mDesn,
        montanismoKm: mKm.toFixed(1),
        totalCalories: totCal
      });

      if (ejsData.length > 0) {
        setSelectedEjercicioId(ejsData[0].id);
        loadChartData(ejsData[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadChartData = async (ejId) => {
    try {
      const data = await api.getProgresoEjercicio(ejId);
      setProgresoData(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectEjercicio = (ejId) => {
    setSelectedEjercicioId(ejId);
    loadChartData(ejId);
  };

  const currentEjercicio = ejercicios.find((e) => e.id === parseInt(selectedEjercicioId));

  // Renderizador de gráfico SVG personalizado
  const renderChart = () => {
    if (!progresoData || progresoData.length === 0) {
      return (
        <div className="h-64 flex flex-col items-center justify-center text-slate-500 space-y-2">
          <Activity className="w-8 h-8 text-slate-600" />
          <p className="text-sm">Aún no hay registros suficientes para este ejercicio.</p>
          <span className="text-xs text-slate-600">Completa sesiones para ver tu curva de fuerza aquí.</span>
        </div>
      );
    }

    if (progresoData.length === 1) {
      const p = progresoData[0];
      return (
        <div className="h-64 flex flex-col items-center justify-center text-slate-300 space-y-3 bg-slate-950/40 rounded-2xl p-6">
          <Trophy className="w-10 h-10 text-amber-400" />
          <div className="text-center">
            <span className="text-xs text-slate-400 block">{p.fecha}</span>
            <span className="text-3xl font-black text-white font-mono">{p.peso_max} kg</span>
            <span className="text-xs text-slate-400 block mt-1">× {p.reps_en_peso_max} reps • 1RM Est: {p['1rm_estimado']} kg</span>
          </div>
          <span className="text-xs text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
            ¡Registra más sesiones para ver tu línea de progreso!
          </span>
        </div>
      );
    }

    const width = 600;
    const height = 240;
    const padding = 40;

    const weights = progresoData.map((d) => d.peso_max);
    const minWeight = Math.max(0, Math.min(...weights) - 5);
    const maxWeight = Math.max(...weights) + 5;
    const weightRange = maxWeight - minWeight || 1;

    const points = progresoData.map((d, index) => {
      const x = padding + (index / (progresoData.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((d.peso_max - minWeight) / weightRange) * (height - 2 * padding);
      return { x, y, data: d };
    });

    const pathData = points.reduce((acc, point, index) => {
      return index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
    }, '');

    // Area path for gradient
    const areaData = `${pathData} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

    return (
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[320px]">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#334155" strokeDasharray="3 3" opacity="0.6" />

          {/* Area */}
          <path d={areaData} fill="url(#chartGradient)" />

          {/* Line */}
          <path d={pathData} fill="none" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Points */}
          {points.map((pt, i) => (
            <g key={i} className="group cursor-pointer">
              <circle cx={pt.x} cy={pt.y} r="5" fill="#0F172A" stroke="#38BDF8" strokeWidth="3" />
              <text
                x={pt.x}
                y={pt.y - 12}
                textAnchor="middle"
                fill="#F8FAFC"
                fontSize="11"
                fontWeight="bold"
                className="font-mono"
              >
                {pt.data.peso_max}kg
              </text>
              <text
                x={pt.x}
                y={height - 15}
                textAnchor="middle"
                fill="#64748B"
                fontSize="10"
                className="font-mono"
              >
                {pt.data.fecha.slice(0, 5)}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-28">
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Progreso y Récords</h2>
        <p className="text-sm text-slate-400">Visualiza tu sobrecarga progresiva y evolución de fuerza</p>
      </div>

      {/* Gráfico de Evolución de Fuerza */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="font-bold text-white text-base">Evolución de Carga Máxima</h3>
              <span className="text-xs text-slate-400">Peso máximo levantado por sesión</span>
            </div>
          </div>

          <select
            value={selectedEjercicioId}
            onChange={(e) => handleSelectEjercicio(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-white rounded-2xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:border-sky-500"
          >
            {ejercicios.map((ej) => (
              <option key={ej.id} value={ej.id}>
                {ej.nombre} ({ej.grupo_muscular})
              </option>
            ))}
          </select>
        </div>

        {/* Resumen actual del ejercicio seleccionado */}
        {currentEjercicio && progresoData.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:gap-4 p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Máximo Actual</span>
              <span className="text-lg sm:text-2xl font-black text-sky-400 font-mono">
                {Math.max(...progresoData.map((d) => d.peso_max))} kg
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">1RM Estimado</span>
              <span className="text-lg sm:text-2xl font-black text-emerald-400 font-mono">
                {Math.max(...progresoData.map((d) => d['1rm_estimado'] || 0))} kg
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Sesiones Totales</span>
              <span className="text-lg sm:text-2xl font-black text-white font-mono">
                {progresoData.length}
              </span>
            </div>
          </div>
        )}

        {/* Gráfico */}
        {renderChart()}
      </div>

      {/* SECCIÓN NUEVA: 🏃 PROGRESO EN DEPORTES Y AIRE LIBRE */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏃</span>
            <h3 className="font-bold text-lg text-white">Deportes al Aire Libre & Cardio</h3>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            Acumulados Históricos
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Running */}
          <div className="bg-slate-900/90 border border-sky-500/30 rounded-3xl p-5 space-y-2 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-sky-400">🏃 Running / Carrera</span>
              <MapPin className="w-4 h-4 text-sky-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-white font-mono">{outdoorStats.runningKm}</span>
              <span className="text-xs text-slate-400 font-bold">km totales</span>
            </div>
            <span className="text-[11px] text-slate-400 block font-mono">
              Tiempo: {Math.round(outdoorStats.runningSecs / 60)} min acumulados
            </span>
          </div>

          {/* Ciclismo */}
          <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-5 space-y-2 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-emerald-400">🚴 Bicicleta / Ciclismo</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-white font-mono">{outdoorStats.ciclismoKm}</span>
              <span className="text-xs text-slate-400 font-bold">km pedaleados</span>
            </div>
            <span className="text-[11px] text-slate-400 block font-mono">
              Tiempo: {Math.round(outdoorStats.ciclismoSecs / 60)} min acumulados
            </span>
          </div>

          {/* Montañismo */}
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-5 space-y-2 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-amber-400">⛰️ Montañismo & Trekking</span>
              <Mountain className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-amber-400 font-mono">+{outdoorStats.montanismoDesnivel}</span>
              <span className="text-xs text-slate-400 font-bold">m desnivel (+D)</span>
            </div>
            <span className="text-[11px] text-slate-400 block font-mono">
              Distancia recorrida: {outdoorStats.montanismoKm} km
            </span>
          </div>
        </div>
      </div>

      {/* Galería de Récords Personales (PRs) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-lg text-white">Muro de Récords Personales</h3>
        </div>

        {stats?.ultimos_prs && stats.ultimos_prs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {stats.ultimos_prs.map((pr) => (
              <div
                key={pr.ejercicio_id}
                onClick={() => handleSelectEjercicio(pr.ejercicio_id)}
                className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 transition-all cursor-pointer group shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    {pr.grupo_muscular}
                  </span>
                  <Award className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                </div>
                <h4 className="font-bold text-white text-sm mt-1 truncate" title={pr.ejercicio_nombre}>
                  {pr.ejercicio_nombre}
                </h4>
                <div className="mt-3 flex items-baseline justify-between border-t border-slate-800/80 pt-2">
                  <span className="text-2xl font-black text-amber-400 font-mono">
                    {pr.peso_maximo_kg} kg
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {pr.repeticiones} reps
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center text-slate-400">
            <p className="text-sm">Completa entrenamientos para ver tus mejores marcas aquí.</p>
          </div>
        )}
      </div>
    </div>
  );
}
