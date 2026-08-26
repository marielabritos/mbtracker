import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Rutinas from './pages/Rutinas';
import Entrenar from './pages/Entrenar';
import Historial from './pages/Historial';
import Progreso from './pages/Progreso';

const STORAGE_KEY = 'mbtracker_active_workout';

export default function App() {
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Barra de navegación superior (Desktop) y fija inferior (Móvil) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isWorkoutActive={!!activeWorkout}
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
          <Progreso />
        )}
      </main>
    </div>
  );
}
