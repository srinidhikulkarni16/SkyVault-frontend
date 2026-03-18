import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, File, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { fileAPI } from '../../lib/api';
import { formatFileSize } from '../../lib/utils';
import toast from 'react-hot-toast';

const UploadModal = ({ isOpen, onClose, folderId, onUploadComplete }) => {
  const [uploads, setUploads] = useState([]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const newUploads = acceptedFiles.map((file) => ({
        id: Math.random().toString(36),
        file,
        progress: 0,
        status: 'pending', // pending, uploading, completed, error
        error: null,
      }));

      setUploads((prev) => [...prev, ...newUploads]);

      // Start uploading each file
      newUploads.forEach((upload) => {
        uploadFile(upload);
      });
    },
    [folderId]
  );

  const uploadFile = async (upload) => {
    setUploads((prev) =>
      prev.map((u) =>
        u.id === upload.id ? { ...u, status: 'uploading' } : u
      )
    );

    const formData = new FormData();
    formData.append('file', upload.file);
    if (folderId) {
      formData.append('folder_id', folderId);
    }

    try {
      await fileAPI.uploadFile(formData, (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploads((prev) =>
          prev.map((u) => (u.id === upload.id ? { ...u, progress } : u))
        );
      });

      setUploads((prev) =>
        prev.map((u) =>
          u.id === upload.id ? { ...u, status: 'completed', progress: 100 } : u
        )
      );
      onUploadComplete();
    } catch (error) {
      setUploads((prev) =>
        prev.map((u) =>
          u.id === upload.id
            ? { ...u, status: 'error', error: error.response?.data?.message || 'Upload failed' }
            : u
        )
      );
    }
  };

  const removeUpload = (id) => {
    setUploads((prev) => prev.filter((u) => u.id !== id));
  };

  const handleClose = () => {
    setUploads([]);
    onClose();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={handleClose}>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-xl animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Upload Files</h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
              isDragActive
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-lg font-medium text-gray-900">
              {isDragActive ? 'Drop files here' : 'Click or drag files to upload'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Supports any file type up to 100MB
            </p>
          </div>

          {/* Upload List */}
          {uploads.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Uploads</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {uploads.map((upload) => (
                  <div
                    key={upload.id}
                    className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <File className="w-5 h-5 text-gray-400" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {upload.file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(upload.file.size)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {upload.status === 'completed' && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                        {upload.status === 'error' && (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        )}
                        {upload.status === 'uploading' && (
                          <span className="text-xs font-medium text-primary-600">
                            {upload.progress}%
                          </span>
                        )}
                        
                        {/* Remove Button */}
                        {upload.status !== 'uploading' && (
                          <button
                            onClick={() => removeUpload(upload.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {upload.status === 'uploading' && (
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="progress-bar"
                          style={{ width: `${upload.progress}%` }}
                        ></div>
                      </div>
                    )}

                    {/* Error Message */}
                    {upload.status === 'error' && (
                      <p className="text-xs text-red-600 mt-1">{upload.error}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button onClick={handleClose} className="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;