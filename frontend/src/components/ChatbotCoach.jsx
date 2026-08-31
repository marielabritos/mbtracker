import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Sparkles, Send, X, Bot, User, Flame, 
  Dumbbell, Heart, Play, Shield, Activity, RefreshCw, ChevronRight, Zap, Award
} from 'lucide-react';
import { api } from '../services/api';

const MOOD_OPTIONS = [
  { emoji: '🔥', label: 'A tope / Excelente', nivel: 5, color: 'text-amber-400 border-amber-500/40 bg-amber-500/15', desc: 'Con ganas de romper récords y máxima energía' },
  { emoji: '⚡', label: 'Buena Energía', nivel: 4, color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/15', desc: 'Enfocada, motivada y lista para dar el 100%' },
  { emoji: '😊', label: 'Normal / Bien', nivel: 3, color: 'text-sky-400 border-sky-500/40 bg-sky-500/15', desc: 'Cumpliendo la disciplina del plan con constancia' },
  { emoji: '😴', label: 'Cansada / Fatiga', nivel: 2, color: 'text-indigo-300 border-indigo-500/40 bg-indigo-500/15', desc: 'Poco descanso hoy, sesión controlada' },
  { emoji: '🧘', label: 'Estresada / Desconectar', nivel: 1, color: 'text-purple-300 border-purple-500/40 bg-purple-500/15', desc: 'El gym es mi terapia para liberar la mente' },
];

const MOLESTIAS_OPTIONS = [
  { id: 'ninguna', label: '✅ Ninguna, 100% lista', consejo: '¡Perfecto! Calienta 5 minutos de forma general y busca sobrecarga progresiva.' },
  { id: 'rodilla', label: '🦵 Molestia en Rodilla', consejo: 'Te recomiendo 3 min de Wall Sit isométrico y TKE con banda antes de la prensa. Evita bloqueos bruscos.' },
  { id: 'tobillo', label: '🦶 Molestia en Tobillo', consejo: 'Haz 2 series de dorsiflexión en pared antes de cargar peso en piernas.' },
  { id: 'lumbar', label: '💥 Fatiga en Lumbar / Espalda', consejo: 'Haz gato-camello y mantén el abdomen muy compacto en cada repetición. Evita cargas extremas.' },
  { id: 'hombro', label: '🛡️ Hombro cargado', consejo: 'Haz dislocaciones con banda elástica y pájaros ligeros para lubricar el manguito rotador.' },
];

const SUGGESTED_QUESTIONS = [
  "¿Cómo cuidar mis rodillas en prensa y sentadilla?",
  "¿Qué comer antes y después de entrenar glúteos?",
  "¿Cómo saber si debo subir de peso en una serie?",
  "¿Es bueno entrenar si tengo poco ánimo o energía?",
  "¿Cuál es la técnica ideal en Hip Thrust?"
];

export default function ChatbotCoach({ isOpen, onClose, onStartWorkout }) {
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [rutinas, setRutinas] = useState([]);
  
  // Estado del Check-In actual
  const [checkinState, setCheckinState] = useState({
    rutinaSeleccionada: null,
    diaSeleccionado: null,
    animo: null,
    molestia: null,
    completado: false
  });

  const chatEndRef = useRef(null);

  useEffect(() => {
    loadRutinas();
    if (messages.length === 0) {
      initWelcomeConversation();
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const loadRutinas = async () => {
    try {
      const data = await api.getRutinas();
      setRutinas(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const initWelcomeConversation = () => {
    setMessages([
      {
        id: 1,
        sender: 'bot',
        text: '¡Hola Mariela! 👋 Soy tu Coach Virtual de MBTracker. ¿Lista para entrenar hoy?\n\nCuéntame, ¿qué rutina o grupo muscular tienes pensado hacer en esta sesión?',
        type: 'step_rutina'
      }
    ]);
  };

  // Manejador del paso 1: Seleccionar Rutina / Día
  const handleSelectRutina = (rutina, dia) => {
    setCheckinState(prev => ({
      ...prev,
      rutinaSeleccionada: rutina,
      diaSeleccionado: dia || rutina.dias?.[0]
    }));

    const rutinaNombre = dia ? `${rutina.nombre} (${dia.nombre})` : rutina.nombre;

    setMessages(prev => [
      ...prev,
      { id: Date.now(), sender: 'user', text: `Voy a entrenar: ${rutinaNombre}` },
      {
        id: Date.now() + 1,
        sender: 'bot',
        text: `¡Excelente elección! 💥 ${rutinaNombre} es una gran sesión.\n\nAhora dime, ¿cómo sientes tu nivel de energía y ánimo en este momento? Esto quedará registrado en tu historial para medir tu progreso de bienestar.`,
        type: 'step_animo'
      }
    ]);
  };

  // Manejador del paso 2: Seleccionar Ánimo
  const handleSelectMood = (mood) => {
    setCheckinState(prev => ({ ...prev, animo: mood }));

    setMessages(prev => [
      ...prev,
      { id: Date.now(), sender: 'user', text: `${mood.emoji} Mi ánimo hoy: ${mood.label} (${mood.nivel}/5)` },
      {
        id: Date.now() + 1,
        sender: 'bot',
        text: `Registrado: Nivel de energía ${mood.nivel}/5. ${mood.desc}.\n\n¿Tienes alguna molestia muscular o articular que debamos tener en cuenta hoy?`,
        type: 'step_molestia'
      }
    ]);
  };

  // Manejador del paso 3: Seleccionar Molestia / Estado físico
  const handleSelectMolestia = (mol) => {
    const finalState = {
      ...checkinState,
      molestia: mol,
      completado: true
    };
    setCheckinState(finalState);

    let consejoExtra = mol.consejo;
    if (checkinState.animo?.nivel <= 2) {
      consejoExtra += " 💡 Hoy la victoria es la constancia: no te obsesiones con pesos máximos, concéntrate en buenas repeticiones controladas y descansos de 90-120s.";
    } else if (checkinState.animo?.nivel === 5) {
      consejoExtra += " 🔥 ¡Aprovecha esa energía a tope para buscar sobrecarga progresiva en tus series principales!";
    }

    setMessages(prev => [
      ...prev,
      { id: Date.now(), sender: 'user', text: mol.label },
      {
        id: Date.now() + 1,
        sender: 'bot',
        text: `¡Todo listo para arrancar, Mariela! 🎯\n\n📝 **Recomendación de tu Coach:**\n${consejoExtra}\n\nTu estado de ánimo (${finalState.animo?.emoji} ${finalState.animo?.label}) quedará guardado junto a tu entrenamiento en el historial. ¡Vamos a darle!`,
        type: 'ready_to_train'
      }
    ]);
  };

  // Iniciar entrenamiento desde el Chatbot
  const handleLaunchWorkout = () => {
    const dia = checkinState.diaSeleccionado;
    const rutina = checkinState.rutinaSeleccionada;

    const workoutPayload = {
      nombre: dia ? `${rutina.nombre} - ${dia.nombre}` : (rutina?.nombre || 'Entrenamiento con Coach MB'),
      dia_rutina_id: dia?.id || null,
      animo: checkinState.animo,
      energia: checkinState.animo?.nivel || 5,
      molestia: checkinState.molestia?.label || 'Ninguna',
      checkin_notas: `Check-in Coach: ${checkinState.animo?.emoji} ${checkinState.animo?.label} | Molestia: ${checkinState.molestia?.label || 'Ninguna'}`,
      ejercicios: dia?.ejercicios?.map(e => ({
        ejercicio_id: e.ejercicio_id,
        nombre: e.ejercicio?.nombre || 'Ejercicio',
        grupo_muscular: e.ejercicio?.grupo_muscular || 'General',
        series_objetivo: e.series_objetivo || 3,
        reps_objetivo: e.reps_objetivo || '8-12',
        descanso_segundos: e.descanso_segundos || 90,
        notas: e.notas || ''
      })) || []
    };

    onStartWorkout(workoutPayload);
    onClose();
  };

  // Chat libre conversacional inteligente
  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateFitnessAdvice(text.trim(), checkinState);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: reply }]);
      setIsTyping(false);
    }, 600);
  };

  // Motor de respuestas del Asistente
  const generateFitnessAdvice = (query, state) => {
    const q = query.toLowerCase();

    if (q.includes('rodilla') || q.includes('rotula')) {
      return "Para cuidar las rodillas: 1) Calienta siempre con Wall Sit isométrico y TKE con banda elástica. 2) En prensa y sentadilla, empuja siempre con los talones y no permitas que las rodillas colapsen hacia adentro (valgo). 3) Fortalece los glúteos con Hip Thrust y Abducciones para estabilizar la cadera.";
    }

    if (q.includes('comer') || q.includes('comida') || q.includes('nutricion') || q.includes('proteina')) {
      return "Recomendación nutricional: 🍌 Pre-entreno (45-60 min antes): Carbohidratos de fácil digestión como banana, avena o tostada con miel. 🍗 Post-entreno: 25-30g de proteína de calidad (pollo, huevos, yogur griego o scoop de proteína) + carbohidratos para reparar fibras musculares.";
    }

    if (q.includes('hip thrust') || q.includes('gluteo') || q.includes('glúteo')) {
      return "En el Hip Thrust la clave es: 1) Mirar siempre al frente con la barbilla pegada al pecho (no mires al techo). 2) Empujar vertical desde los talones. 3) Pausar 1-2 segundos arriba apretando fuerte los glúteos. ¡Es el ejercicio #1 para hipertrofia de glúteo mayor!";
    }

    if (q.includes('cansad') || q.includes('animo') || q.includes('ánimo') || q.includes('desgana') || q.includes('estres')) {
      return "En días de bajo ánimo, la regla de oro es 'simplemente presentarse'. Empieza con las primeras 2 series suaves. En el 90% de los casos, la liberación de dopamina y endorfinas te hará sentir mucho mejor al terminar la sesión. Si persiste la fatiga, reduce 1 serie por ejercicio y prioriza la técnica.";
    }

    if (q.includes('1rm') || q.includes('rpm') || q.includes('peso') || q.includes('fuerza')) {
      return "Puedes probar y registrar tu 1RM en la sección 'Fuerza 1RM' del menú. Para progresar en fuerza de forma segura, aplica Sobrecarga Progresiva: cuando logres completar todas las repeticiones objetivo con buena técnica, sube entre 1.25 kg y 2.5 kg en la siguiente sesión.";
    }

    if (q.includes('triceps') || q.includes('tríceps')) {
      return "Para tríceps tenemos opciones excelentes: Extensiones con Cuerda (aislamiento y bombeo), Extensiones con Barra V, Press Francés con Barra Z y Fondos. ¡Mantén los codos pegados a las costillas y bloquea el codo sin mover los hombros!";
    }

    return "¡Entendido Mariela! Como regla general en tu entrenamiento, enfócate en la técnica estricta, respeta los tiempos de descanso con el cronómetro de la app y escucha a tu cuerpo. Si necesitas ajustar tu rutina o consultar por un ejercicio en específico, ¡estoy aquí para ayudarte!";
  };

  const handleResetCheckin = () => {
    setCheckinState({
      rutinaSeleccionada: null,
      diaSeleccionado: null,
      animo: null,
      molestia: null,
      completado: false
    });
    initWelcomeConversation();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg h-[90vh] max-h-[700px] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Header del Chatbot */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="Coach MB" 
                className="w-10 h-10 rounded-2xl object-contain bg-black border border-slate-700 p-0.5 shadow-md" 
              />
              <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900 absolute -bottom-0.5 -right-0.5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-black text-white text-sm">Coach MB • Asistente Virtual</h3>
                <span className="px-1.5 py-0.5 rounded-md bg-sky-500/15 border border-sky-500/30 text-[10px] text-sky-400 font-bold">
                  IA
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Check-in diario, registro de ánimo y consejos</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleResetCheckin}
              className="p-2 rounded-xl text-slate-400 hover:text-sky-400 hover:bg-slate-800 transition-colors"
              title="Reiniciar Check-in"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cuerpo de Mensajes */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-2`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3.5 whitespace-pre-wrap leading-relaxed shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-sky-600 text-white rounded-br-none font-medium'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>

              {/* OPCIONES DEL PASO 1: SELECCIONAR RUTINA */}
              {msg.type === 'step_rutina' && (
                <div className="w-full space-y-2 pt-1 animate-in fade-in duration-300">
                  <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block">
                    Selecciona lo que vas a entrenar:
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {rutinas.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => handleSelectRutina(r)}
                        className="w-full text-left p-3 rounded-2xl bg-slate-950/80 hover:bg-sky-500/15 border border-slate-800 hover:border-sky-500/40 transition-all flex items-center justify-between group"
                      >
                        <div className="min-w-0 pr-2">
                          <h4 className="font-bold text-white group-hover:text-sky-300 text-xs sm:text-sm truncate">
                            🏋️ {r.nombre}
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                            {r.dias?.length || 1} día(s) • {r.descripcion || 'Fuerza e hipertrofia'}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 shrink-0" />
                      </button>
                    ))}

                    <button
                      onClick={() => handleSelectRutina({ id: 999, nombre: 'Entrenamiento Libre / Movilidad', dias: [{ id: 9991, nombre: 'Sesión Libre', ejercicios: [] }] })}
                      className="w-full text-left p-3 rounded-2xl bg-slate-950/80 hover:bg-emerald-500/15 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center justify-between group"
                    >
                      <div>
                        <h4 className="font-bold text-white group-hover:text-emerald-300 text-xs sm:text-sm">
                          🎯 Sesión Libre o Personalizada
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Elige ejercicios en vivo o entrena a tu ritmo
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 shrink-0" />
                    </button>
                  </div>
                </div>
              )}

              {/* OPCIONES DEL PASO 2: SELECCIONAR ÁNIMO */}
              {msg.type === 'step_animo' && (
                <div className="w-full space-y-2 pt-1 animate-in fade-in duration-300">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                    ¿Cómo está tu ánimo y energía?
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {MOOD_OPTIONS.map((mood) => (
                      <button
                        key={mood.nivel}
                        onClick={() => handleSelectMood(mood)}
                        className={`p-3 rounded-2xl border text-left transition-all active:scale-98 flex items-center gap-3 ${mood.color}`}
                      >
                        <span className="text-2xl shrink-0">{mood.emoji}</span>
                        <div className="min-w-0">
                          <div className="font-bold text-xs sm:text-sm text-white">
                            {mood.label}
                          </div>
                          <span className="text-[10px] text-slate-300 block truncate">
                            {mood.desc}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* OPCIONES DEL PASO 3: SELECCIONAR MOLESTIA */}
              {msg.type === 'step_molestia' && (
                <div className="w-full space-y-2 pt-1 animate-in fade-in duration-300">
                  <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block">
                    Estado físico / Molestias:
                  </span>
                  <div className="grid grid-cols-1 gap-1.5">
                    {MOLESTIAS_OPTIONS.map((mol) => (
                      <button
                        key={mol.id}
                        onClick={() => handleSelectMolestia(mol)}
                        className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-left text-xs font-semibold text-slate-200 hover:text-white transition-all flex items-center justify-between"
                      >
                        <span>{mol.label}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* BOTÓN FINAL: INICIAR ENTRENAMIENTO */}
              {msg.type === 'ready_to_train' && (
                <div className="w-full pt-2 space-y-2 animate-in zoom-in-95 duration-300">
                  <button
                    onClick={handleLaunchWorkout}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 hover:brightness-110 active:scale-98 transition-all"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    <span>Iniciar Entrenamiento con este Ánimo</span>
                  </button>

                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-400" />
                      Ánimo registrado: <strong className="text-white">{checkinState.animo?.emoji} {checkinState.animo?.label}</strong>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">Quedará en tu Historial</span>
                  </div>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Bot className="w-4 h-4 text-sky-400 animate-spin" />
              <span>Coach MB está escribiendo...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Preguntas Frecuentes Sugeridas */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/60 overflow-x-auto no-scrollbar flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase text-slate-500 shrink-0">Preguntas:</span>
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 rounded-xl bg-slate-800/80 hover:bg-sky-500/20 text-slate-300 hover:text-sky-300 text-[11px] font-medium shrink-0 border border-slate-700/60 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input de Chat */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
            placeholder="Pregúntale a tu Coach MB sobre técnica, ánimo, cargas..."
            className="flex-1 bg-slate-900 border border-slate-800 focus:border-sky-500 text-white rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none placeholder:text-slate-500 shadow-inner"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputVal.trim()}
            className="p-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 disabled:opacity-30 text-slate-950 font-bold transition-all shadow-md active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
