import React, { useState, useEffect } from 'react';
import { 
  Music, Play, ExternalLink, X, Sparkles, Heart, Plus, 
  Flame, Radio, Headphones, Check, RefreshCw 
} from 'lucide-react';

const DEFAULT_PLAYLISTS = [
  {
    id: 'phonk',
    nombre: '🎧 MB Heavy Workout & Phonk',
    descripcion: 'Beats intensos, energía máxima para series pesadas de piernas y empuje.',
    spotifyId: '37i9dQZF1DX76t638V6494', // Spotify Official Phonk Workout
    icon: '⚡',
    color: 'from-amber-500/20 to-rose-500/20 border-amber-500/30'
  },
  {
    id: 'cardio',
    nombre: '🏃 Running & Cardio Hits',
    descripcion: 'Ritmos rápidos de 150-170 BPM para correr, bici o circuitos HIIT.',
    spotifyId: '37i9dQZF1DXadOVCgGhS7j', // Beast Mode
    icon: '🔥',
    color: 'from-sky-500/20 to-cyan-500/20 border-sky-500/30'
  },
  {
    id: 'latin',
    nombre: '💃 Reggaeton & Latin Gym Motivación',
    descripcion: 'Poder latino, energía positiva y ritmo para entrenar motivada.',
    spotifyId: '37i9dQZF1DWYp57Q9147G0', // Reggaeton Workout
    icon: '💥',
    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30'
  },
  {
    id: 'hiphop',
    nombre: '🎤 Hip Hop & Gym Motivation',
    descripcion: 'Fuerza, concentración y enfoque total para romper tus marcas.',
    spotifyId: '37i9dQZF1DWTl4ym9csNA2', // Workout Motivation
    icon: '🎧',
    color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30'
  },
  {
    id: 'chill',
    nombre: '🧘 Estiramientos & Vuelta a la Calma',
    descripcion: 'Melodías suaves para relajación muscular, movilidad y respiración.',
    spotifyId: '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Chill
    icon: '🌿',
    color: 'from-teal-500/20 to-emerald-500/20 border-teal-500/30'
  }
];

const STORAGE_CUSTOM_PLAYLIST_KEY = 'mbtracker_custom_spotify_playlist';

export default function SpotifyPlayerModal({ isOpen, onClose }) {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(DEFAULT_PLAYLISTS[0].spotifyId);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [customPlaylist, setCustomPlaylist] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CUSTOM_PLAYLIST_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const extractSpotifyId = (urlOrUri) => {
    if (!urlOrUri) return null;
    const match = urlOrUri.match(/playlist\/([a-zA-Z0-9]+)/) || urlOrUri.match(/album\/([a-zA-Z0-9]+)/) || urlOrUri.match(/track\/([a-zA-Z0-9]+)/);
    if (match && match[1]) return match[1];
    if (urlOrUri.startsWith('spotify:playlist:')) return urlOrUri.split(':')[2];
    if (urlOrUri.length === 22) return urlOrUri;
    return null;
  };

  const handleSaveCustomPlaylist = () => {
    const spId = extractSpotifyId(customUrlInput.trim());
    if (!spId) {
      alert('Por favor ingresa un enlace válido de playlist de Spotify (ej: https://open.spotify.com/playlist/...)');
      return;
    }
    const newCustom = {
      id: 'custom_' + Date.now(),
      nombre: '⭐ Mi Playlist Personal de Spotify',
      descripcion: 'Tu lista personalizada guardada en MBTracker',
      spotifyId: spId,
      icon: '⭐',
      color: 'from-amber-500/20 to-yellow-500/20 border-amber-500/40'
    };
    setCustomPlaylist(newCustom);
    setSelectedPlaylistId(spId);
    setCustomUrlInput('');
    try {
      localStorage.setItem(STORAGE_CUSTOM_PLAYLIST_KEY, JSON.stringify(newCustom));
    } catch (e) {}
  };

  const currentSpotifyEmbedUrl = `https://open.spotify.com/embed/playlist/${selectedPlaylistId}?utm_source=generator&theme=0`;
  const currentSpotifyAppUrl = `https://open.spotify.com/playlist/${selectedPlaylistId}`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1DB954]/15 border border-[#1DB954]/30 flex items-center justify-center text-xl shadow-md">
              🎵
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-white text-base">Spotify Gym & Música</h3>
                <span className="px-2 py-0.5 rounded-md bg-[#1DB954]/20 text-[#1DB954] text-[10px] font-black border border-[#1DB954]/30">
                  SPOTIFY
                </span>
              </div>
              <p className="text-xs text-slate-400">Playlists de fuerza, cardio y motivación</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href={currentSpotifyAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-[#1DB954]/15 hover:bg-[#1DB954]/30 text-[#1DB954] text-xs font-bold flex items-center gap-1 transition-colors border border-[#1DB954]/30"
              title="Abrir en App de Spotify"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Abrir App</span>
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
          
          {/* Reproductor Spotify Embed */}
          <div className="rounded-2xl overflow-hidden border border-slate-800 bg-black shadow-xl">
            <iframe
              src={currentSpotifyEmbedUrl}
              width="100%"
              height="152"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Spotify Gym Player"
              className="rounded-2xl"
            />
          </div>

          {/* Selector de Playlists */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Elige tu ritmo de entrenamiento:
            </span>

            <div className="space-y-2">
              {/* Custom Playlist si existe */}
              {customPlaylist && (
                <button
                  onClick={() => setSelectedPlaylistId(customPlaylist.spotifyId)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                    selectedPlaylistId === customPlaylist.spotifyId
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg'
                      : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl">{customPlaylist.icon}</span>
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-white truncate">
                        {customPlaylist.nombre}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {customPlaylist.descripcion}
                      </p>
                    </div>
                  </div>
                  {selectedPlaylistId === customPlaylist.spotifyId && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
                  )}
                </button>
              )}

              {DEFAULT_PLAYLISTS.map((pl) => (
                <button
                  key={pl.id}
                  onClick={() => setSelectedPlaylistId(pl.spotifyId)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between group ${
                    selectedPlaylistId === pl.spotifyId
                      ? 'bg-[#1DB954]/15 border-[#1DB954] text-white shadow-lg'
                      : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl group-hover:scale-110 transition-transform shrink-0">{pl.icon}</span>
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-[#1DB954] transition-colors truncate">
                        {pl.nombre}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {pl.descripcion}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {selectedPlaylistId === pl.spotifyId ? (
                      <span className="px-2 py-0.5 rounded-full bg-[#1DB954]/20 text-[#1DB954] text-[10px] font-bold border border-[#1DB954]/40">
                        Reproduciendo
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500 group-hover:text-white transition-colors font-semibold">
                        Elegir
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Pegar tu propia Playlist de Spotify */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-[#1DB954]" />
                <span>¿Tienes tu propia Playlist favorita?</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Pega el link</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
                placeholder="https://open.spotify.com/playlist/..."
                className="flex-1 bg-slate-900 border border-slate-800 focus:border-[#1DB954] text-white rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
              <button
                onClick={handleSaveCustomPlaylist}
                disabled={!customUrlInput.trim()}
                className="px-3.5 py-2 rounded-xl bg-[#1DB954] hover:bg-[#1ed760] disabled:opacity-30 text-black font-black text-xs transition-all active:scale-95 shrink-0"
              >
                Guardar
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
