import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { fileAPI } from '../../lib/api';
import { formatFileSize, cn } from '../../lib/utils';
import FileIcon from '../common/FileIcon';

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
  const completedCount = uploads.filter((u) => u.status === 'completed').length;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-stone-900/40 backdrop-blur-md animate-in fade-in duration-300"
      onClick={handleClose}
    >
      <div
        className="bg-white border border-stone-200 rounded-[2.5rem] shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-stone-100 bg-stone-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-lime-800 flex items-center justify-center shrink-0 shadow-lg shadow-lime-900/20">
              <Upload size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-base font-black text-stone-900 tracking-tight">Upload to Vault</h2>
          </div>
          <button
            onClick={handleClose}
            className="flex items-center justify-center w-8 h-8 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-200 transition-all active:scale-90"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-8 flex flex-col gap-6 overflow-y-auto max-h-[60vh]">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={cn(
              "group relative flex flex-col items-center justify-center text-center py-10 px-6 rounded-[2rem] border-2 border-dashed transition-all duration-300",
              isDragActive
                ? "border-lime-800 bg-lime-50/50 scale-[0.98]"
                : "border-stone-200 bg-stone-50/30 hover:border-lime-700 hover:bg-stone-50"
            )}
          >
            <input {...getInputProps()} />
            <div className="w-14 h-14 rounded-[1.25rem] bg-lime-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Upload size={24} className="text-lime-800" strokeWidth={2.5} />
            </div>
            <p className="text-sm font-black text-stone-900 mb-1">
              {isDragActive ? 'Release to secure' : 'Drag & drop into vault'}
            </p>
            <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">
              or <span className="text-lime-800 hover:underline cursor-pointer">browse local files</span>
            </p>
          </div>

          {/* Upload list */}
          {uploads.length > 0 && (
            <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between px-1">
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">
                  Queue progress · {completedCount}/{uploads.length}
                </p>
              </div>
              
              <div className="flex flex-col gap-3">
                {uploads.map((u) => (
                  <div key={u.id} className="bg-white border border-stone-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 scale-90">
                        <FileIcon mimeType={u.file.type} name={u.file.name} size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-stone-900 truncate tracking-tight">{u.file.name}</p>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">{formatFileSize(u.file.size)}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {u.status === 'completed' && <CheckCircle size={16} className="text-lime-600" strokeWidth={2.5} />}
                        {u.status === 'error' && <AlertCircle size={16} className="text-red-500" strokeWidth={2.5} />}
                        {u.status === 'uploading' && (
                          <div className="flex items-center gap-2">
                            <Loader2 size={14} className="animate-spin text-lime-800" />
                            <span className="text-[11px] font-black text-lime-800">
                              {u.progress}%
                            </span>
                          </div>
                        )}
                        {u.status !== 'uploading' && (
                          <button
                            onClick={() => setUploads((p) => p.filter((x) => x.id !== u.id))}
                            className="flex items-center justify-center w-6 h-6 rounded-lg text-stone-300 hover:text-stone-900 hover:bg-stone-100 transition-all"
                          >
                            <X size={14} strokeWidth={2.5} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Progress bar */}
                    {u.status === 'uploading' && (
                      <div className="mt-3 h-1.5 bg-stone-100 rounded-full overflow-hidden shadow-inner">
                        <div
                          className="h-full bg-lime-800 rounded-full transition-all duration-300"
                          style={{ width: `${u.progress}%` }}
                        />
                      </div>
                    )}

                    {u.status === 'error' && (
                      <p className="text-[10px] font-bold text-red-500 mt-2 uppercase tracking-tight italic bg-red-50 px-2 py-1 rounded-lg border border-red-100">
                        {u.error}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end px-8 py-6 border-t border-stone-100 bg-stone-50/50 shrink-0">
          <button
            onClick={handleClose}
            className="px-8 py-3 rounded-2xl bg-stone-900 text-white hover:bg-black text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 shadow-stone-900/20"
          >
            {allDone ? 'Back to Vault' : 'Cancel Queue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;