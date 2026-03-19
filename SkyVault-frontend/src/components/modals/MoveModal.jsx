import React, { useState, useEffect } from 'react';
import { X, Folder, ChevronRight, ChevronDown, Home, Move } from 'lucide-react';
import { folderAPI } from '../../lib/api';
import toast from 'react-hot-toast';

const TreeNode = ({ folder, level, selectedId, onSelect, expanded, onToggle }) => {
  const isSelected = selectedId === folder.id;
  const isExpanded = expanded.includes(folder.id);

  return (
    <div>
      <div
        onClick={() => onSelect(folder.id)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '7px 10px',
          paddingLeft: `${level * 16 + 10}px`,
          borderRadius: 'var(--radius-sm)',
          cursor: 'pointer',
          background: isSelected ? 'rgba(79,110,247,0.12)' : 'transparent',
          color: isSelected ? 'var(--brand-light)' : 'var(--text-2)',
          transition: 'all var(--transition)',
        }}
        onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = 'var(--surface-3)'; }}
        onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
      >
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(folder.id); }}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'inherit', width: 16, flexShrink: 0, display: 'flex', alignItems: 'center' }}
        >
          {folder.hasChildren
            ? (isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />)
            : <span style={{ width: 12 }} />
          }
        </button>
        <Folder size={14} style={{ flexShrink: 0, color: isSelected ? 'var(--brand)' : 'var(--text-3)' }} />
        <span style={{ fontSize: '0.8125rem', fontWeight: 500 }} className="truncate">{folder.name}</span>
      </div>

      {isExpanded && folder.children?.map((child) => (
        <TreeNode
          key={child.id}
          folder={child}
          level={level + 1}
          selectedId={selectedId}
          onSelect={onSelect}
          expanded={expanded}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
};

const MoveModal = ({ isOpen, onClose, item, onMove }) => {
  const [folders,    setFolders]    = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [expanded,   setExpanded]   = useState([]);
  const [loading,    setLoading]    = useState(false);

  useEffect(() => {
    if (isOpen) { loadFolders(); setSelectedId(null); }
  }, [isOpen]);

  const loadFolders = async () => {
    try {
      const { data } = await folderAPI.getFolders();
      const list = Array.isArray(data) ? data : [];
      setFolders(list.filter((f) => f.id !== item?.id));
    } catch {
      toast.error('Failed to load folders');
    }
  };

  const toggleFolder = async (folderId) => {
    if (expanded.includes(folderId)) {
      setExpanded((p) => p.filter((id) => id !== folderId));
    } else {
      setExpanded((p) => [...p, folderId]);
      const idx = folders.findIndex((f) => f.id === folderId);
      if (idx !== -1 && !folders[idx].children) {
        try {
          const { data } = await folderAPI.getFolders(folderId);
          const children = (Array.isArray(data) ? data : []).filter((f) => f.id !== item?.id);
          setFolders((p) => p.map((f, i) => i === idx ? { ...f, children } : f));
        } catch { /* silent */ }
      }
    }
  };

  const handleMove = async () => {
    setLoading(true);
    try {
      await onMove(item, selectedId);
      toast.success('Moved successfully');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Move failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !item) return null;

  const rootFolders = folders.filter((f) => !f.parent_id);

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(79,110,247,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Move size={16} style={{ color: 'var(--brand-light)' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Move Item</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-3)' }} className="truncate">"{item.name}"</p>
            </div>
          </div>
          <button className="btn btn-icon btn-ghost" onClick={onClose}><X size={16} /></button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Root */}
          <div
            onClick={() => setSelectedId(null)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '7px 10px', borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              background: selectedId === null ? 'rgba(79,110,247,0.12)' : 'transparent',
              color: selectedId === null ? 'var(--brand-light)' : 'var(--text-2)',
              transition: 'all var(--transition)',
            }}
          >
            <Home size={14} style={{ color: selectedId === null ? 'var(--brand)' : 'var(--text-3)' }} />
            <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>My Drive (root)</span>
          </div>

          {rootFolders.map((folder) => (
            <TreeNode
              key={folder.id}
              folder={folder}
              level={1}
              selectedId={selectedId}
              onSelect={setSelectedId}
              expanded={expanded}
              onToggle={toggleFolder}
            />
          ))}

          {folders.length === 0 && (
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-3)', textAlign: 'center', padding: '24px 0' }}>No folders available</p>
          )}
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-3)' }}>
            Moving to: <span style={{ color: 'var(--text-1)', fontWeight: 500 }}>
              {selectedId === null ? 'My Drive' : (folders.find((f) => f.id === selectedId)?.name || 'Selected folder')}
            </span>
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
            <button className="btn btn-primary" onClick={handleMove} disabled={loading}>
              {loading ? 'Moving…' : 'Move Here'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoveModal;