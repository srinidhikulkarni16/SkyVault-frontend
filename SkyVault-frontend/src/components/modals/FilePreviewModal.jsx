import React, { useState, useEffect } from 'react';
import { X, Download, Share2, Loader2, ZoomIn, ZoomOut, EyeOff } from 'lucide-react';
import { fileAPI } from '../../lib/api';
import { formatFileSize, formatDate, isPreviewable } from '../../lib/utils';
import FileIcon from '../common/FileIcon';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';

const FilePreviewModal = ({ isOpen, onClose, file, onDownload, onShare }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (isOpen && file && isPreviewable(file.mime_type)) loadPreview();
    else setPreviewUrl(null);

    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      setZoom(1);
    };
  }, [isOpen, file]);

  const loadPreview = async () => {
    setLoading(true);
    try {
      const { data } = await fileAPI.downloadFile(file.id);
      setPreviewUrl(data.url);
    } catch {
      toast.error('Failed to load preview');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !file) return null;

  const canPreview = isPreviewable(file.mime_type);
  const isImage = file.mime_type?.startsWith('image/');
  const isPdf = file.mime_type === 'application/pdf';
  const isText = file.mime_type?.startsWith('text/');

  return (
    <div
      className="fixed inset-0 z-[300] flex flex-col bg-stone-950/90 backdrop-blur-2xl animate-in fade-in duration-300"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Top Bar - Glassmorphism Organic Style */}
      <div className="flex items-center gap-4 px-6 h-20 bg-stone-900/40 border-b border-white/5 shrink-0 backdrop-blur-md">
        <button
          onClick={onClose}
          title="Close (Esc)"
          className="flex items-center justify-center w-10 h-10 rounded-2xl text-stone-400 hover:text-white hover:bg-white/10 transition-all active:scale-90"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="p-2 bg-white/5 rounded-xl border border-white/10 hidden xs:block">
            <FileIcon mimeType={file.mime_type} name={file.name} size={20} />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-white truncate tracking-tight">{file.name}</h2>
            <p className="text-[11px] font-medium text-stone-500 uppercase tracking-widest">
              {formatFileSize(file.size_bytes)} • {formatDate(file.updated_at || file.created_at)}
            </p>
          </div>
        </div>

        {/* Zoom Controls */}
        {isImage && previewUrl && (
          <div className="hidden md:flex items-center gap-2 bg-stone-800/50 border border-white/10 rounded-2xl px-2 py-1.5">
            <button
              onClick={() => setZoom((z) => Math.max(0.25, z - 0.25))}
              className="w-8 h-8 flex items-center justify-center rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ZoomOut size={16} />
            </button>
            <span className="text-xs text-white min-w-[45px] text-center font-black">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(4, z + 0.25))}
              className="w-8 h-8 flex items-center justify-center rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ZoomIn size={16} />
            </button>
          </div>
        )}

        <div className="flex gap-3 shrink-0 ml-4">
          <button
            onClick={() => onShare(file)}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-white/10 bg-white/5 text-stone-300 hover:text-white hover:bg-white/10 text-xs font-bold transition-all active:scale-95"
          >
            <Share2 size={14} /> Share
          </button>
          <button
            onClick={() => onDownload(file)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-lime-800 hover:bg-lime-900 text-white text-xs font-black transition-all active:scale-95 shadow-lg shadow-lime-900/20"
          >
            <Download size={14} /> Download
          </button>
        </div>
      </div>

      {/* Preview Stage */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-8 lg:p-12 relative">
        {loading ? (
          <div className="flex flex-col items-center gap-4 animate-pulse">
            <div className="p-4 rounded-3xl bg-lime-800/20">
              <Loader2 size={32} className="text-lime-500 animate-spin" strokeWidth={2.5} />
            </div>
            <p className="text-sm font-bold text-stone-400 uppercase tracking-widest">Generating Preview...</p>
          </div>
        ) : canPreview && previewUrl ? (
          <div className="relative group flex items-center justify-center">
            {isImage && (
              <img
                src={previewUrl}
                alt={file.name}
                className="max-w-full max-h-[75vh] object-contain rounded-[2rem] shadow-2xl transition-transform duration-300 ease-out border-4 border-white/5"
                style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
              />
            )}
            {isPdf && (
              <iframe
                src={previewUrl}
                title={file.name}
                className="w-full max-w-5xl h-[75vh] border-0 rounded-[2.5rem] bg-stone-100 shadow-2xl"
              />
            )}
            {isText && (
              <div className="w-full max-w-4xl bg-stone-900 border border-white/10 rounded-[2.5rem] p-8 max-h-[75vh] overflow-auto shadow-2xl">
                <iframe
                  src={previewUrl}
                  title={file.name}
                  className="w-full h-[60vh] border-0 bg-transparent text-stone-300"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center max-w-sm animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 rounded-[2rem] bg-stone-900 border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-xl">
              <EyeOff size={40} className="text-stone-700" />
            </div>
            <h3 className="text-lg font-black text-white mb-2 tracking-tight">Preview Restricted</h3>
            <p className="text-sm font-medium text-stone-500 mb-8 leading-relaxed">
              This file type's earthy layers can't be rendered in the browser just yet.
            </p>
            <button
              onClick={() => onDownload(file)}
              className="flex items-center gap-3 mx-auto px-8 py-3.5 rounded-2xl bg-lime-800 hover:bg-lime-900 text-white text-sm font-black transition-all active:scale-95 shadow-xl shadow-lime-950/40"
            >
              <Download size={18} strokeWidth={2.5} /> Download to View
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilePreviewModal;