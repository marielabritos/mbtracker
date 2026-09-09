import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthScreen from './components/AuthScreen';
import ChatbotCoach from './components/ChatbotCoach';
import PasosTrackerModal from './components/PasosTrackerModal';
import HIITTimerModal from './components/HIITTimerModal';
import SpotifyPlayerModal from './components/SpotifyPlayerModal';
import SyncModal from './components/SyncModal';
import Dashboard from './pages/Dashboard';
import Rutinas from './pages/Rutinas';
import Entrenar from './pages/Entrenar';
import Historial from './pages/Historial';
import Progreso from './pages/Progreso';
import Perfil from './pages/Perfil';
import Calculadora1RM from './pages/Calculadora1RM';
import Calendario from './pages/Calendario';
import { Bot, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';
import { expandPayload } from './utils/syncCompressor';

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
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [syncToast, setSyncToast] = useState('');

  const [activeWorkout, setActiveWorkout] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  // Escuchar si se abre la app con un enlace de sincronización (?sync=...)
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      let syncParam = urlParams.get('sync');
      if (!syncParam && window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'));
        syncParam = hashParams.get('sync');
      }

      if (syncParam) {
        const cleanBase64 = syncParam.replace(/ /g, '+');
        const decodedJson = decodeURIComponent(escape(atob(cleanBase64)));
        const rawParsed = JSON.parse(decodedJson);
        const parsed = expandPayload(rawParsed);

        if (parsed.rutinas && Array.isArray(parsed.rutinas) && parsed.rutinas.length > 0) {
          localStorage.setItem('mbtracker_rutinas', JSON.stringify(parsed.rutinas));
        }
        if (parsed.sesiones && Array.isArray(parsed.sesiones) && parsed.sesiones.length > 0) {
          const localSesiones = JSON.parse(localStorage.getItem('mbtracker_sesiones') || '[]');
          const sMap = new Map();
          localSesiones.forEach(s => sMap.set(s.id, s));
          parsed.sesiones.forEach(s => sMap.set(s.id, { ...(sMap.get(s.id) || {}), ...s }));
          const merged = Array.from(sMap.values()).sort((a, b) => {
            const tA = new Date(a.fecha_inicio || a.fecha || 0).getTime();
            const tB = new Date(b.fecha_inicio || b.fecha || 0).getTime();
            return tB - tA;
          });
          localStorage.setItem('mbtracker_sesiones', JSON.stringify(merged));
        }
        if (parsed.perfil) {
          localStorage.setItem('mbtracker_perfil', JSON.stringify(parsed.perfil));
        }
        if (parsed.prs && Array.isArray(parsed.prs) && parsed.prs.length > 0) {
          const localPrs = JSON.parse(localStorage.getItem('mbtracker_prs') || '[]');
          const pMap = new Map();
          localPrs.forEach(p => pMap.set(p.ejercicio_id || p.id, p));
          parsed.prs.forEach(p => pMap.set(p.ejercicio_id || p.id, p));
          localStorage.setItem('mbtracker_prs', JSON.stringify(Array.from(pMap.values())));
        }

        setSyncToast(`✨ ¡Sincronizado con éxito! (${parsed.sesiones?.length || 0} Entrenamientos cargados)`);
        window.history.replaceState({}, document.title, window.location.pathname);
        setTimeout(() => {
          setSyncToast('');
          window.location.reload();
        }, 1200);
      }
    } catch (e) {
      console.error("Error reading sync parameter from URL", e);
    }
  }, []);

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
      {/* Toast Banner de Sincronización Exitosa */}
      {syncToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-slate-950 px-5 py-3 rounded-2xl shadow-2xl font-black text-xs sm:text-sm flex items-center gap-2 animate-bounce border-2 border-white">
          <CheckCircle2 className="w-5 h-5" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* Barra de navegación superior (Desktop) y fija inferior (Móvil) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isWorkoutActive={!!activeWorkout}
        onLogout={handleLogout}
        onOpenCoach={() => setIsCoachOpen(true)}
        onOpenSpotify={() => setIsSpotifyModalOpen(true)}
        onOpenHIIT={() => setIsHIITModalOpen(true)}
        onOpenSync={() => setIsSyncModalOpen(true)}
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
            onOpenSync={() => setIsSyncModalOpen(true)}
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

      {/* Modal de Sincronización QR / Enlace PC ↔ Móvil */}
      <SyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
      />

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
