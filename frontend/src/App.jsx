import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthScreen from './components/AuthScreen';
import Dashboard from './pages/Dashboard';
import Rutinas from './pages/Rutinas';
import Entrenar from './pages/Entrenar';
import Historial from './pages/Historial';
import Progreso from './pages/Progreso';
import Perfil from './pages/Perfil';
import Calculadora1RM from './pages/Calculadora1RM';

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Barra de navegación superior (Desktop) y fija inferior (Móvil) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isWorkoutActive={!!activeWorkout}
        onLogout={handleLogout}
      />

      {/* Contenido Principal */}
      <main className="flex-1 w-full">
        {activeTab === 'dashboard' && (
          <Dashboard
            onStartWorkout={handleStartWorkout}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'entrenar' && (
          <Entrenar
            workoutData={activeWorkout}
            onFinishWorkout={handleFinishWorkout}
            onCancelWorkout={handleCancelWorkout}
            onNavigateTab={setActiveTab}
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

        {activeTab === 'fuerza_1rm' && (
          <Calculadora1RM />
        )}

        {activeTab === 'perfil' && (
          <Perfil onLogout={handleLogout} />
        )}
      </main>
    </div>
  );
}
