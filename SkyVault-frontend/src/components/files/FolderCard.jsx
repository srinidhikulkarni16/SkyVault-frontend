import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Trash2, Edit, Share2, Star, FolderOpen, Folder, Move } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { useFileStore } from '../../store/fileStore';

const FolderCard = ({ folder, onOpen, onRename, onMove, onDelete, onShare, onStar }) => {
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const menuRef = useRef(null);
  const { selectedItems, toggleItemSelection } = useFileStore();
  const isSelected = selectedItems.some((i) => i.id === folder.id && i.type === 'folder');

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    if (menuOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const action = (fn) => (e) => { e.stopPropagation(); setMenuOpen(false); fn(); };

  return (
    <div
      className={`file-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onOpen(folder)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div
          onClick={(e) => { e.stopPropagation(); toggleItemSelection({ id: folder.id, type: 'folder' }); }}
          style={{ padding: 10, background: 'rgba(79,110,247,0.1)', borderRadius: 10, cursor: 'pointer', transition: 'background var(--transition)' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(79,110,247,0.18)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(79,110,247,0.1)'}
        >
          {isHovered
            ? <FolderOpen size={24} style={{ color: 'var(--brand-light)' }} strokeWidth={1.75} />
            : <Folder     size={24} style={{ color: 'var(--brand)' }}       strokeWidth={1.75} />
          }
        </div>

        {folder.is_starred && (
          <Star size={12} style={{ color: '#F5A623', fill: '#F5A623', marginRight: 'auto', marginLeft: 6, marginTop: 2 }} />
        )}

        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="btn btn-icon btn-ghost"
            style={{ padding: 4 }}
          >
            <MoreVertical size={15} />
          </button>
          {menuOpen && (
            <div className="context-menu">
              <button className="context-item" onClick={action(() => onOpen(folder))}><FolderOpen size={13} />Open</button>
              <button className="context-item" onClick={action(onRename)}><Edit size={13} />Rename</button>
              <button className="context-item" onClick={action(onMove)}><Move size={13} />Move</button>
              <button className="context-item" onClick={action(onShare)}><Share2 size={13} />Share</button>
              <button className="context-item" onClick={action(onStar)}>
                <Star size={13} style={folder.is_starred ? { color: '#F5A623', fill: '#F5A623' } : {}} />
                {folder.is_starred ? 'Unstar' : 'Star'}
              </button>
              <div className="context-divider" />
              <button className="context-item danger" onClick={action(onDelete)}><Trash2 size={13} />Delete</button>
            </div>
          )}
        </div>
      </div>

      <h3 className="truncate" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-1)', marginBottom: 4 }} title={folder.name}>
        {folder.name}
      </h3>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>
        Modified {formatDate(folder.updated_at || folder.created_at)}
      </p>
    </div>
  );
};

export default FolderCard;