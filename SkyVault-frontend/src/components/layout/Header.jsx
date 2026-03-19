import React, { useState, useRef, useEffect } from 'react';
import { Search, Upload, FolderPlus, Grid3x3, List, ChevronDown, Check } from 'lucide-react';
import { useFileStore } from '../../store/fileStore';
import { cn } from '../../lib/utils';

const SORT_OPTIONS = [
  { value: 'name',  label: 'Name' },
  { value: 'date',  label: 'Modified' },
  { value: 'size',  label: 'Size' },
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
    <header className="app-header">
      {/* Search */}
      <div style={{ flex: 1, maxWidth: 480, position: 'relative' }}>
        <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search files and folders…"
          className="input"
          style={{ paddingLeft: 32, height: 36, fontSize: '0.875rem' }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
        {/* Sort */}
        {(onUploadClick || onNewFolderClick) && (
          <div ref={sortRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="btn btn-ghost btn-sm"
              style={{ gap: 4, color: 'var(--text-3)', fontSize: '0.8125rem' }}
            >
              {currentSort?.label}
              <ChevronDown size={13} style={{ transition: 'transform 0.15s', transform: sortOpen ? 'rotate(180deg)' : 'none' }} />
            </button>
            {sortOpen && (
              <div className="context-menu" style={{ right: 0, top: '100%', minWidth: 160 }}>
                {SORT_OPTIONS.map((opt) => (
                  <button key={opt.value} className="context-item" onClick={() => { setSortBy(opt.value); setSortOpen(false); }}>
                    {sortBy === opt.value && <Check size={12} style={{ color: 'var(--brand)' }} />}
                    {sortBy !== opt.value && <span style={{ width: 12 }} />}
                    {opt.label}
                  </button>
                ))}
                <div className="context-divider" />
                <button className="context-item" onClick={() => { setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); setSortOpen(false); }}>
                  {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* View toggle */}
        <div style={{ display: 'flex', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 2, gap: 2 }}>
          {[['grid', Grid3x3], ['list', List]].map(([mode, Icon]) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={cn('btn btn-icon btn-sm', viewMode === mode && 'btn-primary')}
              style={{ padding: 5, borderRadius: 4 }}
              title={`${mode} view`}
            >
              <Icon size={14} />
            </button>
          ))}
        </div>

        {/* New Folder */}
        {onNewFolderClick && (
          <button onClick={onNewFolderClick} className="btn btn-secondary btn-sm" style={{ gap: 6 }}>
            <FolderPlus size={14} />
            <span>New Folder</span>
          </button>
        )}

        {/* Upload */}
        {onUploadClick && (
          <button onClick={onUploadClick} className="btn btn-primary btn-sm" style={{ gap: 6 }}>
            <Upload size={14} />
            <span>Upload</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;