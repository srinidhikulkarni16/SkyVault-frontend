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
      onClick={() => onClick(file)}
      className={`group relative bg-white border rounded-[2rem] p-5 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-stone-200/50 hover:-translate-y-1.5 ${
        isSelected 
          ? 'border-lime-600 ring-2 ring-lime-600/10 bg-lime-50/30' 
          : 'border-stone-200 hover:border-stone-300'
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        {/* Icon (click to select) */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            toggleItemSelection({ id: file.id, type: 'file' });
          }}
          className={`p-3 rounded-2xl transition-all duration-300 transform active:scale-90 shadow-sm ${
            isSelected ? 'bg-lime-800 text-white shadow-lime-900/20' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <FileIcon mimeType={file.mime_type} name={file.name} size={24} />
        </div>

        <div className="flex items-center gap-1.5">
          {file.is_starred && (
            <div className="bg-amber-50 p-1 rounded-full">
              <Star size={12} className="text-amber-500 fill-amber-500" />
            </div>
          )}

          {/* Menu Wrapper */}
          <div ref={menuRef} className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200 ${
                menuOpen 
                  ? 'bg-stone-900 text-white' 
                  : 'text-stone-400 hover:text-stone-900 hover:bg-stone-100 opacity-0 group-hover:opacity-100'
              }`}
            >
              <MoreVertical size={16} />
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 z-50 min-w-[180px] bg-white border border-stone-200 rounded-2xl shadow-2xl py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50 hover:text-lime-800 transition-colors" onClick={action(onDownload)}><Download size={14} /> Download</button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50 hover:text-lime-800 transition-colors" onClick={action(onRename)}><Edit size={14} /> Rename</button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50 hover:text-lime-800 transition-colors" onClick={action(onMove)}><Move size={14} /> Move</button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50 hover:text-lime-800 transition-colors" onClick={action(onShare)}><Share2 size={14} /> Share</button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50 hover:text-lime-800 transition-colors" onClick={action(onStar)}>
                  <Star size={14} className={file.is_starred ? 'text-amber-500 fill-amber-500' : ''} />
                  {file.is_starred ? 'Unstar Item' : 'Star Item'}
                </button>
                <div className="my-1.5 border-t border-stone-100" />
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors" onClick={action(onDelete)}><Trash2 size={14} /> Move to Trash</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* File Info */}
      <div className="space-y-1">
        <h3 
          className="text-sm font-bold text-stone-900 truncate tracking-tight group-hover:text-lime-900 transition-colors" 
          title={file.name}
        >
          {file.name}
        </h3>
        <p className="text-[11px] font-medium text-stone-400 uppercase tracking-wider">
          {formatFileSize(file.size_bytes)} • {formatDate(file.updated_at || file.created_at)}
        </p>
      </div>

      {/* Selection Indicator Dot */}
      {isSelected && (
        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-lime-800 border-2 border-white rounded-full shadow-sm animate-in zoom-in" />
      )}
    </div>
  );
};

export default FileCard;