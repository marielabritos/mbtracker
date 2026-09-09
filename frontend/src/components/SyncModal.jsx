import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Smartphone, Monitor, Download, Upload, Sparkles, CheckCircle2, MessageSquare, ArrowRightLeft, ShieldCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { compactPayload, expandPayload } from '../utils/syncCompressor';

function SafeQRCode({ value, size = 190 }) {
  // Los códigos QR estándar tienen límite estricto de capacidad. Si el valor supera ~1800 caracteres, mostramos alternativa elegante
  if (!value || value.length > 1800) {
    return (
      <div className="w-48 h-48 sm:w-52 sm:h-52 p-4 text-center text-xs text-slate-700 bg-slate-100 rounded-3xl flex flex-col items-center justify-center space-y-2.5 shadow-inner border border-slate-300">
        <div className="w-10 h-10 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-600">
          <Smartphone className="w-5 h-5" />
        </div>
        <div className="font-black text-slate-900 text-xs">Historial completo listo</div>
        <p className="text-[11px] text-slate-600 leading-tight">
          Toca <strong>Copiar Enlace Directo</strong> o <strong>WhatsApp</strong> abajo para transferir todo con 1 toque.
        </p>
      </div>
    );
  }

  try {
    return (
      <QRCodeSVG
        value={value}
        size={size}
        level="L"
        includeMargin={false}
      />
    );
  } catch (e) {
    return (
      <div className="w-48 h-48 p-4 text-center text-xs text-slate-600 bg-slate-100 rounded-3xl flex flex-col items-center justify-center space-y-2">
        <p className="font-bold">Usa el Enlace Directo abajo</p>
      </div>
    );
  }
}

export default function SyncModal({ isOpen, onClose }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [importCodeText, setImportCodeText] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);
  const [syncUrl, setSyncUrl] = useState('');
  const [syncCode, setSyncCode] = useState('');
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      try {
        const rutinas = JSON.parse(localStorage.getItem('mbtracker_rutinas') || '[]');
        const sesiones = JSON.parse(localStorage.getItem('mbtracker_sesiones') || '[]');
        const perfil = JSON.parse(localStorage.getItem('mbtracker_perfil') || '{}');
        const prs = JSON.parse(localStorage.getItem('mbtracker_prs') || '[]');

        setSessionCount(sesiones.length);

        // Compactar datos con esquema ultra liviano
        const compact = compactPayload({
          rutinas,
          sesiones,
          perfil,
          prs
        });

        const jsonStr = JSON.stringify(compact);
        const base64 = btoa(unescape(encodeURIComponent(jsonStr)));
        setSyncCode(base64);

        const currentOrigin = window.location.origin;
        const fullUrl = `${currentOrigin}/?sync=${encodeURIComponent(base64)}`;
        setSyncUrl(fullUrl);
      } catch (e) {
        console.error("Error generating sync payload", e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    if (!syncUrl) return;
    navigator.clipboard.writeText(syncUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleCopyCode = () => {
    if (!syncCode) return;
    navigator.clipboard.writeText(syncCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleShareWhatsApp = () => {
    if (!syncUrl) return;
    const text = encodeURIComponent(`¡Hola! Aquí está mi sincronización de MBTracker para abrir en la computadora:\n${syncUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleManualImport = () => {
    if (!importCodeText.trim()) return alert("Por favor pega el código de sincronización");
    try {
      const cleanBase64 = importCodeText.trim().replace(/ /g, '+');
      const decodedJson = decodeURIComponent(escape(atob(cleanBase64)));
      const rawParsed = JSON.parse(decodedJson);
      const parsed = expandPayload(rawParsed);

      if (parsed.rutinas && Array.isArray(parsed.rutinas) && parsed.rutinas.length > 0) {
        const localRutinas = JSON.parse(localStorage.getItem('mbtracker_rutinas') || '[]');
        const rMap = new Map();
        localRutinas.forEach(r => {
          if (r.id) rMap.set(String(r.id), r);
        });
        parsed.rutinas.forEach(incoming => {
          const matchKey = Array.from(rMap.keys()).find(k => {
            const existing = rMap.get(k);
            return String(existing.id) === String(incoming.id) || 
                   (existing.nombre && incoming.nombre && existing.nombre.trim().toLowerCase() === incoming.nombre.trim().toLowerCase());
          });
          if (matchKey) {
            const existing = rMap.get(matchKey);
            rMap.set(matchKey, { ...existing, ...incoming });
          } else {
            rMap.set(String(incoming.id || Date.now() + Math.random()), incoming);
          }
        });
        const uniqueRutinas = Array.from(rMap.values());
        localStorage.setItem('mbtracker_rutinas', JSON.stringify(uniqueRutinas));
        localStorage.setItem('mbtracker_has_custom_rutinas', 'true');
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

      setImportSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (e) {
      alert("Código de sincronización inválido o incompleto: " + e.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl space-y-5 my-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-sky-500/15 border border-sky-500/30 text-sky-400">
              <ArrowRightLeft className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h3 className="font-black text-lg text-white">Sincronizar Celular ↔ Computadora</h3>
              <p className="text-xs text-sky-400 font-medium">Pasa tus entrenamientos, series e historial al instante</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. CELULAR -> COMPUTADORA (Opción Principal y más rápida) */}
        <div className="bg-gradient-to-br from-emerald-950/40 via-slate-950 to-slate-950 border border-emerald-500/30 rounded-2xl p-4 space-y-3 shadow-lg">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>1. Pasar de CELULAR a COMPUTADORA</span>
            </span>
            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/30">
              {sessionCount} entrenamientos
            </span>
          </div>
          
          <p className="text-xs text-slate-300 leading-relaxed">
            Para ver tu entrenamiento en la computadora después de entrenar en el gym:
          </p>

          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace Directo'}</span>
            </button>

            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="px-4 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              title="Enviarme enlace por WhatsApp"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Enviar a WhatsApp</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400">
            👉 Copia el enlace en tu celu, ábrelo en tu compu (por WhatsApp Web) ¡y tu historial aparecerá de inmediato!
          </p>
        </div>

        {/* 2. COMPUTADORA -> CELULAR (QR) */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
            <Monitor className="w-4 h-4" /> 2. Pasar de COMPUTADORA a CELULAR (QR)
          </div>
          <p className="text-xs text-slate-300">
            Abre la cámara de tu celular y apunta a este código QR para sincronizar:
          </p>

          <div className="flex justify-center p-3 sm:p-4 bg-white rounded-3xl w-fit mx-auto shadow-2xl border-4 border-white">
            <SafeQRCode value={syncUrl} size={190} />
          </div>
        </div>

        {/* 3. Pegar Código Manual */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-sky-400" /> 3. Pegar Código Manual
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1 transition-all"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copiado' : 'Copiar mi Código'}</span>
            </button>
          </div>

          <textarea
            placeholder="Pega aquí el código copiado de tu celular o computadora..."
            value={importCodeText}
            onChange={(e) => setImportCodeText(e.target.value)}
            rows={2}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-sky-500"
          />

          <button
            type="button"
            onClick={handleManualImport}
            disabled={!importCodeText.trim() || importSuccess}
            className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-30 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-500/20"
          >
            {importSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            <span>{importSuccess ? '¡Datos Importados! Recargando...' : 'Restaurar y Aplicar en este dispositivo'}</span>
          </button>
        </div>

        {/* Botón Cerrar */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition-all"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
