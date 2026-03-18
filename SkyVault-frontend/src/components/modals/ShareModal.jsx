import React, { useState, useEffect } from 'react';
import { X, Link as LinkIcon, Copy, Check, Users, Mail, Globe, Lock, Calendar } from 'lucide-react';
import { shareAPI } from '../../lib/api';
import { copyToClipboard } from '../../lib/utils';
import toast from 'react-hot-toast';

const ShareModal = ({ isOpen, onClose, item }) => {
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'link'
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('viewer');
  const [shares, setShares] = useState({ userShares: [], linkShares: [] });
  const [loading, setLoading] = useState(false);
  const [linkPassword, setLinkPassword] = useState('');
  const [linkExpiry, setLinkExpiry] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (isOpen && item) {
      loadShares();
    }
  }, [isOpen, item]);

  const loadShares = async () => {
    try {
      const { data } = await shareAPI.getShares(item.type, item.id);
      setShares(data);
    } catch (error) {
      console.error('Failed to load shares:', error);
    }
  };

  const handleShareWithUser = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      await shareAPI.shareWithUser({
        resource_type: item.type,
        resource_id: item.id,
        user_email: email,
        role,
      });
      toast.success('Resource shared successfully');
      setEmail('');
      loadShares();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to share');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLink = async () => {
    setLoading(true);
    try {
      await shareAPI.createPublicLink({
        resource_type: item.type,
        resource_id: item.id,
        password: linkPassword,
        expires_at: linkExpiry || null,
      });
      toast.success('Public link created');
      loadShares();
    } catch (error) {
      toast.error('Failed to create link');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLink = async (id) => {
    try {
      await shareAPI.deletePublicLink(id);
      loadShares();
    } catch (error) {
      toast.error('Failed to delete link');
    }
  };

  const copyLink = (token) => {
    const url = `${window.location.origin}/share/${token}`;
    copyToClipboard(url);
    setCopiedLink(true);
    toast.success('Link copied to clipboard');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!isOpen || !item) return null;

  return (
    <div className="modal-overlay">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Share "{item.name}"</h2>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">
                {item.type} share
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'users' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Share with people
          </button>
          <button
            onClick={() => setActiveTab('link')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'link' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Get public link
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'users' ? (
            <div className="space-y-6">
              <form onSubmit={handleShareWithUser} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Add by email..."
                    className="input pl-10 h-10"
                  />
                </div>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="input w-32 h-10"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                </select>
                <button type="submit" disabled={loading} className="btn btn-primary h-10 whitespace-nowrap">
                  Share
                </button>
              </form>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700">Who has access</h3>
                <div className="max-h-48 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                  {shares.userShares.map((share) => (
                    <div key={share.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-semibold text-gray-600">
                          {share.user_name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{share.user_name}</p>
                          <p className="text-xs text-gray-500">{share.user_email}</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded capitalize">
                        {share.role}
                      </span>
                    </div>
                  ))}
                  {shares.userShares.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">Not shared with anyone yet</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {shares.linkShares.length === 0 ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="password"
                        value={linkPassword}
                        onChange={(e) => setLinkPassword(e.target.value)}
                        placeholder="Add password (optional)"
                        className="input pl-10"
                      />
                    </div>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="datetime-local"
                        value={linkExpiry}
                        onChange={(e) => setLinkExpiry(e.target.value)}
                        className="input pl-10"
                      />
                    </div>
                  </div>
                  <button onClick={handleCreateLink} disabled={loading} className="w-full btn btn-primary flex items-center justify-center gap-2">
                    <Globe className="w-4 h-4" />
                    Create Public Link
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700">Active public links</h3>
                  <div className="space-y-4">
                    {shares.linkShares.map((link) => (
                      <div key={link.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-start justify-between">
                        <div className="flex-1 mr-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Globe className="w-4 h-4 text-primary-600" />
                            <span className="text-sm font-medium text-gray-900">Public Link</span>
                            {link.has_password && <Lock className="w-3 h-3 text-gray-400" />}
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-2">
                              <span className="text-xs text-gray-500 truncate flex-1">
                                {`${window.location.origin}/share/${link.token}`}
                              </span>
                              <button
                                onClick={() => copyLink(link.token)}
                                className="p-1 hover:text-primary-700"
                              >
                                {copiedLink ? (
                                  <Check className="w-4 h-4" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                            {link.expires_at && (
                              <p className="text-xs text-gray-500 mt-2">
                                Expires: {new Date(link.expires_at).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteLink(link.id)}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Delete link
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button onClick={onClose} className="btn btn-secondary">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;