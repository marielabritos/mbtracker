import React from 'react';
import { AlertTriangle, RotateCcw, Wrench } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    try {
      localStorage.removeItem('mbtracker_active_workout');
    } catch (e) {}
    window.location.reload();
  };

  handleResetAndFix = () => {
    try {
      localStorage.removeItem('mbtracker_active_workout');
      localStorage.removeItem('mbtracker_rutinas');
      localStorage.removeItem('mbtracker_sesiones');
      localStorage.removeItem('mbtracker_deleted_rutina_ids');
      localStorage.removeItem('mbtracker_sync_version_key');
    } catch (e) {}
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center mb-4 text-rose-400 shadow-xl shadow-rose-500/10">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-white">Algo salió mal</h2>
          <p className="text-xs text-slate-400 mt-2 max-w-sm">
            Ocurrió un error al renderizar la aplicación. Presiona el botón para reiniciar o reparar tus datos.
          </p>

          {this.state.error && (
            <div className="mt-4 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-rose-300 max-w-md break-words text-left shadow-inner">
              {this.state.error.message || String(this.state.error)}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={this.handleReload}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-sm shadow-xl active:scale-95 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Reiniciar Aplicación
            </button>
            <button
              onClick={this.handleResetAndFix}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 active:scale-95 transition-all"
            >
              <Wrench className="w-4 h-4 text-sky-400" />
              Reparar Datos Limpios
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
