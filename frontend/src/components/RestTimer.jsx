import React, { useState, useEffect } from 'react';
import { Timer, X, Plus, Minus, Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { sound } from '../utils/sound';

export default function RestTimer({ initialSeconds = 90, onClose, isFloating = true }) {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            sound.playTimerDone();
            if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 400]);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const addTime = (secs) => {
    setSecondsLeft((prev) => Math.max(0, prev + secs));
    setTotalSeconds((prev) => Math.max(prev, secondsLeft + secs));
  };

  const setPreset = (secs) => {
    setTotalSeconds(secs);
    setSecondsLeft(secs);
    setIsRunning(true);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  const percentage = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;
  const isFinished = secondsLeft === 0;

  if (minimized) {
    return (
      <div 
        onClick={() => setMinimized(false)}
        className={`fixed bottom-20 right-4 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-2xl cursor-pointer border backdrop-blur-md transition-all animate-bounce ${
          isFinished 
            ? 'bg-rose-600/90 border-rose-400 text-white animate-pulse'
            : 'bg-slate-900/90 border-sky-500/40 text-sky-400'
        }`}
      >
        <Timer className="w-5 h-5" />
        <span className="font-mono font-bold text-sm">
          {isFinished ? '¡Tiempo Cumplido!' : formatTime(secondsLeft)}
        </span>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center relative overflow-hidden">
        {/* Glow background indicator */}
        <div className={`absolute -top-24 -left-24 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none ${isFinished ? 'bg-rose-500' : 'bg-sky-500'}`} />

        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-slate-300">
            <Timer className="w-5 h-5 text-sky-400" />
            <span className="font-semibold text-sm">Descanso entre Series</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMinimized(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs"
              title="Minimizar"
            >
              Minimizar
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Circular / Big Timer Display */}
        <div className="relative my-6 flex flex-col items-center justify-center">
          <div className="w-48 h-48 rounded-full border-4 border-slate-800 flex items-center justify-center relative">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="92"
                stroke="currentColor"
                strokeWidth="6"
                className="text-slate-800"
                fill="transparent"
              />
              <circle
                cx="96"
                cy="96"
                r="92"
                stroke="currentColor"
                strokeWidth="6"
                strokeDasharray={2 * Math.PI * 92}
                strokeDashoffset={2 * Math.PI * 92 * (1 - percentage / 100)}
                className={`transition-all duration-300 ${isFinished ? 'text-rose-500' : 'text-sky-400'}`}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            <div className="flex flex-col items-center z-10">
              <span className={`text-4xl font-black font-mono tracking-tight ${isFinished ? 'text-rose-400 animate-pulse' : 'text-white'}`}>
                {formatTime(secondsLeft)}
              </span>
              <span className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                {isFinished ? '¡A darle!' : isRunning ? 'Descansando' : 'Pausado'}
              </span>
            </div>
          </div>
        </div>

        {/* Adjust Buttons */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <button
            onClick={() => addTime(-15)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
          >
            <Minus className="w-3.5 h-3.5" /> 15s
          </button>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`p-3 rounded-2xl transition-all shadow-lg ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold'
            }`}
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
          </button>
          <button
            onClick={() => addTime(30)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
          >
            <Plus className="w-3.5 h-3.5" /> 30s
          </button>
        </div>

        {/* Presets */}
        <div className="grid grid-cols-4 gap-2">
          {[45, 60, 90, 120].map((secs) => (
            <button
              key={secs}
              onClick={() => setPreset(secs)}
              className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                totalSeconds === secs && secondsLeft > 0
                  ? 'bg-sky-500/20 border-sky-500/50 text-sky-400'
                  : 'bg-slate-800/60 border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {secs >= 60 ? `${secs / 60}m` : `${secs}s`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
