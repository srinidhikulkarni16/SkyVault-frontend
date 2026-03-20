import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { shareAPI, fileAPI } from '../lib/api';
import { formatFileSize, formatDate } from '../lib/utils';
import { Download, Lock, Cloud, AlertCircle, Folder, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import FileIcon from '../components/common/FileIcon';

const PublicShare = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [needsPwd, setNeedsPwd] = useState(false);
  const [password, setPassword] = useState('');
  const [resource, setResource] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => { if (token) loadResource(); }, [token]);

  const loadResource = async (pwd = '') => {
    setLoading(true); setError(null);
    try {
      const { data } = await shareAPI.accessPublicLink(token, pwd);
      if (data.requiresPassword) { setNeedsPwd(true); setLoading(false); return; }
      setResource(data); setNeedsPwd(false);
    } catch (err) {
      if (err.response?.data?.requiresPassword) setNeedsPwd(true);
      else setError(err.response?.data?.message || 'This link is invalid or has expired');
    } finally { setLoading(false); }
  };

  const handleDownload = async () => {
    try {
      const { data } = await fileAPI.downloadFile(resource.resource.id);
      window.open(data.url, '_blank');
      toast.success('Download started');
    } catch { toast.error('Download failed'); }
  };

  /*  Loading State  */
  if (loading) return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center gap-4">
      <Loader2 size={40} className="text-lime-800 animate-spin" />
      <p className="text-stone-500 font-medium animate-pulse">Securing your connection...</p>
    </div>
  );

  /*  Error State  */
  if (error) return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-6">
      <div className="bg-white border border-stone-200 rounded-3xl p-10 max-w-sm w-full text-center shadow-xl shadow-stone-200/50">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={32} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Link Expired</h2>
        <p className="text-stone-500 text-sm mb-8 leading-relaxed">{error}</p>
        <Link to="/"
          className="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-bold transition-all active:scale-[0.98]">
          Return Home
        </Link>
      </div>
    </div>
  );

  /*  Password Gate  */
  if (needsPwd) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 selection:bg-lime-800 selection:text-white">
      <div className="bg-white border border-stone-200 rounded-3xl p-8 sm:p-12 max-w-md w-full shadow-2xl shadow-stone-200/60 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-lime-700"></div>
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-lime-50 flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Lock size={28} className="text-lime-800" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 mb-2 tracking-tight">Protected Content</h2>
          <p className="text-stone-500 font-medium">Please enter the access code provided by the owner.</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); loadResource(password); }} className="space-y-4">
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Access Code" autoFocus
            className="w-full px-4 py-4 text-lg text-center tracking-[0.5em] rounded-2xl border border-stone-200 bg-stone-50 text-stone-900 placeholder-stone-300 outline-none focus:ring-4 focus:ring-lime-700/10 focus:border-lime-700 transition-all font-mono"
          />
          <button type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-lime-800 hover:bg-lime-900 text-white text-base font-bold transition-all shadow-lg shadow-lime-900/20 active:scale-[0.98]">
            Access File
          </button>
        </form>
      </div>
    </div>
  );

  if (!resource) return null;
  const isFile = resource.type === 'file';

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 selection:bg-lime-800 selection:text-white font-sans">
      {/* Refined Navigation */}
      <header className="bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200 px-6 sm:px-10 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-lime-800 flex items-center justify-center shadow-md">
            <Cloud size={18} className="text-white" />
          </div>
          <span className="font-black text-lg tracking-tighter uppercase text-stone-900">SkyVault</span>
        </div>
        <div className="flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-full border border-stone-200">
           <div className="w-5 h-5 rounded-full bg-stone-300 flex items-center justify-center text-[10px] font-bold text-stone-600 capitalize">
             {resource.owner?.name?.[0]}
           </div>
           <p className="text-xs font-semibold text-stone-600">
             Shared by <span className="text-stone-900">{resource.owner?.name}</span>
           </p>
        </div>
      </header>

      {/* Hero Content Section */}
      <main className="max-w-3xl mx-auto py-12 px-6">
        <div className="bg-white border border-stone-200 rounded-[2rem] overflow-hidden shadow-2xl shadow-stone-200/40">
          
          {/* Header Area */}
          <div className="px-8 py-8 sm:px-10 border-b border-stone-100 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-20 h-20 rounded-3xl bg-stone-50 border border-stone-100 flex items-center justify-center shrink-0 shadow-sm group hover:scale-105 transition-transform duration-300">
              {isFile
                ? <FileIcon mimeType={resource.resource.mime_type} name={resource.resource.name} size={40} />
                : <Folder size={40} className="text-lime-700" />
              }
            </div>
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-stone-900 truncate mb-2 leading-tight">
                {resource.resource.name}
              </h1>
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-3 gap-y-1 text-sm font-medium text-stone-400">
                <span className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md">
                  {isFile ? formatFileSize(resource.resource.size_bytes) : 'Folder'}
                </span>
                <span>•</span>
                <span>Shared {formatDate(resource.resource.created_at)}</span>
              </div>
            </div>
            {isFile && (
              <button onClick={handleDownload}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-lime-800 hover:bg-lime-900 text-white text-sm font-bold transition-all shadow-lg shadow-lime-900/20 active:scale-95 shrink-0">
                <Download size={18} /> Download
              </button>
            )}
          </div>

          {/* Dynamic Preview Canvas */}
          <div className="bg-stone-50/50 p-6 sm:p-10">
            <div className="bg-white rounded-2xl border border-stone-200/60 p-4 min-h-[300px] flex items-center justify-center relative overflow-hidden shadow-inner">
              {isFile ? (
                resource.resource.mime_type?.startsWith('image/') && resource.downloadUrl ? (
                  <img src={resource.downloadUrl} alt={resource.resource.name}
                    className="max-w-full h-auto rounded-lg shadow-md animate-in zoom-in-95 duration-500" />
                ) : (
                  <div className="text-center space-y-3">
                     <div className="w-16 h-16 rounded-full bg-stone-50 flex items-center justify-center mx-auto">
                        <ShieldCheck size={32} className="text-stone-300" />
                     </div>
                     <p className="text-stone-400 font-medium">Security Preview: No visual available</p>
                  </div>
                )
              ) : (
                <div className="text-center space-y-2">
                  <Folder size={48} className="text-stone-200 mx-auto" />
                  <p className="text-stone-400 font-medium">Folder structure is private</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Brand Footer */}
        <div className="mt-12 text-center">
           <div className="inline-flex items-center gap-4 px-6 py-3 bg-stone-200/50 rounded-full border border-stone-200">
             <p className="text-[11px] font-bold text-stone-500 uppercase tracking-widest">
               Powered by <Link to="/" className="text-lime-800 hover:text-lime-900 transition-colors">SkyVault</Link> Secure Relay
             </p>
           </div>
        </div>
      </main>
    </div>
  );
};

export default PublicShare;