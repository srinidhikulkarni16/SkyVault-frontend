import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Download, Trash2, Edit, Share2, Star, Move, Folder } from 'lucide-react';
import { formatFileSize, formatDate, cn } from '../../lib/utils';
import { useFileStore } from '../../store/fileStore';
import FileIcon from '../common/FileIcon';

const ListRow = ({ item, onDownload, onRename, onMove, onDelete, onShare, onStar, onClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { selectedItems, toggleItemSelection } = useFileStore();
  const isFolder = item.type === 'folder';
  const isSelected = selectedItems.some((i) => i.id === item.id && i.type === item.type);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    if (menuOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const action = (fn) => (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    fn();
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'group grid grid-cols-[1fr_140px_140px_80px_40px] items-center gap-4 px-6 py-3.5 border-b border-stone-100 cursor-pointer transition-all duration-200',
        isSelected ? 'bg-lime-50/50' : 'hover:bg-stone-50'
      )}
    >
      {/* Name Column */}
      <div className="flex items-center gap-4 min-w-0">
        {/* Custom Earthy Checkbox */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            toggleItemSelection({ id: item.id, type: item.type });
          }}
          className={cn(
            'w-5 h-5 rounded-lg border-2 shrink-0 cursor-pointer flex items-center justify-center transition-all duration-300',
            isSelected 
              ? 'border-lime-800 bg-lime-800 shadow-sm' 
              : 'border-stone-200 bg-white group-hover:border-stone-400'
          )}
        >
          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white animate-in zoom-in-50" />}
        </div>

        <div className="shrink-0 transition-transform duration-300 group-hover:scale-110">
          {isFolder ? (
            <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center">
              <Folder size={18} className="text-lime-700" strokeWidth={2} />
            </div>
          ) : (
            <FileIcon mimeType={item.mime_type} name={item.name} size={18} />
          )}
        </div>

        <span className={cn(
          'text-sm font-bold truncate transition-colors duration-200',
          isSelected ? 'text-lime-900' : 'text-stone-700 group-hover:text-stone-900'
        )}>
          {item.name}
        </span>
        
        {item.is_starred && (
          <div className="bg-amber-50 p-0.5 rounded-full shrink-0">
            <Star size={10} className="text-amber-500 fill-amber-500" />
          </div>
        )}
      </div>

      {/* Metadata Columns */}
      <span className="text-xs font-semibold text-stone-400 truncate tracking-wide">
        {item.owner?.name || 'Me'}
      </span>
      <span className="text-xs font-semibold text-stone-400 tracking-wide">
        {formatDate(item.updated_at || item.created_at)}
      </span>
      <span className="text-xs font-bold text-stone-500 text-right tracking-tight">
        {isFolder ? '—' : formatFileSize(item.size_bytes)}
      </span>

      {/* Actions */}
      <div ref={menuRef} className="relative flex justify-end">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          className={cn(
            'flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200',
            menuOpen 
              ? 'bg-stone-900 text-white' 
              : 'text-stone-400 hover:text-stone-900 hover:bg-stone-200 opacity-0 group-hover:opacity-100'
          )}
        >
          <MoreVertical size={16} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-2 z-50 min-w-[180px] bg-white border border-stone-200 rounded-2xl shadow-2xl py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
            {!isFolder && (
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50 hover:text-lime-800" onClick={action(onDownload)}>
                <Download size={14} /> Download
              </button>
            )}
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50 hover:text-lime-800" onClick={action(onRename)}>
              <Edit size={14} /> Rename
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50 hover:text-lime-800" onClick={action(onMove)}>
              <Move size={14} /> Move
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50 hover:text-lime-800" onClick={action(onShare)}>
              <Share2 size={14} /> Share
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50 hover:text-lime-800" onClick={action(onStar)}>
              <Star size={14} className={item.is_starred ? 'text-amber-500 fill-amber-500' : ''} />
              {item.is_starred ? 'Unstar' : 'Star'}
            </button>
            <div className="my-1.5 border-t border-stone-100" />
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50" onClick={action(onDelete)}>
              <Trash2 size={14} /> Move to Trash
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const FileList = ({ items, onDownload, onRename, onMove, onDelete, onShare, onStar, onClick }) => (
  <div className="bg-white border border-stone-200 rounded-[2rem] overflow-hidden shadow-sm shadow-stone-200/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
    {/* Header row */}
    <div className="grid grid-cols-[1fr_140px_140px_80px_40px] gap-4 px-6 py-4 border-b border-stone-100 bg-stone-50/50">
      <div className="text-[10px] font-black text-stone-400 uppercase tracking-[0.15em] pl-10">File Name</div>
      <div className="text-[10px] font-black text-stone-400 uppercase tracking-[0.15em]">Owner</div>
      <div className="text-[10px] font-black text-stone-400 uppercase tracking-[0.15em]">Modified</div>
      <div className="text-[10px] font-black text-stone-400 uppercase tracking-[0.15em] text-right">Size</div>
      <div />
    </div>
    
    <div className="divide-y divide-stone-50">
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
  </div>
);

export default FileList;