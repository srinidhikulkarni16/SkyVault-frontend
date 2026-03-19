import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const DeleteModal = ({ isOpen, onClose, item, onDelete }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(item);
      toast.success(`Moved to trash`);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
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
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(255,85,85,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={16} style={{ color: 'var(--danger)' }} />
            </div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Delete {item.type === 'folder' ? 'Folder' : 'File'}?</h2>
          </div>
          <button className="btn btn-icon btn-ghost" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.6 }}>
            Are you sure you want to delete <span style={{ fontWeight: 600, color: 'var(--text-1)' }}>"{item.name}"</span>?
          </p>
          {item.type === 'folder' && (
            <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: 'var(--radius-sm)' }}>
              <p style={{ fontSize: '0.8125rem', color: '#F5A623' }}>All files and sub-folders inside will also be deleted.</p>
            </div>
          )}
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-3)', marginTop: 10 }}>Items can be restored from Trash within 30 days.</p>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
            {loading ? 'Deleting…' : 'Move to Trash'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;