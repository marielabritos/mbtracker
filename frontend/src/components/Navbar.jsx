import React, { useState, useEffect } from 'react';
import { Home, Dumbbell, Calendar, History, TrendingUp, Play, User, LogOut, Lock, Zap, CalendarDays, Layers, Cloud, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export default function Navbar({ activeTab, setActiveTab, isWorkoutActive, onLogout }) {
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);
  const [syncStatusText, setSyncStatusText] = useState('');

  const navItems = [
    { id: 'dashboard', label: 'Inicio', icon: Home },
    { id: 'entrenar', label: 'Entrenar', icon: isWorkoutActive ? Play : Dumbbell, highlight: isWorkoutActive },
    { id: 'rutinas', label: 'Rutinas', icon: Layers },
    { id: 'calendario', label: 'Calendario', icon: CalendarDays },
    { id: 'fuerza_1rm', label: '1RM', icon: Zap },
    { id: 'progreso', label: 'Progreso', icon: TrendingUp },
    { id: 'historial', label: 'Historial', icon: History },
    { id: 'perfil', label: 'Perfil', icon: User },
  ];

  useEffect(() => {
    // Sincronización automática al cargar y al cambiar de pestaña
    api.cloudSync.pullFromCloud();

    const handleSynced = (e) => {
      setSyncStatusText(e.detail?.direction === 'push' ? 'Nube actualizada' : 'Sincronizado con PC/Móvil');
      setTimeout(() => setSyncStatusText(''), 3000);
    };

    window.addEventListener('mbtracker:cloud-synced', handleSynced);
    window.addEventListener('focus', () => api.cloudSync.pullFromCloud());

    return () => {
      window.removeEventListener('mbtracker:cloud-synced', handleSynced);
    };
  }, []);

  const handleManualSync = async () => {
    if (isSyncingCloud) return;
    try {
      setIsSyncingCloud(true);
      await api.cloudSync.syncNow();
      setSyncStatusText('✓ Sincronización exitosa');
      setTimeout(() => setSyncStatusText(''), 3500);
    } catch (e) {
      setSyncStatusText('Error de red');
    } finally {
      setIsSyncingCloud(false);
    }
  };

  return (
    <>
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <img 
            src="/logo.png" 
            alt="MB Training" 
            className="w-9 h-9 rounded-xl object-contain shadow-md border border-slate-700/80 bg-black p-0.5" 
          />
          <div>
            <h1 className="font-black text-sm text-white tracking-tight leading-none">MBTracker</h1>
            <span className="text-[10px] text-sky-400 font-bold">Mariela Britos</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Botón Sincronización Móvil */}
          <button
            type="button"
            onClick={handleManualSync}
            disabled={isSyncingCloud}
            className="px-2.5 py-1.5 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all"
            title="Sincronizar datos entre Computadora y Celular"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingCloud ? 'animate-spin text-sky-300' : ''}`} />
            <span className="text-[11px]">{syncStatusText || (isSyncingCloud ? 'Sincronizando...' : 'Sincronizar')}</span>
          </button>

          {isWorkoutActive && (
            <button
              onClick={() => setActiveTab('entrenar')}
              className="px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-black flex items-center gap-1.5 animate-pulse"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>En vivo</span>
            </button>
          )}

          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition-colors"
              title="Cerrar sesión / Bloquear"
            >
              <Lock className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Desktop Header Topbar */}
      <header className="hidden md:flex items-center justify-between px-8 py-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <img 
            src="/logo.png" 
            alt="MB Training" 
            className="w-11 h-11 rounded-2xl object-contain shadow-lg shadow-sky-500/20 border border-slate-700/80 bg-black p-0.5" 
          />
          <div>
            <h1 className="font-bold text-lg text-white tracking-tight leading-none">MBTracker</h1>
            <span className="text-xs text-sky-400 font-medium">Training Fitness • Mariela Britos</span>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                } ${item.highlight ? 'relative font-semibold text-emerald-400' : ''}`}
              >
                <Icon className={`w-4 h-4 ${item.highlight ? 'animate-pulse text-emerald-400' : ''}`} />
                {item.label}
                {item.highlight && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute -top-0.5 -right-0.5" />
                )}
              </button>
            );
          })}

          {/* Botón Sincronización Desktop */}
          <button
            type="button"
            onClick={handleManualSync}
            disabled={isSyncingCloud}
            className="ml-2 px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-sky-400 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            title="Sincronizar instantáneamente con tu celular"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingCloud ? 'animate-spin' : ''}`} />
            <span>{syncStatusText || (isSyncingCloud ? 'Sincronizando...' : 'Nube PC ↔ Celular')}</span>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="ml-2 p-2 rounded-xl bg-slate-800 hover:bg-rose-500/15 hover:border-rose-500/30 border border-transparent text-slate-400 hover:text-rose-400 text-xs font-bold flex items-center gap-1.5 transition-all"
              title="Cerrar sesión / Bloquear app"
            >
              <LogOut className="w-4 h-4" />
              <span>Bloquear</span>
            </button>
          )}
        </nav>
      </header>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-2 py-2 flex items-center justify-around shadow-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all relative ${
                isActive
                  ? 'text-sky-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive ? 'bg-sky-500/20 scale-110 shadow-lg shadow-sky-500/20' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${item.highlight ? 'animate-pulse text-emerald-400' : ''}`} />
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
              {item.highlight && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute top-1 right-2" />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
}
