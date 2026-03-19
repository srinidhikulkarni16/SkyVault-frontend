import React, { useState, useEffect } from 'react';
import { X, Download, Share2, Loader2, FileText, ZoomIn, ZoomOut } from 'lucide-react';
import { fileAPI } from '../../lib/api';
import { formatFileSize, formatDate, isPreviewable } from '../../lib/utils';
import FileIcon from '../common/FileIcon';
import toast from 'react-hot-toast';

const FilePreviewModal = ({ isOpen, onClose, file, onDownload, onShare }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [zoom,       setZoom]       = useState(1);

  useEffect(() => {
    if (isOpen && file && isPreviewable(file.mime_type)) loadPreview();
    else setPreviewUrl(null);

    // keyboard close
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
  const isImage    = file.mime_type?.startsWith('image/');
  const isPdf      = file.mime_type === 'application/pdf';
  const isText     = file.mime_type?.startsWith('text/');

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(5,6,10,0.92)', backdropFilter: 'blur(16px)', display: 'flex', flexDirection: 'column', animation: 'modal-in 0.2s ease forwards' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: 'var(--surface-1)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <button className="btn btn-icon btn-ghost" onClick={onClose} title="Close (Esc)"><X size={18} /></button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
          <FileIcon mimeType={file.mime_type} name={file.name} size={20} />
          <div style={{ minWidth: 0 }}>
            <h2 className="truncate" style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-1)' }}>{file.name}</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>
              {formatFileSize(file.size_bytes)} · Modified {formatDate(file.updated_at || file.created_at)}
            </p>
          </div>
        </div>

        {/* Zoom controls for images */}
        {isImage && previewUrl && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button className="btn btn-icon btn-ghost" onClick={() => setZoom((z) => Math.max(0.25, z - 0.25))}><ZoomOut size={16} /></button>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-3)', minWidth: 40, textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
            <button className="btn btn-icon btn-ghost" onClick={() => setZoom((z) => Math.min(4, z + 0.25))}><ZoomIn size={16} /></button>
          </div>
        )}

        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => onShare(file)}>
            <Share2 size={13} /> Share
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => onDownload(file)}>
            <Download size={13} /> Download
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <Loader2 size={32} style={{ color: 'var(--brand)', animation: 'spin 1s linear infinite' }} />
            <p style={{ fontSize: '0.875rem', color: 'var(--text-3)' }}>Loading preview…</p>
          </div>
        ) : canPreview && previewUrl ? (
          <>
            {isImage && (
              <img
                src={previewUrl}
                alt={file.name}
                style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform 0.2s ease' }}
              />
            )}
            {isPdf && (
              <iframe
                src={previewUrl}
                title={file.name}
                style={{ width: '100%', maxWidth: 900, height: '80vh', border: 'none', borderRadius: 'var(--radius-md)', background: '#fff' }}
              />
            )}
            {isText && (
              <div style={{ width: '100%', maxWidth: 800, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24, maxHeight: '75vh', overflow: 'auto' }}>
                <iframe src={previewUrl} title={file.name} style={{ width: '100%', height: '60vh', border: 'none', background: 'transparent', color: 'var(--text-1)' }} />
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--surface-3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <FileIcon mimeType={file.mime_type} name={file.name} size={36} />
            </div>
            <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>Preview not available</p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-3)', marginBottom: 20 }}>This file type can't be previewed in the browser.</p>
            <button className="btn btn-primary" onClick={() => onDownload(file)}>
              <Download size={14} /> Download to view
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilePreviewModal;