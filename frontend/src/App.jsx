import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthScreen from './components/AuthScreen';
import ChatbotCoach from './components/ChatbotCoach';
import PasosTrackerModal from './components/PasosTrackerModal';
import HIITTimerModal from './components/HIITTimerModal';
import SpotifyPlayerModal from './components/SpotifyPlayerModal';
import Dashboard from './pages/Dashboard';
import Rutinas from './pages/Rutinas';
import Entrenar from './pages/Entrenar';
import Historial from './pages/Historial';
import Progreso from './pages/Progreso';
import Perfil from './pages/Perfil';
import Calculadora1RM from './pages/Calculadora1RM';
import Calendario from './pages/Calendario';
import { Bot, MessageSquare, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'mbtracker_active_workout';
const AUTH_KEY = 'mbtracker_auth_user';

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  const [isStepsModalOpen, setIsStepsModalOpen] = useState(false);
  const [isHIITModalOpen, setIsHIITModalOpen] = useState(false);
  const [isSpotifyModalOpen, setIsSpotifyModalOpen] = useState(false);

  const [activeWorkout, setActiveWorkout] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (activeWorkout) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activeWorkout));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [activeWorkout]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    if (confirm("¿Deseas cerrar sesión en este dispositivo?")) {
      localStorage.removeItem(AUTH_KEY);
      setUser(null);
    }
  };

  const handleStartWorkout = (workoutConfig) => {
    setActiveWorkout(workoutConfig);
    setActiveTab('entrenar');
  };

  const handleFinishWorkout = (savedSession) => {
    setActiveWorkout(null);
    setActiveTab('historial');
  };

  const handleCancelWorkout = () => {
    if (confirm("¿Deseas salir del entrenamiento en curso?")) {
      setActiveWorkout(null);
      setActiveTab('dashboard');
    }
  };

  // Si no está autenticado, mostrar pantalla de bloqueo / login
  if (!user || !user.authenticated) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative">
      {/* Barra de navegación superior (Desktop) y fija inferior (Móvil) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isWorkoutActive={!!activeWorkout}
        onLogout={handleLogout}
        onOpenCoach={() => setIsCoachOpen(true)}
        onOpenSpotify={() => setIsSpotifyModalOpen(true)}
        onOpenHIIT={() => setIsHIITModalOpen(true)}
      />

      {/* Contenido Principal */}
      <main className="flex-1 w-full">
        {activeTab === 'dashboard' && (
          <Dashboard
            onStartWorkout={handleStartWorkout}
            onNavigateTab={setActiveTab}
            onOpenCoach={() => setIsCoachOpen(true)}
            onOpenSteps={() => setIsStepsModalOpen(true)}
            onOpenHIIT={() => setIsHIITModalOpen(true)}
            onOpenSpotify={() => setIsSpotifyModalOpen(true)}
          />
        )}

        {activeTab === 'entrenar' && (
          <Entrenar
            workoutData={activeWorkout}
            onFinishWorkout={handleFinishWorkout}
            onCancelWorkout={handleCancelWorkout}
            onNavigateTab={setActiveTab}
            onOpenSpotify={() => setIsSpotifyModalOpen(true)}
            onOpenHIIT={() => setIsHIITModalOpen(true)}
          />
        )}

        {activeTab === 'rutinas' && (
          <Rutinas
            onStartWorkout={handleStartWorkout}
          />
        )}

        {activeTab === 'historial' && (
          <Historial />
        )}

        {activeTab === 'progreso' && (
          <Progreso onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'calendario' && (
          <Calendario onStartWorkout={handleStartWorkout} onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'fuerza_1rm' && (
          <Calculadora1RM />
        )}

        {activeTab === 'perfil' && (
          <Perfil onLogout={handleLogout} />
        )}
      </main>

      {/* Botón Flotante Global de Coach MB / Asistente IA */}
      <button
        onClick={() => setIsCoachOpen(true)}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 p-3 sm:px-4 sm:py-3 rounded-2xl bg-gradient-to-r from-sky-500 via-sky-400 to-emerald-400 text-slate-950 font-black shadow-2xl shadow-sky-500/30 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all border border-white/20 group"
        title="Abrir Coach Virtual MB: Check-in Diario & Ánimo"
      >
        <div className="relative">
          <img 
            src="/logo.png" 
            alt="MB" 
            className="w-6 h-6 rounded-lg object-contain bg-black p-0.5" 
          />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 absolute -top-1 -right-1 animate-pulse" />
        </div>
        <span className="hidden sm:inline text-xs font-black tracking-tight">Coach MB • Ánimo</span>
      </button>

      {/* Modal / Drawer del Chatbot Coach */}
      <ChatbotCoach
        isOpen={isCoachOpen}
        onClose={() => setIsCoachOpen(false)}
        onStartWorkout={handleStartWorkout}
      />

      {/* Modal del Podómetro & Pasos Diarios */}
      <PasosTrackerModal
        isOpen={isStepsModalOpen}
        onClose={() => setIsStepsModalOpen(false)}
      />

      {/* Modal del Temporizador HIIT & Tabata */}
      <HIITTimerModal
        isOpen={isHIITModalOpen}
        onClose={() => setIsHIITModalOpen(false)}
        onFinishWorkout={handleFinishWorkout}
      />

      {/* Modal de Spotify & Música Gym */}
      <SpotifyPlayerModal
        isOpen={isSpotifyModalOpen}
        onClose={() => setIsSpotifyModalOpen(false)}
      />
    </div>
  );
}
