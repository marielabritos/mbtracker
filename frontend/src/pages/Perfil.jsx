import React, { useState, useEffect } from 'react';
import { 
  User, Flame, Apple, Heart, Activity, Dumbbell, 
  Scale, Droplets, Sparkles, Check, Save, ChevronRight, Info, Award, Zap, Utensils, Lock, Key, LogOut, ShieldCheck 
} from 'lucide-react';

export default function Perfil({ onLogout }) {
  const [profile, setProfile] = useState({
    nombre: 'Mariela',
    sexo: 'femenino', // 'femenino' | 'masculino'
    edad: '28',
    peso_kg: '62',
    altura_cm: '165',
    nivel_actividad: 'moderado', // 'sedentario' | 'ligero' | 'moderado' | 'intenso'
    objetivo: 'hipertrofia', // 'definicion' | 'hipertrofia' | 'recomposicion' | 'mantenimiento'
    preferencia_dieta: 'equilibrada'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [selectedMealTab, setSelectedMealTab] = useState('desayuno');
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [pinSavedMsg, setPinSavedMsg] = useState(false);

  // Cargar perfil guardado de localStorage al montar
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mbtracker_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        setProfile({
          nombre: parsed.nombre || 'Mariela',
          sexo: parsed.sexo || 'femenino',
          edad: String(parsed.edad ?? '28'),
          peso_kg: String(parsed.peso_kg ?? '62'),
          altura_cm: String(parsed.altura_cm ?? '165'),
          nivel_actividad: parsed.nivel_actividad || 'moderado',
          objetivo: parsed.objetivo || 'hipertrofia',
          preferencia_dieta: parsed.preferencia_dieta || 'equilibrada'
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Guardar perfil permanentemente
  const handleSaveProfile = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      localStorage.setItem('mbtracker_user_profile', JSON.stringify(profile));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert("Error al guardar datos");
    }
  };

  // Actualizar campo de texto o número permitiendo escribir y borrar libremente
  const handleChange = (field, value) => {
    setProfile(prev => {
      const updated = { ...prev, [field]: value };
      // Auto-guardado en segundo plano
      try {
        localStorage.setItem('mbtracker_user_profile', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // --- CÁLCULOS METABÓLICOS Y NUTRICIONALES (Fórmula Mifflin-St Jeor) ---
  const peso = parseFloat(profile.peso_kg) || 60;
  const altura = parseFloat(profile.altura_cm) || 165;
  const edad = parseFloat(profile.edad) || 25;

  // 1. Tasa Metabólica Basal (TMB)
  let tmb = (10 * peso) + (6.25 * altura) - (5 * edad);
  if (profile.sexo === 'femenino') {
    tmb -= 161;
  } else {
    tmb += 5;
  }
  tmb = Math.max(Math.round(tmb), 1000);

  // 2. Gasto Energético Total Diario (TDEE) según nivel de actividad
  const factorActividad = {
    sedentario: 1.2,
    ligero: 1.375,
    moderado: 1.55,
    intenso: 1.725
  }[profile.nivel_actividad] || 1.55;

  const tdee = Math.round(tmb * factorActividad);

  // 3. Calorías Objetivo según la meta
  let caloriasObjetivo = tdee;
  if (profile.objetivo === 'definicion') {
    caloriasObjetivo = Math.round(tdee * 0.82); // Déficit del 18%
  } else if (profile.objetivo === 'hipertrofia') {
    caloriasObjetivo = Math.round(tdee * 1.12); // Superávit del 12%
  } else if (profile.objetivo === 'recomposicion') {
    caloriasObjetivo = Math.round(tdee * 0.95); // Ligero déficit / normocalórica
  }

  // 4. Macronutrientes Diarios
  const factorProteina = profile.objetivo === 'definicion' ? 2.2 : (profile.objetivo === 'hipertrofia' ? 2.0 : 1.8);
  const proteinaGramos = Math.round(peso * factorProteina);
  const proteinaCalorias = proteinaGramos * 4;

  const grasasGramos = Math.round(peso * 0.9);
  const grasasCalorias = grasasGramos * 9;

  const carbohidratosCalorias = Math.max(caloriasObjetivo - proteinaCalorias - grasasCalorias, 400);
  const carbohidratosGramos = Math.round(carbohidratosCalorias / 4);

  const aguaLitros = ((peso * 35) / 1000 + 0.6).toFixed(1);
  const imc = (peso / ((altura / 100) * (altura / 100))).toFixed(1);

  // Sugerencias de comidas adaptadas
  const mealSuggestions = {
    desayuno: {
      titulo: 'Desayuno Energético',
      hora: '07:30 - 09:00',
      opciones: [
        {
          nombre: 'Omelette Proteico con Tostadas',
          ingredientes: '2 huevos enteros + 2 claras, 2 rebanadas de pan integral o centeno, 1/4 de palta (aguacate) y café/té sin azúcar.',
          macros: `~380 kcal • ${Math.round(proteinaGramos * 0.25)}g Prot • 30g Carb • 14g Grasas`
        },
        {
          nombre: 'Bowl de Avena con Proteína y Frutas',
          ingredientes: '50g de avena en hojuelas, 1 scoop de proteína (o 150g de yogur griego), 1/2 banana en rodajas, canela y 10 almendras.',
          macros: `~410 kcal • ${Math.round(proteinaGramos * 0.28)}g Prot • 45g Carb • 11g Grasas`
        }
      ]
    },
    almuerzo: {
      titulo: 'Almuerzo Equilibrado',
      hora: '12:30 - 14:00',
      opciones: [
        {
          nombre: 'Pechuga de Pollo / Bife con Arroz y Vegetales',
          ingredientes: '150g de pechuga a la plancha (o lomo magro), 1 taza de arroz integral o papa al horno, ensalada mixta grande con 1 cucharada de aceite de oliva.',
          macros: `~520 kcal • ${Math.round(proteinaGramos * 0.35)}g Prot • 55g Carb • 15g Grasas`
        },
        {
          nombre: 'Filete de Pescado / Atún con Batata (Camote)',
          ingredientes: '180g de merluza, salmón o atún fresco, 150g de batata asada, brócoli y zanahorias al vapor con limón.',
          macros: `~480 kcal • ${Math.round(proteinaGramos * 0.32)}g Prot • 45g Carb • 12g Grasas`
        }
      ]
    },
    pre_entreno: {
      titulo: 'Pre-Entrenamiento (1h antes del Gym)',
      hora: 'Antes de entrenar',
      opciones: [
        {
          nombre: 'Energía Rápida para el Entrenamiento',
          ingredientes: '1 banana mediana + 1 cucharada pequeña de mantequilla de maní + café solo o agua.',
          macros: '~180 kcal • Energía de absorción progresiva para rendir al máximo.'
        },
        {
          nombre: 'Tostada Energética',
          ingredientes: '1 rebanada de pan integral con 1 cucharadita de miel o mermelada y 4 nueces.',
          macros: '~160 kcal • Glucógeno muscular listo para levantar peso.'
        }
      ]
    },
    post_entreno: {
      titulo: 'Post-Entrenamiento (Recuperación)',
      hora: 'Hasta 1h después del Gym',
      opciones: [
        {
          nombre: 'Batido o Snack de Síntesis Muscular',
          ingredientes: '1 vaso de agua o leche descremada con 1 scoop de proteína (o 1 pote de yogur griego) + 1 fruta (manzana o banana).',
          macros: `~220 kcal • ${Math.round(proteinaGramos * 0.22)}g Prot para reparar fibras musculares.`
        }
      ]
    },
    cena: {
      titulo: 'Cena Reparadora',
      hora: '20:30 - 22:00',
      opciones: [
        {
          nombre: 'Pollo / Huevos con Ensalada o Salteado de Verduras',
          ingredientes: '130g de pechuga de pollo, tofu o revuelto de 3 claras y 1 huevo, salteado de zapallitos, espinacas y champiñones con semillas de girasol.',
          macros: `~390 kcal • ${Math.round(proteinaGramos * 0.25)}g Prot • 18g Carb • 13g Grasas`
        }
      ]
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 space-y-6 pb-28">
      {/* Notificación de guardado */}
      {savedSuccess && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-2xl shadow-xl font-black text-sm flex items-center gap-2 animate-bounce">
          <Check className="w-5 h-5" />
          <span>¡Datos y plan nutricional guardados correctamente!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Nutrición & Biometría</span>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Mi Perfil Fitness</h2>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
          <User className="w-5 h-5" />
        </div>
      </div>

      {/* Tarjeta de Resumen Calórico y Macronutrientes */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-sky-950 p-5 sm:p-6 border border-sky-500/30 shadow-2xl space-y-5">
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-300">
              Objetivo: {profile.objetivo === 'hipertrofia' ? 'Ganancia Muscular' : profile.objetivo === 'definicion' ? 'Pérdida de Grasa' : 'Recomposición'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
              {caloriasObjetivo} <span className="text-base font-bold text-sky-400">kcal / día</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Gasto metabólico basal: {tmb} kcal • Gasto total diario estimado: {tdee} kcal
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-bold text-emerald-400">
              IMC: {imc}
            </span>
            <span className="px-3 py-1 rounded-xl bg-sky-500/15 border border-sky-500/30 text-xs font-bold text-sky-300 flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-sky-400" />
              {aguaLitros} L agua
            </span>
          </div>
        </div>

        {/* Barra de Distribución de Macros */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          {/* Proteínas */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 text-center space-y-1">
            <span className="text-[11px] font-bold text-rose-400 block uppercase tracking-wider">Proteínas</span>
            <span className="text-xl sm:text-2xl font-black text-white font-mono">{proteinaGramos}g</span>
            <span className="text-[10px] text-slate-500 block font-medium">({Math.round((proteinaCalorias / caloriasObjetivo) * 100)}% de calorías)</span>
          </div>

          {/* Carbohidratos */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 text-center space-y-1">
            <span className="text-[11px] font-bold text-amber-400 block uppercase tracking-wider">Carbos</span>
            <span className="text-xl sm:text-2xl font-black text-white font-mono">{carbohidratosGramos}g</span>
            <span className="text-[10px] text-slate-500 block font-medium">({Math.round((carbohidratosCalorias / caloriasObjetivo) * 100)}% de calorías)</span>
          </div>

          {/* Grasas */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 text-center space-y-1">
            <span className="text-[11px] font-bold text-sky-400 block uppercase tracking-wider">Grasas</span>
            <span className="text-xl sm:text-2xl font-black text-white font-mono">{grasasGramos}g</span>
            <span className="text-[10px] text-slate-500 block font-medium">({Math.round((grasasCalorias / caloriasObjetivo) * 100)}% de calorías)</span>
          </div>
        </div>
      </div>

      {/* Formulario de Datos Personales Totalmente Editable */}
      <form onSubmit={handleSaveProfile} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-sky-400" />
            Mis Datos Personales
          </h3>
          <span className="text-[11px] text-slate-400">Edita y se guarda automáticamente</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {/* Nombre */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Nombre</label>
            <input
              type="text"
              value={profile.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              placeholder="Tu nombre..."
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500 font-bold"
            />
          </div>

          {/* Sexo */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Sexo Biológico</label>
            <select
              value={profile.sexo}
              onChange={(e) => handleChange('sexo', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
            >
              <option value="femenino">Femenino</option>
              <option value="masculino">Masculino</option>
            </select>
          </div>

          {/* Edad */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Edad (años)</label>
            <input
              type="text"
              inputMode="numeric"
              value={profile.edad}
              onChange={(e) => handleChange('edad', e.target.value)}
              placeholder="Ej. 28"
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500 font-mono font-bold"
            />
          </div>

          {/* Peso */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Peso Actual (kg)</label>
            <input
              type="text"
              inputMode="decimal"
              value={profile.peso_kg}
              onChange={(e) => handleChange('peso_kg', e.target.value)}
              placeholder="Ej. 62.5"
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500 font-mono font-black text-sky-400"
            />
          </div>

          {/* Altura */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Altura (cm)</label>
            <input
              type="text"
              inputMode="numeric"
              value={profile.altura_cm}
              onChange={(e) => handleChange('altura_cm', e.target.value)}
              placeholder="Ej. 165"
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500 font-mono font-bold"
            />
          </div>

          {/* Nivel de Actividad */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Actividad Física</label>
            <select
              value={profile.nivel_actividad}
              onChange={(e) => handleChange('nivel_actividad', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
            >
              <option value="sedentario">Sedentario (Poco o nada)</option>
              <option value="ligero">Ligero (1-2 días/sem)</option>
              <option value="moderado">Moderado (3-5 días gym)</option>
              <option value="intenso">Intenso (6-7 días gym)</option>
            </select>
          </div>
        </div>

        {/* Objetivo Principal */}
        <div className="pt-2">
          <label className="text-xs font-bold text-slate-300 block mb-1">Objetivo Fitness Principal</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'hipertrofia', title: '💪 Ganancia Muscular', desc: 'Superávit limpio para fuerza y masa muscular' },
              { id: 'definicion', title: '🔥 Definición / Grasa', desc: 'Déficit calórico moderado protegiendo el músculo' },
              { id: 'recomposicion', title: '⚡ Recomposición', desc: 'Tonificar y quemar grasa al mismo tiempo' }
            ].map((obj) => (
              <div
                key={obj.id}
                onClick={() => handleChange('objetivo', obj.id)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                  profile.objetivo === obj.id
                    ? 'bg-sky-500/20 border-sky-400 text-white shadow-lg'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="font-bold text-xs sm:text-sm block">{obj.title}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{obj.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <Save className="w-4 h-4 fill-current" />
            Guardar Cambios
          </button>
        </div>
      </form>

      {/* Sugerencias de Alimentación Diaria */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Utensils className="w-5 h-5 text-emerald-400" />
              Sugerencias de Alimentación Diaria
            </h3>
            <p className="text-xs text-slate-400">Guía práctica adaptada a tu objetivo de {profile.objetivo}</p>
          </div>
        </div>

        {/* Tabs de Comidas */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'desayuno', label: '🌅 Desayuno' },
            { id: 'almuerzo', label: '🥗 Almuerzo' },
            { id: 'pre_entreno', label: '⚡ Pre-Gym' },
            { id: 'post_entreno', label: '💪 Post-Gym' },
            { id: 'cena', label: '🌙 Cena' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedMealTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedMealTab === tab.id
                  ? 'bg-sky-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenido de la comida seleccionada */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="font-bold text-sm text-white">{mealSuggestions[selectedMealTab]?.titulo}</h4>
            <span className="text-[11px] text-slate-500 font-mono font-medium">{mealSuggestions[selectedMealTab]?.hora}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mealSuggestions[selectedMealTab]?.opciones.map((op, idx) => (
              <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="font-bold text-xs text-emerald-400 block">Opción {idx + 1}: {op.nombre}</span>
                <p className="text-xs text-slate-300 leading-relaxed">{op.ingredientes}</p>
                <div className="pt-1 border-t border-slate-800/60 text-[11px] font-mono text-sky-400 font-medium">
                  {op.macros}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seguridad & Clave de Acceso */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-sky-400" />
              Seguridad y Control de Acceso
            </h3>
            <p className="text-xs text-slate-400">Protege tu MBTracker para que solo tú puedas ingresar</p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!currentPinInput.trim()) return;
            localStorage.setItem('mbtracker_auth_pin', currentPinInput.trim());
            setPinSavedMsg(true);
            setTimeout(() => setPinSavedMsg(false), 3000);
          }}
          className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3"
        >
          <label className="text-xs font-bold text-slate-300 block">
            Cambiar Contraseña o PIN de Acceso
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={currentPinInput}
              onChange={(e) => setCurrentPinInput(e.target.value)}
              placeholder="Nueva clave (ej. mariela123 o 1234)"
              className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-sky-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs shadow-md"
            >
              Guardar Nueva Clave
            </button>
          </div>

          {pinSavedMsg && (
            <p className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              ¡Clave de acceso actualizada correctamente!
            </p>
          )}
        </form>

        {onLogout && (
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={onLogout}
              className="px-5 py-3 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 text-xs font-black flex items-center gap-2 transition-all active:scale-95 shadow-md shadow-rose-500/10"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión / Bloquear Acceso</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
