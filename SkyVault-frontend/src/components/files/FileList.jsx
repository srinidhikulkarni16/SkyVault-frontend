import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Download, Trash2, Edit, Share2, Star, Move, Folder } from 'lucide-react';
import { formatFileSize, formatDate } from '../../lib/utils';
import { useFileStore } from '../../store/fileStore';
import FileIcon from '../common/FileIcon';
import { cn } from '../../lib/utils';

const ListRow = ({ item, onDownload, onRename, onMove, onDelete, onShare, onStar, onClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { selectedItems, toggleItemSelection } = useFileStore();
  const isFolder   = item.type === 'folder';
  const isSelected = selectedItems.some((i) => i.id === item.id && i.type === item.type);

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    if (menuOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const action = (fn) => (e) => { e.stopPropagation(); setMenuOpen(false); fn(); };

  return (
    <div className={cn('list-row', isSelected && 'selected')} onClick={onClick}>
      {/* Name col */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        {/* Checkbox */}
        <div
          onClick={(e) => { e.stopPropagation(); toggleItemSelection({ id: item.id, type: item.type }); }}
          style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${isSelected ? 'var(--brand)' : 'var(--border)'}`, background: isSelected ? 'var(--brand)' : 'transparent', flexShrink: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all var(--transition)' }}
        >
          {isSelected && <div style={{ width: 6, height: 6, borderRadius: 2, background: '#fff' }} />}
        </div>

        {isFolder
          ? <Folder size={18} style={{ color: 'var(--brand)', flexShrink: 0 }} strokeWidth={1.75} />
          : <FileIcon mimeType={item.mime_type} name={item.name} size={18} />
        }

        <span className="truncate" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-1)' }}>
          {item.name}
        </span>
        {item.is_starred && <Star size={11} style={{ color: '#F5A623', fill: '#F5A623', flexShrink: 0 }} />}
      </div>

      {/* Owner */}
      <span style={{ fontSize: '0.8125rem', color: 'var(--text-3)' }} className="truncate">
        {item.owner?.name || 'Me'}
      </span>

      {/* Modified */}
      <span style={{ fontSize: '0.8125rem', color: 'var(--text-3)' }}>
        {formatDate(item.updated_at || item.created_at)}
      </span>

      {/* Size */}
      <span style={{ fontSize: '0.8125rem', color: 'var(--text-3)', textAlign: 'right' }}>
        {isFolder ? '—' : formatFileSize(item.size_bytes)}
      </span>

      {/* Actions */}
      <div ref={menuRef} style={{ position: 'relative', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
          className="btn btn-icon btn-ghost"
          style={{ padding: 4, opacity: 0 }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => { if (!menuOpen) e.currentTarget.style.opacity = '0'; }}
          id={`menu-btn-${item.id}`}
        >
          <MoreVertical size={14} />
        </button>
        {menuOpen && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 19 }} onClick={() => setMenuOpen(false)} />
            <div className="context-menu" style={{ zIndex: 20 }}>
              {!isFolder && <button className="context-item" onClick={action(onDownload)}><Download size={13} />Download</button>}
              <button className="context-item" onClick={action(onRename)}><Edit size={13} />Rename</button>
              <button className="context-item" onClick={action(onMove)}><Move size={13} />Move</button>
              <button className="context-item" onClick={action(onShare)}><Share2 size={13} />Share</button>
              <button className="context-item" onClick={action(onStar)}>
                <Star size={13} style={item.is_starred ? { color: '#F5A623', fill: '#F5A623' } : {}} />
                {item.is_starred ? 'Unstar' : 'Star'}
              </button>
              <div className="context-divider" />
              <button className="context-item danger" onClick={action(onDelete)}><Trash2 size={13} />Delete</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Show menu button on row hover via CSS injection
const style = document.createElement('style');
style.textContent = `.list-row:hover button[id^="menu-btn-"] { opacity: 1 !important; }`;
document.head.appendChild(style);

const FileList = ({ items, onDownload, onRename, onMove, onDelete, onShare, onStar, onClick }) => (
  <div className="card" style={{ overflow: 'hidden' }}>
    <div className="list-header">
      <div>Name</div>
      <div>Owner</div>
      <div>Modified</div>
      <div style={{ textAlign: 'right' }}>Size</div>
      <div />
    </div>
    {items.map((item) => (
      <ListRow
        key={`${item.type}-${item.id}`}
        item={item}
        onDownload={() => onDownload(item)}
        onRename={() => onRename(item)}
        onMove={() => onMove(item)}
        onDelete={() => onDelete(item)}
        onShare={() => onShare(item)}
        onStar={() => onStar(item)}
        onClick={() => onClick(item)}
      />
    ))}
  </div>
);

export default FileList;