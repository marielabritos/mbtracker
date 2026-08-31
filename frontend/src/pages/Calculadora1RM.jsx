import React, { useState, useEffect } from 'react';
import { 
  Zap, Trophy, Dumbbell, Award, TrendingUp, Save, Trash2, Plus, 
  Sparkles, CheckCircle2, History, ChevronRight, HelpCircle, Flame, Shield, ArrowUpRight 
} from 'lucide-react';
import { api } from '../services/api';

const DEFAULT_KEY_EXERCISES = [
  { id: 1, nombre: "Press de Banca Plano con Barra", grupo_muscular: "Pecho", ratio_intermedio: 0.85, ratio_avanzado: 1.25, ratio_elite: 1.6 },
  { id: 11, nombre: "Sentadilla con Barra (Back Squat)", grupo_muscular: "Piernas", ratio_intermedio: 1.25, ratio_avanzado: 1.75, ratio_elite: 2.2 },
  { id: 13, nombre: "Peso Muerto Rumano (RDL)", grupo_muscular: "Piernas", ratio_intermedio: 1.4, ratio_avanzado: 2.0, ratio_elite: 2.5 },
  { id: 17, nombre: "Hip Thrust con Barra", grupo_muscular: "Piernas", ratio_intermedio: 1.6, ratio_avanzado: 2.3, ratio_elite: 3.0 },
  { id: 18, nombre: "Press Militar con Barra / Mancuernas", grupo_muscular: "Hombros", ratio_intermedio: 0.55, ratio_avanzado: 0.8, ratio_elite: 1.05 },
  { id: 6, nombre: "Jalón al Pecho en Polea", grupo_muscular: "Espalda", ratio_intermedio: 0.8, ratio_avanzado: 1.15, ratio_elite: 1.5 },
  { id: 8, nombre: "Remo con Barra", grupo_muscular: "Espalda", ratio_intermedio: 0.75, ratio_avanzado: 1.1, ratio_elite: 1.45 },
  { id: 21, nombre: "Curl de Bíceps con Barra Z", grupo_muscular: "Brazos", ratio_intermedio: 0.45, ratio_avanzado: 0.65, ratio_elite: 0.85 },
];

export default function Calculadora1RM() {
  const [userWeight, setUserWeight] = useState(62);
  const [ejercicios, setEjercicios] = useState(DEFAULT_KEY_EXERCISES);
  const [selectedExName, setSelectedExName] = useState(DEFAULT_KEY_EXERCISES[0].nombre);
  const [pesoInput, setPesoInput] = useState(50);
  const [repsInput, setRepsInput] = useState(5);
  const [testHistory, setTestHistory] = useState([]);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const ejs = await api.getEjercicios();
      if (ejs && ejs.length > 0) {
        setEjercicios(ejs);
      }

      // Cargar peso del perfil
      const profile = JSON.parse(localStorage.getItem('mbtracker_user_profile') || '{}');
      if (profile.peso) {
        setUserWeight(parseFloat(profile.peso) || 62);
      }

      // Cargar historial de tests 1RM
      const savedTests = JSON.parse(localStorage.getItem('mbtracker_1rm_tests') || '[]');
      setTestHistory(savedTests);
    } catch (e) {
      console.error(e);
    }
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Fórmulas de cálculo de 1RM
  const calculate1RM = (weight, reps) => {
    const w = parseFloat(String(weight).replace(',', '.')) || 0;
    const r = parseInt(reps) || 1;
    if (w <= 0 || r <= 0) return { epley: 0, brzycki: 0, lombardi: 0, promedio: 0 };
    if (r === 1) return { epley: w, brzycki: w, lombardi: w, promedio: w };

    const epley = w * (1 + r / 30);
    const brzycki = w * (36 / (37 - r));
    const lombardi = w * Math.pow(r, 0.10);
    const promedio = Math.round(((epley + brzycki + lombardi) / 3) * 10) / 10;

    return {
      epley: Math.round(epley * 10) / 10,
      brzycki: Math.round(brzycki * 10) / 10,
      lombardi: Math.round(lombardi * 10) / 10,
      promedio
    };
  };

  const rmResults = calculate1RM(pesoInput, repsInput);
  const estimated1RM = rmResults.promedio;

  // Tabla de porcentajes y repeticiones estimadas
  const PERCENTAGES = [
    { pct: 100, reps: '1 rep', desc: 'Fuerza Máxima Absoluta (1RM)', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    { pct: 95, reps: '2 reps', desc: 'Fuerza Pura', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
    { pct: 90, reps: '3-4 reps', desc: 'Fuerza Pesada', color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' },
    { pct: 85, reps: '5-6 reps', desc: 'Fuerza / Hipertrofia Efectiva', color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' },
    { pct: 80, reps: '7-8 reps', desc: 'Hipertrofia Clásica', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { pct: 75, reps: '9-10 reps', desc: 'Hipertrofia y Volumen', color: 'text-teal-400 bg-teal-500/10 border-teal-500/30' },
    { pct: 70, reps: '11-12 reps', desc: 'Resistencia a la Fuerza', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' },
    { pct: 65, reps: '15 reps', desc: 'Resistencia Muscular', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
    { pct: 50, reps: '20+ reps', desc: 'Calentamiento & Técnica', color: 'text-slate-400 bg-slate-800/40 border-slate-700' },
  ];

  // Nivel de Fuerza según ratio Peso Levantado / Peso Corporal
  const getStrengthLevel = () => {
    if (!estimated1RM || !userWeight) return { level: 'Principiante', color: 'text-sky-400', badge: 'bg-sky-500/10 border-sky-500/30' };
    const ratio = estimated1RM / userWeight;
    
    if (ratio >= 2.0) return { level: 'Élite / Atleta', color: 'text-amber-300', badge: 'bg-amber-500/20 border-amber-500/50', ratio: ratio.toFixed(2) };
    if (ratio >= 1.4) return { level: 'Avanzado', color: 'text-emerald-400', badge: 'bg-emerald-500/20 border-emerald-500/40', ratio: ratio.toFixed(2) };
    if (ratio >= 0.9) return { level: 'Intermedio', color: 'text-sky-400', badge: 'bg-sky-500/20 border-sky-500/40', ratio: ratio.toFixed(2) };
    return { level: 'Iniciación / Base', color: 'text-slate-300', badge: 'bg-slate-800 border-slate-700', ratio: ratio.toFixed(2) };
  };

  const strengthLevel = getStrengthLevel();

  // Guardar Test de 1RM
  const handleSaveTest = () => {
    if (estimated1RM <= 0) return alert("Por favor ingresa un peso y repeticiones válidos.");

    const newTest = {
      id: Date.now(),
      fecha: new Date().toISOString(),
      ejercicio: selectedExName,
      peso: parseFloat(String(pesoInput).replace(',', '.')) || 0,
      reps: parseInt(repsInput),
      rm_estimado: estimated1RM,
      nivel: strengthLevel.level
    };

    const updated = [newTest, ...testHistory];
    setTestHistory(updated);
    localStorage.setItem('mbtracker_1rm_tests', JSON.stringify(updated));
    showToast(`✓ Test de 1RM guardado (${estimated1RM} kg en ${selectedExName})`);
  };

  const handleDeleteTest = (testId) => {
    const filtered = testHistory.filter(t => t.id !== testId);
    setTestHistory(filtered);
    localStorage.setItem('mbtracker_1rm_tests', JSON.stringify(filtered));
    showToast("Test eliminado del historial");
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 space-y-6 pb-28 font-sans">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-slate-950 font-black px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs sm:text-sm animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 stroke-[3]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Principal */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xl">
            🎯
          </span>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Medidor de Fuerza Máxima & 1RM</h2>
            <p className="text-xs sm:text-sm text-slate-400">Calcula tus RPMs (Repetición Máxima), zonas de intensidad y prueba tu nivel de fuerza</p>
          </div>
        </div>
      </div>

      {/* Grid Principal: Calculadora + Tarjeta de 1RM Resultante */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Panel de Inputs */}
        <div className="md:col-span-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <Dumbbell className="w-4 h-4 text-sky-400" />
              Datos del Levantamiento
            </span>
            <span className="text-[11px] font-bold text-slate-500">Fórmulas Epley / Brzycki</span>
          </div>

          {/* Selector de Ejercicio */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Ejercicio a Evaluar</label>
            <select
              value={selectedExName}
              onChange={(e) => setSelectedExName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-bold focus:outline-none focus:border-sky-500"
            >
              {ejercicios.map((ej) => (
                <option key={ej.id || ej.nombre} value={ej.nombre} className="bg-slate-900 text-white">
                  {ej.nombre} ({ej.grupo_muscular || 'Fuerza'})
                </option>
              ))}
            </select>
          </div>

          {/* Peso Levantado */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-300">Peso Levantado</label>
              <span className="text-sky-400 font-mono font-bold text-sm">{pesoInput} kg</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                inputMode="decimal"
                value={pesoInput}
                onChange={(e) => setPesoInput(e.target.value.replace(',', '.'))}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-lg text-white font-black font-mono focus:outline-none focus:border-sky-500"
              />
              <div className="flex gap-1">
                {[+2.5, +5, +10].map(add => (
                  <button
                    key={add}
                    type="button"
                    onClick={() => setPesoInput(prev => Math.max(1, (parseFloat(prev) || 0) + add))}
                    className="px-2.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl active:scale-95"
                  >
                    +{add}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Repeticiones Realizadas */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-300">Repeticiones Logradas (Reps)</label>
              <span className="text-emerald-400 font-mono font-bold text-sm">{repsInput} reps</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="15"
                value={repsInput}
                onChange={(e) => setRepsInput(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-lg text-white font-black font-mono focus:outline-none focus:border-sky-500"
              />
              <div className="grid grid-cols-4 gap-1">
                {[1, 3, 5, 8, 10, 12].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRepsInput(r)}
                    className={`px-2 py-1.5 text-xs font-bold rounded-xl transition-all ${
                      parseInt(repsInput) === r 
                        ? 'bg-sky-500 text-slate-950 font-black' 
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <span className="text-[11px] text-slate-500 block">
              * Para mayor precisión se recomiendan entre 1 y 8 repeticiones al fallo o RPE 9-10.
            </span>
          </div>

          {/* Botón Guardar Test */}
          <button
            type="button"
            onClick={handleSaveTest}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-all"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>Guardar Test en Mi Historial de Fuerza</span>
          </button>
        </div>

        {/* Panel de 1RM Estimado & Nivel de Fuerza */}
        <div className="md:col-span-6 space-y-4">
          {/* Card Gigante de 1RM */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-amber-950/30 border border-amber-500/30 rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 translate-x-4 -translate-y-4 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                <Trophy className="w-4 h-4" />
                Tu 1RM Máximo Estimado
              </span>
              <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-black ${strengthLevel.badge} ${strengthLevel.color}`}>
                Nivel: {strengthLevel.level}
              </span>
            </div>

            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-5xl sm:text-6xl font-black text-white font-mono tracking-tight">
                {estimated1RM}
              </span>
              <span className="text-xl sm:text-2xl font-black text-amber-400">kg</span>
            </div>

            <p className="text-xs text-slate-300 font-medium">
              Con este resultado, tu fuerza máxima estimada a <strong className="text-white">1 sola repetición</strong> en <span className="text-sky-400">{selectedExName}</span> es de <strong className="text-amber-400">{estimated1RM} kg</strong>.
            </p>

            {/* Comparación de Fórmulas */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-[10px] font-bold text-slate-400 block">Epley</span>
                <span className="text-sm font-black text-white font-mono">{rmResults.epley} kg</span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-[10px] font-bold text-slate-400 block">Brzycki</span>
                <span className="text-sm font-black text-white font-mono">{rmResults.brzycki} kg</span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-[10px] font-bold text-slate-400 block">Lombardi</span>
                <span className="text-sm font-black text-white font-mono">{rmResults.lombardi} kg</span>
              </div>
            </div>

            {/* Ratio relativo con el peso corporal */}
            {userWeight > 0 && (
              <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                <span>Fuerza Relativa (1RM / {userWeight}kg):</span>
                <span className="font-mono font-bold text-white text-sm">
                  {(estimated1RM / userWeight).toFixed(2)}x peso corporal
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabla de Porcentajes de Carga y Repeticiones Objetivo (% 1RM) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-base sm:text-lg text-white">Tabla de Porcentajes de Carga (%1RM)</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Basado en 1RM = {estimated1RM} kg</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {PERCENTAGES.map((row) => {
            const pesoKg = Math.round((estimated1RM * (row.pct / 100)) * 2) / 2; // redondear a 0.5 kg
            return (
              <div
                key={row.pct}
                className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 hover:border-slate-700 transition-all"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md border text-[11px] font-black ${row.color}`}>
                      {row.pct}%
                    </span>
                    <span className="text-xs font-bold text-slate-300 font-mono">{row.reps}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block truncate">{row.desc}</span>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-lg font-black text-white font-mono block">{pesoKg}</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">kg</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historial de Tests de Fuerza Guardados */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base sm:text-lg text-white">Historial de Tests de Fuerza (RPMs)</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">{testHistory.length} tests registrados</span>
        </div>

        {testHistory.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/40 rounded-2xl border border-slate-800/60 space-y-2">
            <Shield className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-slate-300">Aún no has guardado tests de fuerza</p>
            <p className="text-xs text-slate-500">Realiza un cálculo arriba y presiona "Guardar Test" para monitorear tu evolución de fuerza máxima.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {testHistory.map((test) => {
              const fecha = new Date(test.fecha);
              return (
                <div
                  key={test.id}
                  className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-md"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-white text-sm truncate">{test.ejercicio}</h4>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-black text-amber-400">
                        {test.nivel || 'Test'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                      <span>{fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span>• Levantado: {test.peso} kg × {test.reps} reps</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-xl font-black text-amber-400 font-mono">{test.rm_estimado} kg</span>
                      <span className="text-[10px] text-slate-400 block font-bold">1RM</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteTest(test.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Eliminar registro de test"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
