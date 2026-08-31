import React, { useState } from 'react';
import { Dumbbell, Lock, Key, ShieldCheck, User, Eye, EyeOff, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AuthScreen({ onLoginSuccess }) {
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Obtener PIN configurado o default
  const getStoredPin = () => {
    return localStorage.getItem('mbtracker_auth_pin') || 'mariela123';
  };

  const handleLogin = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');

    const stored = getStoredPin().toLowerCase().trim();
    const entered = pin.toLowerCase().trim();

    // Acepta el PIN guardado, o nombres clave directos 'mariela', '1234', 'admin'
    if (entered === stored || entered === 'mariela' || entered === 'mariela123' || entered === '1234' || entered === 'britos') {
      const authData = {
        name: 'Mariela Britos',
        username: 'marielabritos',
        authenticated: true,
        loginTime: new Date().toISOString()
      };
      if (rememberMe) {
        localStorage.setItem('mbtracker_auth_user', JSON.stringify(authData));
      }
      onLoginSuccess(authData);
    } else {
      setError('Contraseña o PIN incorrecto. Intenta con "mariela" o tu clave.');
    }
  };

  const handleQuickUnlock = () => {
    const authData = {
      name: 'Mariela Britos',
      username: 'marielabritos',
      authenticated: true,
      loginTime: new Date().toISOString()
    };
    if (rememberMe) {
      localStorage.setItem('mbtracker_auth_user', JSON.stringify(authData));
    }
    onLoginSuccess(authData);
  };

  const handleSaveNewPin = (e) => {
    e.preventDefault();
    if (!newPin.trim()) return setError('Ingresa un PIN válido.');
    if (newPin !== confirmNewPin) return setError('Los PIN ingresados no coinciden.');

    localStorage.setItem('mbtracker_auth_pin', newPin.trim());
    setIsChangingPin(false);
    setPin(newPin.trim());
    setError('');
    alert('¡PIN actualizado correctamente!');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 select-none relative overflow-hidden font-sans">
      {/* Luces y efectos de fondo neón */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10 space-y-6 animate-in fade-in zoom-in-95 duration-300">
        {/* Header con Logo */}
        <div className="text-center space-y-3">
          <img 
            src="/logo.png" 
            alt="MB Training Fitness" 
            className="w-24 h-24 rounded-3xl object-contain mx-auto shadow-2xl border-2 border-slate-700/80 bg-black p-1" 
          />

          <div>
            <h1 className="font-black text-2xl text-white tracking-tight">MBTracker</h1>
            <p className="text-xs text-sky-400 font-bold uppercase tracking-wider mt-0.5">Acceso Personal • Mariela Britos</p>
          </div>
        </div>

        {isChangingPin ? (
          /* Formulario para cambiar PIN */
          <form onSubmit={handleSaveNewPin} className="space-y-4">
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                Configurar Nueva Contraseña / PIN
              </h3>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Nueva Clave o PIN</label>
                <input
                  type="password"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="Ej. 1234 o mariela"
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Confirmar Nueva Clave</label>
                <input
                  type="password"
                  value={confirmNewPin}
                  onChange={(e) => setConfirmNewPin(e.target.value)}
                  placeholder="Repite tu clave"
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-sky-500"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs text-center font-medium">
                {error}
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { setIsChangingPin(false); setError(''); }}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Volver
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/25"
              >
                Guardar Clave
              </button>
            </div>
          </form>
        ) : (
          /* Formulario de Login */
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Contraseña o PIN de Acceso
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => { setPin(e.target.value); setError(''); }}
                  placeholder="Ingresa tu clave (ej. mariela123)"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 text-white rounded-2xl pl-10 pr-10 py-3.5 text-sm font-medium focus:outline-none transition-colors shadow-inner"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs text-center font-medium animate-in fade-in">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-sky-500 focus:ring-0"
                />
                <span>Recordarme</span>
              </label>

              <button
                type="button"
                onClick={() => { setIsChangingPin(true); setError(''); }}
                className="text-sky-400 hover:underline font-semibold"
              >
                Cambiar clave
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-400 hover:from-sky-400 hover:to-emerald-300 text-slate-950 font-black text-sm shadow-xl shadow-sky-500/25 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <span>Ingresar a MBTracker</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

            {/* Acceso Directo de 1 Toque para Mariela */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleQuickUnlock}
                className="w-full py-3 px-4 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Acceso Rápido Automático (Mariela)</span>
              </button>
            </div>
          </form>
        )}

        <div className="pt-2 border-t border-slate-800/80 text-center">
          <span className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Entrenamiento Personal, Fuerza, Cardio & Montañismo
          </span>
        </div>
      </div>
    </div>
  );
}
