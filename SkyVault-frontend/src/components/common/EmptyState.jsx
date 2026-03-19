import React from 'react';
import { FolderOpen, Clock, Star, Users, Trash2, Upload, FolderPlus } from 'lucide-react';

const STATES = {
  files:   { icon: FolderOpen, title: 'This folder is empty',         sub: 'Upload files or create a folder to get started.' },
  recent:  { icon: Clock,      title: 'No recent files',              sub: 'Files you open or edit will appear here.' },
  starred: { icon: Star,       title: 'No starred items',             sub: 'Star files and folders to find them quickly.' },
  shared:  { icon: Users,      title: 'Nothing shared with you yet',  sub: 'Files and folders others share will appear here.' },
  trash:   { icon: Trash2,     title: 'Trash is empty',               sub: 'Deleted items appear here for 30 days before removal.' },
  search:  { icon: FolderOpen, title: 'No results found',             sub: 'Try a different search term.' },
};

const EmptyState = ({ type = 'files', onUpload, onCreateFolder }) => {
  const { icon: Icon, title, sub } = STATES[type] || STATES.files;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, padding: 40, textAlign: 'center' }}>
      <div className="empty-icon-ring">
        <Icon size={32} style={{ color: 'var(--text-3)' }} strokeWidth={1.5} />
      </div>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>{title}</h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-3)', maxWidth: 300, lineHeight: 1.6 }}>{sub}</p>
      {(onUpload || onCreateFolder) && (
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          {onUpload && (
            <button onClick={onUpload} className="btn btn-primary btn-sm">
              <Upload size={14} /> Upload Files
            </button>
          )}
          {onCreateFolder && (
            <button onClick={onCreateFolder} className="btn btn-secondary btn-sm">
              <FolderPlus size={14} /> New Folder
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;