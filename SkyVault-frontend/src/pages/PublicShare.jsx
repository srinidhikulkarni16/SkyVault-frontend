import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { shareAPI, fileAPI } from '../lib/api';
import { formatFileSize, formatDate } from '../lib/utils';
import { Download, Lock, Cloud, AlertCircle, Folder } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import FileIcon from '../components/common/FileIcon';

const PublicShare = () => {
  const { token } = useParams();
  const [loading,   setLoading]   = useState(true);
  const [needsPwd,  setNeedsPwd]  = useState(false);
  const [password,  setPassword]  = useState('');
  const [resource,  setResource]  = useState(null);
  const [error,     setError]     = useState(null);

  useEffect(() => { if (token) loadResource(); }, [token]);

  const loadResource = async (pwd = '') => {
    setLoading(true); setError(null);
    try {
      const { data } = await shareAPI.accessPublicLink(token, pwd);
      if (data.requiresPassword) { setNeedsPwd(true); setLoading(false); return; }
      setResource(data);
      setNeedsPwd(false);
    } catch (err) {
      if (err.response?.data?.requiresPassword) setNeedsPwd(true);
      else setError(err.response?.data?.message || 'Link is invalid or has expired');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const { data } = await fileAPI.downloadFile(resource.resource.id);
      window.open(data.url, '_blank');
    } catch { toast.error('Download failed'); }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={32} style={{ color: 'var(--brand)', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-0)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '40px 36px', maxWidth: 400, width: '100%', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,85,85,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <AlertCircle size={28} style={{ color: 'var(--danger)' }} />
        </div>
        <h2 style={{ fontSize: '1.25rem', marginBottom: 8 }}>Link Unavailable</h2>
        <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', marginBottom: 24 }}>{error}</p>
        <a href="/" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>Go to Homepage</a>
      </div>
    </div>
  );

  if (needsPwd) return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-0)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '40px 36px', maxWidth: 400, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(79,110,247,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
            <Lock size={24} style={{ color: 'var(--brand)' }} />
          </div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: 6 }}>Password Required</h2>
          <p style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>This link is password-protected</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); loadResource(password); }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" className="input" autoFocus style={{ textAlign: 'center', letterSpacing: '0.15em' }} />
          <button type="submit" className="btn btn-primary btn-lg">Access File</button>
        </form>
      </div>
    </div>
  );

  if (!resource) return null;
  const isFile = resource.type === 'file';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-0)' }}>
      {/* Nav */}
      <header style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--border)', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Cloud size={15} color="#fff" />
          </div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem' }}>SkyVault</span>
        </div>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-3)' }}>
          Shared by <span style={{ color: 'var(--text-1)', fontWeight: 500 }}>{resource.owner?.name}</span>
        </p>
      </header>

      {/* Content */}
      <main style={{ maxWidth: 700, margin: '40px auto', padding: '0 20px' }}>
        <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
          <div style={{ padding: '28px 32px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-lg)', background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {isFile
                ? <FileIcon mimeType={resource.resource.mime_type} name={resource.resource.name} size={32} />
                : <Folder size={32} style={{ color: 'var(--brand)' }} />
              }
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 className="truncate" style={{ fontSize: '1.25rem', marginBottom: 6 }}>{resource.resource.name}</h1>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-3)' }}>
                {isFile ? formatFileSize(resource.resource.size_bytes) : 'Folder'} · Shared {formatDate(resource.resource.created_at)}
              </p>
            </div>
            {isFile && (
              <button className="btn btn-primary" onClick={handleDownload}>
                <Download size={15} /> Download
              </button>
            )}
          </div>

          <div style={{ padding: '28px 32px' }}>
            {isFile ? (
              resource.resource.mime_type?.startsWith('image/') && resource.downloadUrl ? (
                <img src={resource.downloadUrl} alt={resource.resource.name} style={{ maxWidth: '100%', height: 'auto', borderRadius: 'var(--radius-md)' }} />
              ) : (
                <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', textAlign: 'center' }}>Click Download to save this file</p>
              )
            ) : (
              <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', textAlign: 'center' }}>Folder contents not available in public view</p>
            )}
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-3)', marginTop: 20 }}>
          Powered by <a href="/" style={{ color: 'var(--brand-light)', textDecoration: 'none' }}>SkyVault</a> — Secure file sharing
        </p>
      </main>
    </div>
  );
};

export default PublicShare;