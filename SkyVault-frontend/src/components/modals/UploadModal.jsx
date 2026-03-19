import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, CheckCircle, AlertCircle, File } from 'lucide-react';
import { fileAPI } from '../../lib/api';
import { formatFileSize } from '../../lib/utils';
import FileIcon from '../common/FileIcon';

const STATUS_ICON = {
  completed: <CheckCircle size={15} style={{ color: 'var(--success)' }} />,
  error:     <AlertCircle size={15} style={{ color: 'var(--danger)' }} />,
};

const UploadModal = ({ isOpen, onClose, folderId, onUploadComplete }) => {
  const [uploads, setUploads] = useState([]);

  const uploadFile = useCallback(async (upload) => {
    setUploads((p) => p.map((u) => u.id === upload.id ? { ...u, status: 'uploading' } : u));
    const fd = new FormData();
    fd.append('file', upload.file);
    if (folderId) fd.append('folder_id', folderId);
    try {
      await fileAPI.uploadFile(fd, (ev) => {
        const progress = Math.round((ev.loaded * 100) / ev.total);
        setUploads((p) => p.map((u) => u.id === upload.id ? { ...u, progress } : u));
      });
      setUploads((p) => p.map((u) => u.id === upload.id ? { ...u, status: 'completed', progress: 100 } : u));
      onUploadComplete?.();
    } catch (err) {
      setUploads((p) => p.map((u) => u.id === upload.id ? { ...u, status: 'error', error: err.response?.data?.message || 'Upload failed' } : u));
    }
  }, [folderId, onUploadComplete]);

  const onDrop = useCallback((files) => {
    const newUploads = files.map((file) => ({
      id: `${Date.now()}-${Math.random()}`, file, progress: 0, status: 'pending', error: null,
    }));
    setUploads((p) => [...p, ...newUploads]);
    newUploads.forEach(uploadFile);
  }, [uploadFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleClose = () => { setUploads([]); onClose(); };

  const allDone = uploads.length > 0 && uploads.every((u) => u.status === 'completed' || u.status === 'error');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-card modal-card-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(79,110,247,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Upload size={16} style={{ color: 'var(--brand-light)' }} />
            </div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Upload Files</h2>
          </div>
          <button className="btn btn-icon btn-ghost" onClick={handleClose}><X size={16} /></button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`dropzone ${isDragActive ? 'active' : ''}`}
          >
            <input {...getInputProps()} />
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(79,110,247,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <Upload size={20} style={{ color: 'var(--brand)' }} />
            </div>
            <p style={{ fontWeight: 600, color: 'var(--text-1)', marginBottom: 4 }}>
              {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-3)' }}>or <span style={{ color: 'var(--brand-light)', cursor: 'pointer' }}>browse</span> to upload · up to 100 MB each</p>
          </div>

          {/* Upload list */}
          {uploads.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 240, overflowY: 'auto' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Uploads · {uploads.filter((u) => u.status === 'completed').length}/{uploads.length}
              </p>
              {uploads.map((u) => (
                <div key={u.id} className="upload-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FileIcon mimeType={u.file.type} name={u.file.name} size={18} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="truncate" style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-1)' }}>{u.file.name}</p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>{formatFileSize(u.file.size)}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {STATUS_ICON[u.status]}
                      {u.status === 'uploading' && (
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--brand-light)', minWidth: 32, textAlign: 'right' }}>{u.progress}%</span>
                      )}
                      {u.status !== 'uploading' && (
                        <button className="btn btn-icon btn-ghost" style={{ padding: 3 }} onClick={() => setUploads((p) => p.filter((x) => x.id !== u.id))}>
                          <X size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                  {u.status === 'uploading' && (
                    <div style={{ marginTop: 8, height: 3, background: 'var(--surface-4)', borderRadius: 99, overflow: 'hidden' }}>
                      <div className="progress-bar" style={{ width: `${u.progress}%` }} />
                    </div>
                  )}
                  {u.status === 'error' && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: 4 }}>{u.error}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handleClose}>
            {allDone ? 'Done' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;