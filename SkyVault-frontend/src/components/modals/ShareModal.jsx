import React, { useState, useEffect } from 'react';
import { X, Users, Mail, Globe, Lock, Calendar, Copy, Check, Trash2, Share2 } from 'lucide-react';
import { shareAPI } from '../../lib/api';
import { copyToClipboard } from '../../lib/utils';
import toast from 'react-hot-toast';

const ShareModal = ({ isOpen, onClose, item }) => {
  const [tab,       setTab]       = useState('users');
  const [email,     setEmail]     = useState('');
  const [role,      setRole]      = useState('viewer');
  const [shares,    setShares]    = useState({ userShares: [], linkShares: [] });
  const [loading,   setLoading]   = useState(false);
  const [linkPwd,   setLinkPwd]   = useState('');
  const [linkExp,   setLinkExp]   = useState('');
  const [copied,    setCopied]    = useState(null);

  useEffect(() => {
    if (isOpen && item) { loadShares(); setTab('users'); }
  }, [isOpen, item]);

  const loadShares = async () => {
    try {
      const { data } = await shareAPI.getShares(item.type, item.id);
      setShares(data || { userShares: [], linkShares: [] });
    } catch { /* silent */ }
  };

  const handleShareUser = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await shareAPI.shareWithUser({ resource_type: item.type, resource_id: item.id, user_email: email, role });
      toast.success('Shared successfully');
      setEmail('');
      loadShares();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to share');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLink = async () => {
    setLoading(true);
    try {
      await shareAPI.createPublicLink({ resource_type: item.type, resource_id: item.id, password: linkPwd || undefined, expires_at: linkExp || null });
      toast.success('Public link created');
      setLinkPwd(''); setLinkExp('');
      loadShares();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create link');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLink = async (id) => {
    try { await shareAPI.deletePublicLink(id); loadShares(); toast.success('Link deleted'); }
    catch { toast.error('Failed'); }
  };

  const handleCopy = async (token) => {
    const url = `${window.location.origin}/share/${token}`;
    await copyToClipboard(url);
    setCopied(token);
    toast.success('Link copied');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleRevokeUser = async (shareId) => {
    try { await shareAPI.deleteShare(shareId); loadShares(); toast.success('Access revoked'); }
    catch { toast.error('Failed to revoke'); }
  };

  if (!isOpen || !item) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card modal-card-lg">
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(79,110,247,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Share2 size={16} style={{ color: 'var(--brand-light)' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Share</h2>
              <p className="truncate" style={{ fontSize: '0.75rem', color: 'var(--text-3)', maxWidth: 280 }}>"{item.name}"</p>
            </div>
          </div>
          <button className="btn btn-icon btn-ghost" onClick={onClose}><X size={16} /></button>
        </div>

        {/* Tabs */}
        <div className="tab-bar">
          <button className={`tab ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>
            <Users size={13} style={{ display: 'inline', marginRight: 6 }} />People
          </button>
          <button className={`tab ${tab === 'link' ? 'active' : ''}`} onClick={() => setTab('link')}>
            <Globe size={13} style={{ display: 'inline', marginRight: 6 }} />Public Link
          </button>
        </div>

        <div className="modal-body" style={{ minHeight: 240 }}>
          {/* ── Users tab ─────────────────────────────────────── */}
          {tab === 'users' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <form onSubmit={handleShareUser} style={{ display: 'flex', gap: 8 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Mail size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }} />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Add by email…" className="input" style={{ paddingLeft: 30 }} />
                </div>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="input" style={{ width: 110 }}>
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                </select>
                <button type="submit" className="btn btn-primary" disabled={loading || !email.trim()}>Share</button>
              </form>

              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Who has access</p>
                {shares.userShares?.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 200, overflowY: 'auto' }}>
                    {shares.userShares.map((s) => (
                      <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--surface-4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-2)' }}>
                            {(s.user_name || s.user_email || '?')[0].toUpperCase()}
                          </div>
                          <div>
                            <p style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-1)' }}>{s.user_name || s.user_email}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{s.user_email}</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', padding: '3px 8px', borderRadius: 99, background: 'var(--surface-4)', color: 'var(--text-3)' }}>{s.role}</span>
                          <button className="btn btn-icon btn-ghost" style={{ padding: 4 }} onClick={() => handleRevokeUser(s.id)} title="Revoke">
                            <X size={13} style={{ color: 'var(--danger)' }} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-3)', textAlign: 'center', padding: '16px 0' }}>Not shared with anyone yet</p>
                )}
              </div>
            </div>
          )}

          {/* ── Link tab ───────────────────────────────────────── */}
          {tab === 'link' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {shares.linkShares?.length === 0 ? (
                <>
                  <div style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ position: 'relative' }}>
                      <Lock size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }} />
                      <input type="password" value={linkPwd} onChange={(e) => setLinkPwd(e.target.value)} placeholder="Password (optional)" className="input" style={{ paddingLeft: 30 }} />
                    </div>
                    <div style={{ position: 'relative' }}>
                      <Calendar size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }} />
                      <input type="datetime-local" value={linkExp} onChange={(e) => setLinkExp(e.target.value)} className="input" style={{ paddingLeft: 30 }} />
                    </div>
                  </div>
                  <button className="btn btn-primary" onClick={handleCreateLink} disabled={loading} style={{ width: '100%' }}>
                    <Globe size={14} />
                    {loading ? 'Creating…' : 'Create Public Link'}
                  </button>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Active Links</p>
                  {shares.linkShares.map((link) => (
                    <div key={link.id} style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Globe size={13} style={{ color: 'var(--brand)' }} />
                          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-1)' }}>Public Link</span>
                          {link.has_password && <Lock size={11} style={{ color: 'var(--text-3)' }} />}
                        </div>
                        <button className="btn btn-sm" onClick={() => handleDeleteLink(link.id)} style={{ color: 'var(--danger)', background: 'none', padding: '2px 6px', fontSize: '0.75rem' }}>
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '6px 10px' }}>
                        <span className="truncate" style={{ flex: 1, fontSize: '0.75rem', color: 'var(--text-3)' }}>
                          {`${window.location.origin}/share/${link.token}`}
                        </span>
                        <button className="btn btn-icon btn-ghost" style={{ padding: 4, flexShrink: 0 }} onClick={() => handleCopy(link.token)}>
                          {copied === link.token ? <Check size={13} style={{ color: 'var(--success)' }} /> : <Copy size={13} />}
                        </button>
                      </div>
                      {link.expires_at && (
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-3)', marginTop: 6 }}>
                          Expires: {new Date(link.expires_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                  ))}
                  <button className="btn btn-secondary btn-sm" onClick={() => setShares((p) => ({ ...p, linkShares: [] }))}>
                    + Create another link
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;