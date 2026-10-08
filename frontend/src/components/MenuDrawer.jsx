import React from 'react';
import { 
  X, Home, Dumbbell, Layers, History, TrendingUp, CalendarDays, 
  Zap, HeartPulse, Music, Timer, Bot, 
  Smartphone, LogOut, ChevronRight, Sparkles, Compass, 
  User, Play, Trophy, ShieldCheck, Flame
} from 'lucide-react';

export default function MenuDrawer({
  isOpen,
  onClose,
  activeTab,
  onNavigateTab,
  onOpenCoach,
  onOpenSteps,
  onOpenHIIT,
  onOpenSpotify,
  onOpenSync,
  onStartWorkout,
  onLogout
}) {
  if (!isOpen) return null;

  const handleTabClick = (tabId) => {
    onNavigateTab(tabId);
    onClose();
  };

  const handleAction = (actionFn) => {
    if (actionFn) actionFn();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Fondo oscuro difuminado */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Panel lateral deslizante */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 z-50">
        <div className="w-screen max-w-sm bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between overflow-y-auto animate-slideInRight">
          
          {/* Header del Menú */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="MB Training" 
                className="w-10 h-10 rounded-2xl object-contain bg-black border border-slate-700 p-0.5 shadow-md"
              />
              <div>
                <h3 className="font-black text-white text-base leading-none">Menú Principal</h3>
                <span className="text-[11px] font-bold text-sky-400">MBTracker • Mariela Britos</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lista de Secciones y Opciones */}
          <div className="p-4 space-y-5 flex-1 overflow-y-auto">

            {/* SECCIÓN 1: NAVEGACIÓN PRINCIPAL */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-2">
                Navegación Principal
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => handleTabClick('dashboard')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    activeTab === 'dashboard'
                      ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                      : 'text-slate-200 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Home className="w-4 h-4 text-sky-400" />
                    <span>Inicio / Dashboard</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button
                  onClick={() => handleTabClick('entrenar')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    activeTab === 'entrenar'
                      ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                      : 'text-slate-200 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Play className="w-4 h-4 text-emerald-400" />
                    <span>Entrenar en Vivo</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button
                  onClick={() => handleTabClick('rutinas')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    activeTab === 'rutinas'
                      ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                      : 'text-slate-200 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-sky-400" />
                    <span>Mis Rutinas</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button
                  onClick={() => handleTabClick('historial')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    activeTab === 'historial'
                      ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                      : 'text-slate-200 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <History className="w-4 h-4 text-purple-400" />
                    <span>Historial de Sesiones</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>
            </div>

            {/* SECCIÓN 2: HERRAMIENTAS & UTILIDADES */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-2">
                Herramientas del Gimnasio
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => handleAction(onOpenSteps)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-200 hover:bg-slate-800/80 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">👟</span>
                    <span>Podómetro & Pasos Diarios</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Pasos
                  </span>
                </button>

                <button
                  onClick={() => handleAction(onOpenHIIT)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-200 hover:bg-slate-800/80 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">⏱️</span>
                    <span>Temporizador HIIT & Tabata</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-400 border border-rose-500/30">
                    Intervalos
                  </span>
                </button>

                <button
                  onClick={() => handleAction(onOpenSpotify)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-200 hover:bg-slate-800/80 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">🎵</span>
                    <span>Spotify Gym & Playlists</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#1DB954]/15 text-[#1DB954] border border-[#1DB954]/30">
                    Música
                  </span>
                </button>

                <button
                  onClick={() => handleAction(onOpenCoach)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-200 hover:bg-slate-800/80 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">🤖</span>
                    <span>Coach Virtual MB (IA)</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-500/15 text-sky-400 border border-sky-500/30">
                    Check-in
                  </span>
                </button>

                <button
                  onClick={() => handleTabClick('fuerza_1rm')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    activeTab === 'fuerza_1rm'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'text-slate-200 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">🎯</span>
                    <span>Calculadora Fuerza 1RM</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>
            </div>

            {/* SECCIÓN 3: SEGUIMIENTO & RESULTADOS */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-2">
                Progreso & Calendario
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => handleTabClick('calendario')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    activeTab === 'calendario'
                      ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                      : 'text-slate-200 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CalendarDays className="w-4 h-4 text-sky-400" />
                    <span>Calendario Mensual</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button
                  onClick={() => handleTabClick('progreso')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    activeTab === 'progreso'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-200 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>Progreso & Marcas (PRs)</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button
                  onClick={() => handleTabClick('perfil')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    activeTab === 'perfil'
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      : 'text-slate-200 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-indigo-400" />
                    <span>Mi Perfil & Objetivos</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>
            </div>

            {/* SECCIÓN 4: DISPOSITIVOS & CONFIGURACIÓN */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-2">
                Conexión & Dispositivos
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => handleAction(onOpenSync)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold bg-sky-500/10 border border-sky-500/25 text-sky-300 hover:bg-sky-500/20 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <Smartphone className="w-4 h-4 text-sky-400" />
                    <span>Sincronizar Celular ↔ PC</span>
                  </div>
                  <span className="text-[10px] font-black bg-sky-500 text-slate-950 px-2 py-0.5 rounded-full">
                    Nube
                  </span>
                </button>
              </div>
            </div>

          </div>

          {/* Footer del Menú: Cerrar Sesión */}
          {onLogout && (
            <div className="p-4 border-t border-slate-800 bg-slate-950/60">
              <button
                onClick={() => handleAction(onLogout)}
                className="w-full py-2.5 px-3 rounded-2xl bg-slate-800/80 hover:bg-rose-500/15 hover:text-rose-400 hover:border-rose-500/30 border border-slate-700/60 text-slate-400 text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Bloquear / Cerrar Sesión</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
