import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

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
    localStorage.removeItem('mbtracker_active_workout');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center mb-4 text-rose-400">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-white">Algo salió mal</h2>
          <p className="text-xs text-slate-400 mt-2 max-w-sm">
            Ocurrió un error al renderizar la aplicación. Presiona el botón para reiniciar de forma segura.
          </p>
          <button
            onClick={this.handleReload}
            className="mt-6 flex items-center gap-2 px-5 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm shadow-xl active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reiniciar Aplicación
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
