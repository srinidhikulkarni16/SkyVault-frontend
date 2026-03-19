import React, { useState, useEffect } from 'react';
import { X, FolderPlus } from 'lucide-react';
import toast from 'react-hot-toast';

const NewFolderModal = ({ isOpen, onClose, parentFolderId, onCreateFolder }) => {
  const [name,    setName]    = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (isOpen) setName(''); }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { toast.error('Folder name cannot be empty'); return; }
    setLoading(true);
    try {
      await onCreateFolder({ name: name.trim(), parent_id: parentFolderId || null });
      toast.success('Folder created');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create folder');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(79,110,247,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FolderPlus size={16} style={{ color: 'var(--brand-light)' }} />
            </div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>New Folder</h2>
          </div>
          <button className="btn btn-icon btn-ghost" onClick={onClose}><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 8 }}>Folder name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="Untitled folder"
              autoFocus
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading || !name.trim()}>
              {loading ? 'Creating…' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewFolderModal;