import React, { useState, useEffect } from 'react';
import { X, Download, Share2, Loader } from 'lucide-react';
import { fileAPI } from "../../lib/api";
import { formatFileSize, formatDate, isPreviewable } from "../../lib/utils";
import toast from 'react-hot-toast';

const FilePreviewModal = ({ isOpen, onClose, file, onDownload, onShare }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && file && isPreviewable(file.mime_type)) {
      loadPreview();
    }
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [isOpen, file]);

  const loadPreview = async () => {
    setLoading(true);
    try {
      const { data } = await fileAPI.downloadFile(file.id);
      setPreviewUrl(data.url);
    } catch (error) {
      toast.error('Failed to load preview');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !file) return null;

  const canPreview = isPreviewable(file.mime_type);
  const isImage = file.mime_type?.startsWith('image/');
  const isPdf = file.mime_type === 'application/pdf';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="w-full h-full flex flex-col animate-fade-in">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white border-b border-gray-800">
          <div className="flex items-center gap-4 min-w-0">
            <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <X className="w-6 h-6" />
            </button>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold truncate">{file.name}</h2>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>{formatFileSize(file.size_bytes)}</span>
                <span>•</span>
                <span>Modified {formatDate(file.updated_at)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onShare(file)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button
              onClick={() => onDownload(file)}
              className="p-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-hidden bg-gray-100 flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader className="w-8 h-8 text-primary-600 animate-spin" />
              <p className="text-sm text-gray-600">Loading preview...</p>
            </div>
          ) : canPreview && previewUrl ? (
            <div className="w-full h-full p-6 overflow-auto custom-scrollbar">
              {isImage && (
                <img
                  src={previewUrl}
                  alt={file.name}
                  className="max-w-full h-auto mx-auto rounded-lg shadow-lg"
                />
              )}
              {isPdf && (
                <iframe
                  src={previewUrl}
                  className="w-full h-full border-0 rounded-lg shadow-lg"
                  title={file.name}
                />
              )}
            </div>
          ) : (
            <div className="text-center p-8">
              <p className="text-gray-600 mb-4">Preview not available for this file type</p>
              <button onClick={() => onDownload(file)} className="btn btn-primary">
                <Download className="w-4 h-4 mr-2 inline" />
                Download to view
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;