import React, { useState, useEffect } from 'react';
import { X, Folder, ChevronRight, ChevronDown, Home, Move, Loader2 } from 'lucide-react';
import { folderAPI } from '../../lib/api';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';

const TreeNode = ({ folder, level, selectedId, onSelect, expanded, onToggle }) => {
  const isSelected = selectedId === folder.id;
  const isExpanded = expanded.includes(folder.id);

  return (
    <div className="animate-in fade-in slide-in-from-left-1 duration-200">
      <div
        onClick={() => onSelect(folder.id)}
        className={cn(
          "flex items-center gap-2 py-2 pr-3 rounded-xl cursor-pointer transition-all select-none group mb-0.5",
          isSelected
            ? 'bg-lime-800 text-white shadow-md shadow-lime-900/10'
            : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900'
        )}
        style={{ marginLeft: `${level * 12}px` }}
      >
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(folder.id); }}
          className="w-6 h-6 flex items-center justify-center shrink-0 rounded-lg hover:bg-black/5 transition-colors"
        >
          {folder.hasChildren ? (
            <ChevronRight 
              size={14} 
              className={cn("transition-transform duration-300", isExpanded && "rotate-90")} 
              strokeWidth={3}
            />
          ) : (
            <div className="w-1 h-1 rounded-full bg-stone-300" />
          )}
        </button>
        <Folder 
          size={16} 
          className={cn("shrink-0 transition-transform group-hover:scale-110", isSelected ? 'text-lime-200' : 'text-stone-400')} 
          strokeWidth={2.5}
        />
        <span className="text-xs font-bold truncate tracking-tight">{folder.name}</span>
      </div>

      {isExpanded && (
        <div className="border-l border-stone-200 ml-3 transition-all">
          {folder.children?.map((child) => (
            <TreeNode
              key={child.id} folder={child} level={level + 1}
              selectedId={selectedId} onSelect={onSelect}
              expanded={expanded} onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const MoveModal = ({ isOpen, onClose, item, onMove }) => {
  const [folders, setFolders] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [expanded, setExpanded] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (isOpen) { loadFolders(); setSelectedId(null); }
  }, [isOpen]);

  const loadFolders = async () => {
    setFetching(true);
    try {
      const { data } = await folderAPI.getFolders();
      setFolders((Array.isArray(data) ? data : []).filter((f) => f.id !== item?.id));
    } catch { toast.error('Failed to load folders'); }
    finally { setFetching(false); }
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
  const selectedName = selectedId === null
    ? 'My Drive'
    : (folders.find((f) => f.id === selectedId)?.name || 'Folder');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-stone-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white border border-stone-200 rounded-[2.5rem] shadow-2xl w-full max-w-sm flex flex-col max-h-[80vh] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-stone-100 bg-stone-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-stone-900 flex items-center justify-center shrink-0">
              <Move size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-black text-stone-900 tracking-tight leading-none mb-1">Move Item</h2>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest truncate max-w-[150px]">"{item.name}"</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-200 transition-all active:scale-90"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Directory Tree */}
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-stone-50/20">
          {/* Root Level */}
          <div
            onClick={() => setSelectedId(null)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all active:scale-[0.98] mb-4",
              selectedId === null
                ? 'bg-lime-800 text-white shadow-lg shadow-lime-900/10'
                : 'text-stone-500 bg-white border border-stone-100 hover:border-stone-300'
            )}
          >
            <Home size={16} className={selectedId === null ? 'text-lime-200' : 'text-stone-400'} strokeWidth={2.5} />
            <span className="text-sm font-black tracking-tight">Main Vault</span>
          </div>

          {fetching ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="animate-spin text-stone-300" size={24} />
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {rootFolders.map((folder) => (
                <TreeNode
                  key={folder.id} folder={folder} level={0}
                  selectedId={selectedId} onSelect={setSelectedId}
                  expanded={expanded} onToggle={toggleFolder}
                />
              ))}
            </div>
          )}

          {!fetching && folders.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">No target folders</p>
            </div>
          )}
        </div>

        {/* Interaction Footer */}
        <div className="flex flex-col gap-4 px-8 py-6 border-t border-stone-100 bg-stone-50/50 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-lime-800 animate-pulse" />
            <p className="text-[11px] font-black text-stone-400 uppercase tracking-widest truncate">
              Destination: <span className="text-stone-900">{selectedName}</span>
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-2xl border border-stone-200 bg-white text-stone-600 hover:text-stone-900 text-sm font-bold transition-all active:scale-95 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleMove}
              disabled={loading}
              className="flex-[1.5] px-4 py-3 rounded-2xl bg-lime-800 hover:bg-lime-900 text-white text-sm font-black transition-all active:scale-95 shadow-lg shadow-lime-900/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Move Here'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoveModal;