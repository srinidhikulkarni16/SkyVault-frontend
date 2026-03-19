import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Download, Trash2, Edit, Share2, Star, Move } from 'lucide-react';
import { formatFileSize, formatDate } from '../../lib/utils';
import { useFileStore } from '../../store/fileStore';
import FileIcon from '../common/FileIcon';

const FileCard = ({ file, onDownload, onRename, onMove, onDelete, onShare, onStar, onClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { selectedItems, toggleItemSelection } = useFileStore();
  const isSelected = selectedItems.some((i) => i.id === file.id && i.type === 'file');

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    if (menuOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const action = (fn) => (e) => { e.stopPropagation(); setMenuOpen(false); fn(); };

  return (
    <div
      className={`file-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(file)}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        {/* Icon (click to select) */}
        <div
          onClick={(e) => { e.stopPropagation(); toggleItemSelection({ id: file.id, type: 'file' }); }}
          style={{ padding: 10, background: 'var(--surface-3)', borderRadius: 10, cursor: 'pointer', transition: 'background var(--transition)' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-4)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'var(--surface-3)'}
        >
          <FileIcon mimeType={file.mime_type} name={file.name} size={24} />
        </div>

        {/* Star indicator */}
        {file.is_starred && (
          <Star size={12} style={{ color: '#F5A623', fill: '#F5A623', marginRight: 'auto', marginLeft: 6, marginTop: 2 }} />
        )}

        {/* Menu */}
        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="btn btn-icon btn-ghost"
            style={{ padding: 4, opacity: menuOpen ? 1 : undefined }}
          >
            <MoreVertical size={15} />
          </button>
          {menuOpen && (
            <div className="context-menu">
              <button className="context-item" onClick={action(onDownload)}><Download size={13} />Download</button>
              <button className="context-item" onClick={action(onRename)}><Edit size={13} />Rename</button>
              <button className="context-item" onClick={action(onMove)}><Move size={13} />Move</button>
              <button className="context-item" onClick={action(onShare)}><Share2 size={13} />Share</button>
              <button className="context-item" onClick={action(onStar)}>
                <Star size={13} style={file.is_starred ? { color: '#F5A623', fill: '#F5A623' } : {}} />
                {file.is_starred ? 'Unstar' : 'Star'}
              </button>
              <div className="context-divider" />
              <button className="context-item danger" onClick={action(onDelete)}><Trash2 size={13} />Delete</button>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <h3 className="truncate" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-1)', marginBottom: 4 }} title={file.name}>
        {file.name}
      </h3>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>
        {formatFileSize(file.size_bytes)} · {formatDate(file.updated_at || file.created_at)}
      </p>
    </div>
  );
};

export default FileCard;