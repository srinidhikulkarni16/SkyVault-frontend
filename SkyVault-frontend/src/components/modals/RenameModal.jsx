import React, { useState, useEffect } from 'react';
import { X, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

const RenameModal = ({ isOpen, onClose, item, onRename }) => {
  const [name,    setName]    = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (item) setName(item.name || ''); }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { toast.error('Name cannot be empty'); return; }
    if (name.trim() === item?.name) { onClose(); return; }
    setLoading(true);
    try {
      await onRename(item, name.trim());
      toast.success('Renamed successfully');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to rename');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !item) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(79,110,247,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Edit size={16} style={{ color: 'var(--brand-light)' }} />
            </div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Rename {item.type === 'folder' ? 'Folder' : 'File'}</h2>
          </div>
          <button className="btn btn-icon btn-ghost" onClick={onClose}><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 8 }}>New name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="Enter name…"
              autoFocus
              onFocus={(e) => {
                const dotIdx = e.target.value.lastIndexOf('.');
                e.target.setSelectionRange(0, dotIdx > 0 ? dotIdx : e.target.value.length);
              }}
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading || !name.trim()}>
              {loading ? 'Renaming…' : 'Rename'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RenameModal;