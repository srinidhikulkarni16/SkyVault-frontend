import React, { useState, useRef, useEffect } from 'react';
import { Search, Upload, FolderPlus, Grid3x3, List, ChevronDown, Check } from 'lucide-react';
import { useFileStore } from '../../store/fileStore';
import { cn } from '../../lib/utils';

const SORT_OPTIONS = [
  { value: 'name', label: 'Name'     },
  { value: 'date', label: 'Modified' },
  { value: 'size', label: 'Size'     },
];

const Header = ({ onUploadClick, onNewFolderClick }) => {
  const { viewMode, setViewMode, searchQuery, setSearchQuery, sortBy, setSortBy, sortOrder, setSortOrder } = useFileStore();
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const currentSort = SORT_OPTIONS.find((o) => o.value === sortBy);

  return (
    <header className="h-20 flex items-center gap-4 px-6 sm:px-10 bg-white/60 backdrop-blur-md border-b border-stone-100 shrink-0 sticky top-0 z-30">
      {/* Search Bar */}
      <div className="flex-1 max-w-md relative group">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-lime-700 transition-colors" />
        <input
          type="text" 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search your vault..."
          className="w-full pl-11 pr-4 h-11 text-sm font-medium rounded-2xl border border-stone-200 bg-stone-50/50 text-stone-900 placeholder-stone-400 outline-none focus:ring-4 focus:ring-lime-600/10 focus:border-lime-700 transition-all"
        />
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* Sort Dropdown */}
        <div ref={sortRef} className="relative hidden md:block">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className={cn(
              "flex items-center gap-2 h-11 px-4 rounded-2xl border text-sm font-bold transition-all active:scale-95",
              sortOpen 
                ? "bg-stone-900 border-stone-900 text-white" 
                : "bg-white border-stone-200 text-stone-600 hover:border-stone-400"
            )}
          >
            <span className="text-xs uppercase tracking-widest opacity-60 font-black">Sort:</span>
            {currentSort?.label}
            <ChevronDown size={14} className={cn("transition-transform duration-300", sortOpen && "rotate-180")} />
          </button>

          {sortOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] z-50 min-w-[200px] bg-white border border-stone-200 rounded-[2rem] shadow-2xl py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
              {SORT_OPTIONS.map((opt) => (
                <button 
                  key={opt.value}
                  onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                  className="w-full flex items-center justify-between px-5 py-3 text-sm font-semibold text-stone-600 hover:bg-stone-50 hover:text-lime-800 transition-colors"
                >
                  {opt.label}
                  {sortBy === opt.value && <Check size={14} className="text-lime-700" />}
                </button>
              ))}
              <div className="my-2 border-t border-stone-100" />
              <button
                onClick={() => { setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); setSortOpen(false); }}
                className="w-full flex items-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-widest text-stone-400 hover:bg-stone-50 hover:text-stone-900 transition-colors"
              >
                {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
              </button>
            </div>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-stone-100/80 rounded-2xl p-1 gap-1 border border-stone-200/50">
          {[
            { mode: 'grid', icon: Grid3x3 },
            { mode: 'list', icon: List }
          ].map(({ mode, icon: Icon }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={cn(
                'flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300',
                viewMode === mode
                  ? 'bg-white text-lime-800 shadow-sm'
                  : 'text-stone-400 hover:text-stone-600 hover:bg-white/50'
              )}
            >
              <Icon size={16} strokeWidth={viewMode === mode ? 2.5 : 2} />
            </button>
          ))}
        </div>

        {/* New Folder Button */}
        {onNewFolderClick && (
          <button 
            onClick={onNewFolderClick}
            className="hidden sm:flex items-center gap-2 h-11 px-5 rounded-2xl border border-stone-200 bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 text-sm font-bold transition-all active:scale-95 shadow-sm"
          >
            <FolderPlus size={16} />
            <span>New Folder</span>
          </button>
        )}

        {/* Upload Button */}
        {onUploadClick && (
          <button 
            onClick={onUploadClick}
            className="flex items-center gap-2 h-11 px-6 rounded-2xl bg-lime-800 hover:bg-lime-900 text-white text-sm font-bold transition-all active:scale-95 shadow-lg shadow-lime-900/20"
          >
            <Upload size={16} />
            <span className="hidden xs:inline">Upload</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;