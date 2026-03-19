import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trashAPI } from '../lib/api';
import { formatFileSize, formatDate } from '../lib/utils';
import { RotateCcw, Trash2, AlertTriangle, X, Folder } from 'lucide-react';
import toast from 'react-hot-toast';
import Sidebar    from '../components/layout/Sidebar';
import Header     from '../components/layout/Header';
import EmptyState from '../components/common/EmptyState';
import PageTitle  from '../components/common/PageTitle';
import FileIcon   from '../components/common/FileIcon';

const ConfirmModal = ({ isOpen, onClose, onConfirm, item }) => {
  if (!isOpen || !item) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(255,85,85,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={16} style={{ color: 'var(--danger)' }} />
            </div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Delete permanently?</h2>
          </div>
          <button className="btn btn-icon btn-ghost" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal-body">
          <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.6 }}>
            <span style={{ fontWeight: 600, color: 'var(--text-1)' }}>"{item.name}"</span> will be permanently deleted. This cannot be undone.
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Delete Forever</button>
        </div>
      </div>
    </div>
  );
};

const Trash = () => {
  const qc = useQueryClient();
  const [confirm, setConfirm] = useState({ open: false, item: null });

  const { data, isLoading } = useQuery({
    queryKey: ['trash'],
    queryFn:  () => trashAPI.getTrash().then((r) => r.data),
  });

  const restore = useMutation({
    mutationFn: (item) => trashAPI.restore(item.type, item.id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['trash'] }); toast.success('Restored'); },
  });

  const perm = useMutation({
    mutationFn: (item) => trashAPI.permanentDelete(item.type, item.id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['trash'] }); toast.success('Permanently deleted'); },
  });

  const emptyTrash = useMutation({
    mutationFn: () => trashAPI.emptyTrash(),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['trash'] }); toast.success('Trash emptied'); },
  });

  const items = Array.isArray(data) ? data : [];

  const EmptyBtn = items.length > 0 ? (
    <button
      className="btn btn-danger btn-sm"
      onClick={() => emptyTrash.mutate()}
      disabled={emptyTrash.isPending}
    >
      <Trash2 size={13} /> Empty Trash
    </button>
  ) : null;

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-main">
        <Header onUploadClick={null} onNewFolderClick={null} />
        <PageTitle title="Trash" sub="Items are permanently deleted after 30 days" action={EmptyBtn} />

        <main className="page-content">
          {isLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
              <div style={{ width: 32, height: 32, border: '2px solid var(--brand)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            </div>
          ) : items.length === 0 ? (
            <EmptyState type="trash" />
          ) : (
            <div className="card" style={{ overflow: 'hidden' }}>
              {items.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderBottom: '1px solid var(--border)', transition: 'background var(--transition)' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-3)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Icon */}
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {item.type === 'folder'
                      ? <Folder size={18} style={{ color: 'var(--brand)' }} />
                      : <FileIcon mimeType={item.mime_type} name={item.name} size={18} />
                    }
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="truncate" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-1)' }}>{item.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>
                      {item.type === 'file' ? formatFileSize(item.size_bytes) : 'Folder'} · Deleted {formatDate(item.deleted_at || item.updated_at)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button
                      className="btn btn-sm"
                      style={{ background: 'rgba(46,204,113,0.1)', color: '#2ECC71', border: '1px solid rgba(46,204,113,0.2)', gap: 6 }}
                      onClick={() => restore.mutate(item)}
                      disabled={restore.isPending}
                    >
                      <RotateCcw size={12} /> Restore
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => setConfirm({ open: true, item })}
                      disabled={perm.isPending}
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <ConfirmModal
        isOpen={confirm.open}
        onClose={() => setConfirm({ open: false, item: null })}
        item={confirm.item}
        onConfirm={() => { perm.mutate(confirm.item); setConfirm({ open: false, item: null }); }}
      />
    </div>
  );
};

export default Trash;