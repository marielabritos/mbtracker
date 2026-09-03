import React, { useState, useEffect } from 'react';
import { X, QrCode, Copy, Check, Smartphone, Monitor, Download, Upload, Sparkles, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export default function SyncModal({ isOpen, onClose }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [importCodeText, setImportCodeText] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);
  const [syncUrl, setSyncUrl] = useState('');
  const [syncCode, setSyncCode] = useState('');
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    if (isOpen) {
      try {
        const rutinas = JSON.parse(localStorage.getItem('mbtracker_rutinas') || '[]');
        const sesiones = JSON.parse(localStorage.getItem('mbtracker_sesiones') || '[]');
        const perfil = JSON.parse(localStorage.getItem('mbtracker_perfil') || '{}');
        const prs = JSON.parse(localStorage.getItem('mbtracker_prs') || '[]');

        const payload = {
          rutinas,
          sesiones,
          perfil,
          prs,
          t: Date.now()
        };

        const jsonStr = JSON.stringify(payload);
        const base64 = btoa(unescape(encodeURIComponent(jsonStr)));
        setSyncCode(base64);

        const currentOrigin = window.location.origin;
        const fullUrl = `${currentOrigin}/?sync=${encodeURIComponent(base64)}`;
        setSyncUrl(fullUrl);

        // Generar QR usando quickchart / qrserver
        const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(fullUrl)}`;
        setQrUrl(qrImage);
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

  const handleManualImport = () => {
    if (!importCodeText.trim()) return alert("Por favor pega el código de sincronización");
    try {
      const decodedJson = decodeURIComponent(escape(atob(importCodeText.trim())));
      const parsed = JSON.parse(decodedJson);

      if (parsed.rutinas && Array.isArray(parsed.rutinas)) {
        localStorage.setItem('mbtracker_rutinas', JSON.stringify(parsed.rutinas));
      }
      if (parsed.sesiones && Array.isArray(parsed.sesiones)) {
        localStorage.setItem('mbtracker_sesiones', JSON.stringify(parsed.sesiones));
      }
      if (parsed.perfil) {
        localStorage.setItem('mbtracker_perfil', JSON.stringify(parsed.perfil));
      }
      if (parsed.prs) {
        localStorage.setItem('mbtracker_prs', JSON.stringify(parsed.prs));
      }

      setImportSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (e) {
      alert("Código de sincronización inválido o corrupto: " + e.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl space-y-5 my-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-sky-500/15 border border-sky-500/30 text-sky-400">
              <RefreshCw className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h3 className="font-black text-lg text-white">Sincronizar PC ↔ Celular</h3>
              <p className="text-xs text-sky-400 font-medium">Pasa todas tus rutinas y entrenamientos en 1 segundo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Opción 1: Código QR para escanear con el Celular */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
            <Smartphone className="w-4 h-4" /> Opción 1: Escanear con tu Celular
          </div>
          <p className="text-xs text-slate-300">
            Abre la cámara de tu celular y apunta a este código QR para abrir y actualizar tu app al instante:
          </p>

          <div className="flex justify-center p-3 bg-white rounded-2xl w-fit mx-auto shadow-xl">
            {qrUrl ? (
              <img src={qrUrl} alt="QR Sincronización" className="w-48 h-48 sm:w-52 sm:h-52 object-contain" />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-slate-400 text-xs">Generando QR...</div>
            )}
          </div>
        </div>

        {/* Opción 2: Copiar Enlace Directo */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Copy className="w-4 h-4" /> Opción 2: Enlace Directo
            </span>
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Puedes enviarte este enlace por WhatsApp o Telegram a tu celular y abrirlo con 1 toque.
          </p>
        </div>

        {/* Opción 3: Importar / Pegar Código Manual */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-sky-400" /> Opción 3: Pegar Código
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
            placeholder="Pega aquí el código copiado de tu computadora para restaurar tus rutinas..."
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
            {importSuccess ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
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
