import React, { useState, useEffect } from 'react';
import { 
  X, Copy, Check, Smartphone, Monitor, Download, Upload, 
  Sparkles, CheckCircle2, MessageSquare, ArrowRightLeft, ShieldCheck, 
  CloudUpload, CloudDownload, RefreshCw, Loader2, Cloud
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { compactPayload, expandPayload } from '../utils/syncCompressor';
import { cloudSync } from '../services/cloudSyncService';

function SafeQRCode({ value, size = 180 }) {
  if (!value) return null;
  try {
    return (
      <QRCodeSVG
        value={value}
        size={size}
        level="M"
        includeMargin={false}
      />
    );
  } catch (e) {
    return (
      <div className="w-44 h-44 p-4 text-center text-xs text-slate-600 bg-slate-100 rounded-3xl flex flex-col items-center justify-center space-y-2">
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
  const [routineCount, setRoutineCount] = useState(0);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      try {
        const rutinas = JSON.parse(localStorage.getItem('mbtracker_rutinas') || '[]');
        const sesiones = JSON.parse(localStorage.getItem('mbtracker_sesiones') || '[]');
        setSessionCount(sesiones.length);
        setRoutineCount(rutinas.length);

        const currentOrigin = window.location.origin;
        const lastKey = localStorage.getItem('mbtracker_latest_sync_key') || 'cloud';
        setSyncCode(lastKey);
        setSyncUrl(`${currentOrigin}/?sync=${lastKey}`);
        setStatusMessage('');
      } catch (e) {
        console.error("Error reading storage for sync", e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 1. SUBIR ALMACENAMIENTO A LA NUBE
  const handleUploadToCloud = async () => {
    setIsUploading(true);
    setStatusMessage('Subiendo tus rutinas y entrenamientos a la nube...');
    try {
      const res = await cloudSync.pushToCloud();
      if (res && res.success) {
        const key = res.key || 'cloud';
        setSyncCode(key);
        const newUrl = `${window.location.origin}/?sync=${key}`;
        setSyncUrl(newUrl);
        setUploadSuccess(true);
        setStatusMessage('¡Subido a la nube con éxito! Ya puedes abrirlo en la computadora.');
        setTimeout(() => setUploadSuccess(false), 6000);
      } else {
        setStatusMessage('Error al subir: ' + (res.error || 'Revisa tu conexión'));
      }
    } catch (e) {
      setStatusMessage('Error de conexión al subir');
    } finally {
      setIsUploading(false);
    }
  };

  // 2. DESCARGAR DESDE LA NUBE
  const handleDownloadFromCloud = async () => {
    setIsDownloading(true);
    setStatusMessage('Descargando tus datos más recientes desde la nube...');
    try {
      const res = await cloudSync.pullFromCloud(true);
      if (res && res.success) {
        setDownloadSuccess(true);
        setStatusMessage(`¡Sincronizado! Se cargaron ${res.sesionesCount || 0} entrenamientos. Recargando...`);
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        setStatusMessage('No se encontraron nuevos datos o hubo un error al descargar.');
      }
    } catch (e) {
      setStatusMessage('Error al conectar con la nube.');
    } finally {
      setIsDownloading(false);
    }
  };

  // 3. ENVIAR POR WHATSAPP (Sube a la nube y envía enlace ultracorto)
  const handleShareWhatsApp = async () => {
    setIsUploading(true);
    setStatusMessage('Generando enlace ultracorto para WhatsApp...');
    try {
      const res = await cloudSync.pushToCloud();
      const key = (res && res.key) ? res.key : (localStorage.getItem('mbtracker_latest_sync_key') || 'cloud');
      const shortUrl = `${window.location.origin}/?sync=${key}`;
      setSyncUrl(shortUrl);
      setSyncCode(key);
      const text = encodeURIComponent(`¡Hola! Aquí está mi entrenamiento de MBTracker para abrir en la computadora:\n${shortUrl}`);
      window.open(`https://wa.me/?text=${text}`, '_blank');
      setStatusMessage('¡Enlace enviado a WhatsApp!');
    } catch (e) {
      const fallbackUrl = `${window.location.origin}/?sync=cloud`;
      const text = encodeURIComponent(`¡Hola! Aquí está mi entrenamiento de MBTracker para abrir en la computadora:\n${fallbackUrl}`);
      window.open(`https://wa.me/?text=${text}`, '_blank');
    } finally {
      setIsUploading(false);
    }
  };

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

  const handleManualImport = async () => {
    const rawText = importCodeText.trim();
    if (!rawText) return alert("Por favor pega el código o enlace de sincronización");

    let code = rawText;
    if (rawText.includes('sync=')) {
      try {
        const u = new URL(rawText);
        code = u.searchParams.get('sync') || rawText;
      } catch (err) {
        const match = rawText.match(/sync=([^&#\s]+)/);
        if (match) code = match[1];
      }
    }

    // Si es una clave corta de la nube
    if (code === 'cloud' || (code.length >= 6 && code.length <= 25 && !code.includes('{') && !code.includes('='))) {
      setIsDownloading(true);
      setStatusMessage('Descargando datos del código desde la nube...');
      try {
        const res = await cloudSync.pullFromCloud(true, code === 'cloud' ? null : code);
        if (res && res.success) {
          setImportSuccess(true);
          setStatusMessage(`¡Sincronizado con éxito! Cargando datos...`);
          setTimeout(() => window.location.reload(), 1000);
          return;
        } else {
          alert("No se encontró ese código en la nube. Verifica que esté bien copiado.");
        }
      } catch (e) {
        alert("Error al descargar desde la nube: " + e.message);
      } finally {
        setIsDownloading(false);
      }
      return;
    }

    // Si es base64 legacy
    try {
      const cleanBase64 = code.replace(/ /g, '+');
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
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl space-y-4 my-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-sky-500/15 border border-sky-500/30 text-sky-400">
              <Cloud className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h3 className="font-black text-lg text-white">Sincronización en la Nube</h3>
              <p className="text-xs text-sky-400 font-medium">Conecta tu Celular y tu Computadora al instante</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notificación de estado */}
        {statusMessage && (
          <div className="p-2.5 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-200 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <Sparkles className="w-4 h-4 text-sky-400 flex-shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* 1. SECCIÓN PRINCIPAL: SINCRONIZACIÓN EN 1 TOQUE (NUBE) */}
        <div className="bg-gradient-to-br from-sky-950/40 via-slate-950 to-slate-950 border border-sky-500/30 rounded-2xl p-4 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>1. Sincronización Directa</span>
            </span>
            <span className="text-[10px] font-bold bg-sky-500/20 text-sky-300 px-2.5 py-0.5 rounded-full border border-sky-500/30">
              {sessionCount} entrenamientos en este equipo
            </span>
          </div>

          <p className="text-xs text-slate-300">
            Pasa tus entrenamientos entre celular y compu sin tener que lidiar con enlaces largos rotos:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {/* Botón Subir Celular */}
            <button
              type="button"
              onClick={handleUploadToCloud}
              disabled={isUploading}
              className="px-4 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all text-center"
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : uploadSuccess ? (
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
              ) : (
                <CloudUpload className="w-4 h-4" />
              )}
              <span>{uploadSuccess ? '¡Subido a la Nube!' : '☁️ 1. Subir a la Nube'}</span>
            </button>

            {/* Botón Descargar en Computadora */}
            <button
              type="button"
              onClick={handleDownloadFromCloud}
              disabled={isDownloading}
              className="px-4 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 active:scale-95 transition-all text-center"
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : downloadSuccess ? (
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
              ) : (
                <CloudDownload className="w-4 h-4" />
              )}
              <span>{downloadSuccess ? '¡Descargado!' : '💻 2. Descargar en PC'}</span>
            </button>
          </div>
          
          <p className="text-[11px] text-slate-400 italic">
            💡 En el gym: toca <strong>"1. Subir a la Nube"</strong> en el celu. En casa: abre la compu y toca <strong>"2. Descargar en PC"</strong>.
          </p>
        </div>

        {/* 2. ENVIAR ENLACE CORTO POR WHATSAPP */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>2. Enlace Corto para WhatsApp</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              Ultracorto (&lt; 60 letras)
            </span>
          </div>

          <p className="text-xs text-slate-300">
            Sube tu historial y genera un link corto inmune a los recortes de WhatsApp:
          </p>

          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              type="button"
              onClick={handleShareWhatsApp}
              disabled={isUploading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-black flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Enviar Enlace a WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? '¡Copiado!' : 'Copiar Enlace'}</span>
            </button>
          </div>
        </div>

        {/* 3. ESCANEAR CÓDIGO QR */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
            <Monitor className="w-4 h-4" /> 3. Escaneo Directo con Cámara (QR)
          </div>
          <p className="text-xs text-slate-300">
            Apunta la cámara de tu celular a la pantalla para abrir la sincronización al instante:
          </p>

          <div className="flex justify-center p-3 bg-white rounded-3xl w-fit mx-auto shadow-2xl border-4 border-white">
            <SafeQRCode value={syncUrl} size={170} />
          </div>
        </div>

        {/* 4. CÓDIGO MANUAL DE 10 LETRAS O RESTAURAR */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-sky-400" /> 4. Código Manual
            </span>
            {syncCode && (
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1 transition-all"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Código: <span className="font-mono text-sky-400 font-bold">{syncCode}</span></span>
              </button>
            )}
          </div>

          <textarea
            placeholder="Pega aquí el código corto de 10 caracteres o el enlace recibido..."
            value={importCodeText}
            onChange={(e) => setImportCodeText(e.target.value)}
            rows={2}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-sky-500"
          />

          <button
            type="button"
            onClick={handleManualImport}
            disabled={!importCodeText.trim() || importSuccess || isDownloading}
            className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-30 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-500/20"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : importSuccess ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{importSuccess ? '¡Datos Importados! Recargando...' : 'Restaurar y Aplicar en este equipo'}</span>
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
