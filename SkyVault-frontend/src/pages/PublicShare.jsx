import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { shareAPI, fileAPI } from '../lib/api';
import { formatFileSize, formatDate } from "../lib/utils";
import { Download, Lock, Cloud, FileText, Folder, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const PublicShare = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [resource, setResource] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      loadResource();
    }
  }, [token]);

  const loadResource = async (pwd = '') => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await shareAPI.accessPublicLink(token, pwd);
      
      if (data.requiresPassword) {
        setRequiresPassword(true);
        setLoading(false);
        return;
      }

      setResource(data);
      setRequiresPassword(false);
    } catch (err) {
      if (err.response?.data?.requiresPassword) {
        setRequiresPassword(true);
      } else {
        setError(err.response?.data?.message || 'Link is invalid or expired');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    loadResource(password);
  };

  const handleDownload = async () => {
    try {
      // For public downloads, we use the token
      const { data } = await fileAPI.downloadFile(resource.resource.id);
      window.open(data.url, '_blank');
    } catch (err) {
      toast.error('Failed to download');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Error</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <a href="/" className="btn btn-primary w-full">Go to Homepage</a>
        </div>
      </div>
    );
  }

  if (requiresPassword) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Password Required</h1>
            <p className="text-gray-600 mt-2">This link is password protected</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="input text-center text-lg tracking-widest"
              autoFocus
            />
            <button type="submit" className="w-full btn btn-primary py-3">
              Access Resource
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (resource) {
    const isFile = resource.type === 'file';
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cloud className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">CloudDrive</span>
            </div>
            <div className="text-sm text-gray-500">
              Shared by <span className="font-semibold text-gray-900">{resource.owner.name}</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-5xl mx-auto px-6 py-12">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Resource Info */}
            <div className="p-8 border-b border-gray-100">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  {isFile ? (
                    <FileText className="w-10 h-10 text-gray-400" />
                  ) : (
                    <Folder className="w-10 h-10 text-blue-400" />
                  )}
                </div>
                <div className="flex-1 text-center md:text-left min-w-0">
                  <h1 className="text-2xl font-bold text-gray-900 truncate mb-1">
                    {resource.resource.name}
                  </h1>
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 text-sm text-gray-500">
                    <span>{isFile ? formatFileSize(resource.resource.size_bytes) : 'Folder'}</span>
                    <span>•</span>
                    <span>Uploaded {formatDate(resource.resource.created_at)}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  {isFile && (
                    <button
                      onClick={handleDownload}
                      className="btn btn-primary px-8 py-3 flex items-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Download
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Preview or folder contents */}
            <div className="p-8">
              {isFile ? (
                <div className="text-center">
                  <p className="text-gray-600 mb-6">
                    Click the download button above to save this file
                  </p>
                  {resource.resource.mime_type?.startsWith('image/') && resource.downloadUrl && (
                    <img
                      src={resource.downloadUrl}
                      alt={resource.resource.name}
                      className="max-w-full h-auto mx-auto rounded-lg shadow-md"
                    />
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-600">
                  <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p>This is a shared folder</p>
                  <p className="text-sm mt-2">
                    Folder contents viewing is not yet implemented
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600">
              Powered by CloudDrive - Secure file sharing
            </p>
          </div>
        </main>
      </div>
    );
  }

  return null;
};

export default PublicShare;