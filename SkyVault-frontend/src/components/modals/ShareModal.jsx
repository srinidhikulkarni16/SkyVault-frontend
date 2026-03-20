import React, { useState, useEffect } from 'react';
import { X, Users, Mail, Globe, Lock, Calendar, Copy, Check, Trash2, Share2, Loader2, ShieldCheck } from 'lucide-react';
import { shareAPI } from '../../lib/api';
import { copyToClipboard } from '../../lib/utils';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';

const ShareModal = ({ isOpen, onClose, item }) => {
  const [tab, setTab] = useState('users');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('viewer');
  const [shares, setShares] = useState({ userShares: [], linkShares: [] });
  const [loading, setLoading] = useState(false);
  const [linkPwd, setLinkPwd] = useState('');
  const [linkExp, setLinkExp] = useState('');
  const [copied, setCopied] = useState(null);

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
      toast.success('Access granted');
      setEmail('');
      loadShares();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to share');
    } finally { setLoading(false); }
  };

  const handleCreateLink = async () => {
    setLoading(true);
    try {
      await shareAPI.createPublicLink({ resource_type: item.type, resource_id: item.id, password: linkPwd || undefined, expires_at: linkExp || null });
      toast.success('Public vault link active');
      setLinkPwd(''); setLinkExp('');
      loadShares();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create link');
    } finally { setLoading(false); }
  };

  const handleDeleteLink = async (id) => {
    try { await shareAPI.deletePublicLink(id); loadShares(); toast.success('Link revoked'); }
    catch { toast.error('Failed'); }
  };

  const handleCopy = async (token) => {
    await copyToClipboard(`${window.location.origin}/share/${token}`);
    setCopied(token);
    toast.success('Link copied to clipboard');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleRevokeUser = async (shareId) => {
    try { await shareAPI.deleteShare(shareId); loadShares(); toast.success('Access revoked'); }
    catch { toast.error('Failed to revoke'); }
  };

  if (!isOpen || !item) return null;

  const inputCls = "w-full px-4 py-3 text-sm font-bold rounded-2xl border border-stone-200 bg-stone-50/50 text-stone-900 placeholder-stone-300 outline-none focus:ring-4 focus:ring-lime-800/10 focus:border-lime-800 focus:bg-white transition-all shadow-inner";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-stone-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white border border-stone-200 rounded-[2.5rem] shadow-2xl w-full max-w-md flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-stone-100 bg-stone-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-lime-800 flex items-center justify-center shrink-0 shadow-lg shadow-lime-900/20">
              <Share2 size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-black text-stone-900 tracking-tight leading-none mb-1">Collaboration</h2>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest truncate max-w-[200px]">"{item.name}"</p>
            </div>
          </div>
          <button onClick={onClose} className="flex items-center justify-center w-8 h-8 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-200 transition-all active:scale-90">
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex px-8 border-b border-stone-100 bg-white shrink-0">
          {[
            { key: 'users', icon: Users, label: 'People' },
            { key: 'link', icon: Globe, label: 'Public Link' },
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                "flex items-center gap-2 px-1 py-4 mr-8 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all",
                tab === key ? 'border-lime-800 text-lime-800' : 'border-transparent text-stone-400 hover:text-stone-600'
              )}
            >
              <Icon size={14} strokeWidth={2.5} />
              {label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-8 py-6 bg-stone-50/20">
          {tab === 'users' && (
            <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-top-2 duration-300">
              <form onSubmit={handleShareUser} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 pointer-events-none" />
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address..."
                    className={cn(inputCls, "pl-11")}
                  />
                </div>
                <select
                  value={role} onChange={(e) => setRole(e.target.value)}
                  className="px-3 py-3 text-xs font-black uppercase tracking-tight rounded-2xl border border-stone-200 bg-stone-50/50 text-stone-700 outline-none focus:ring-4 focus:ring-lime-800/10 transition-all cursor-pointer"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                </select>
                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="px-6 py-3 rounded-2xl bg-stone-900 hover:bg-black text-white text-xs font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : 'Invite'}
                </button>
              </form>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck size={14} className="text-lime-800" />
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Authorized Access</p>
                </div>
                {shares.userShares?.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {shares.userShares.map((s) => (
                      <div key={s.id} className="group flex items-center justify-between p-3 rounded-2xl border border-transparent hover:border-stone-100 hover:bg-white transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-xs font-black text-stone-600 border-2 border-white shadow-sm ring-1 ring-stone-100">
                            {(s.user_name || s.user_email || '?')[0].toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-stone-900 truncate">{s.user_name || s.user_email}</p>
                            <p className="text-[11px] font-medium text-stone-400 truncate">{s.user_email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-stone-100 text-stone-500 group-hover:bg-lime-50 group-hover:text-lime-800 transition-colors">
                            {s.role}
                          </span>
                          <button
                            onClick={() => handleRevokeUser(s.id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-stone-50/50 rounded-[2rem] border border-dashed border-stone-200">
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">No active collaborators</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'link' && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
              {shares.linkShares?.length === 0 ? (
                <div className="space-y-4">
                  <div className="bg-stone-50/50 border border-stone-100 rounded-[2rem] p-6 space-y-4 shadow-inner">
                    <div className="relative">
                      <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
                      <input
                        type="password" value={linkPwd} onChange={(e) => setLinkPwd(e.target.value)}
                        placeholder="Security Password (optional)"
                        className={cn(inputCls, "pl-11")}
                      />
                    </div>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
                      <input
                        type="datetime-local" value={linkExp} onChange={(e) => setLinkExp(e.target.value)}
                        className={cn(inputCls, "pl-11")}
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleCreateLink}
                    disabled={loading}
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-[1.5rem] bg-lime-800 hover:bg-lime-900 text-white text-sm font-black transition-all shadow-lg shadow-lime-900/20 active:scale-[0.98] disabled:opacity-50"
                  >
                    <Globe size={18} strokeWidth={2.5} />
                    {loading ? 'Securing Link...' : 'Generate Public Link'}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] ml-1">Active Gateway Links</p>
                  {shares.linkShares.map((link) => (
                    <div key={link.id} className="bg-white border border-stone-100 rounded-[2rem] p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-lime-100 flex items-center justify-center text-lime-800">
                            <Globe size={14} strokeWidth={2.5} />
                          </div>
                          <div>
                            <span className="text-xs font-black text-stone-900 tracking-tight">Public Gateway</span>
                            {link.has_password && <div className="flex items-center gap-1 text-[9px] font-bold text-lime-700 uppercase"><Lock size={8}/> Protected</div>}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteLink(link.id)}
                          className="flex items-center gap-1.5 text-[10px] font-black uppercase text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={12} /> Revoke
                        </button>
                      </div>
                      <div className="flex items-center gap-2 bg-stone-50 rounded-2xl p-2 border border-stone-100">
                        <span className="flex-1 text-[11px] font-bold text-stone-400 truncate pl-2">
                          {`${window.location.origin.replace(/^https?:\/\//, '')}/share/${link.token}`}
                        </span>
                        <button
                          onClick={() => handleCopy(link.token)}
                          className="flex items-center justify-center w-10 h-10 rounded-xl bg-white text-stone-600 border border-stone-200 hover:border-lime-800 hover:text-lime-800 transition-all shadow-sm active:scale-90 shrink-0"
                        >
                          {copied === link.token ? <Check size={16} className="text-lime-700" strokeWidth={3} /> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setShares((p) => ({ ...p, linkShares: [] }))}
                    className="mt-2 py-3 rounded-2xl border-2 border-dashed border-stone-200 text-[11px] font-black text-stone-400 uppercase tracking-widest hover:border-lime-800 hover:text-lime-800 transition-all"
                  >
                    + Create New Entry Point
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end px-8 py-6 border-t border-stone-100 bg-stone-50/50 shrink-0">
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-2xl bg-stone-900 text-white hover:bg-black text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;