import React from 'react';
import { FolderOpen, Clock, Star, Users, Trash2, Upload, FolderPlus, Search } from 'lucide-react';

const STATES = {
  files:   { icon: FolderOpen, title: 'This folder is empty',         sub: 'Your vault is ready. Upload files or create a folder to get started.' },
  recent:  { icon: Clock,      title: 'No recent activity',           sub: 'Files you open or edit will appear here for quick access.'          },
  starred: { icon: Star,       title: 'No favorites yet',             sub: 'Star important files and folders to keep them within reach.'        },
  shared:  { icon: Users,      title: 'Nothing shared with you',      sub: 'Collaborations and shared resources will appear in this space.'     },
  trash:   { icon: Trash2,     title: 'Your trash is empty',          sub: 'Deleted items are moved here for 30 days before permanent removal.' },
  search:  { icon: Search,     title: 'No results found',             sub: 'We couldn’t find what you’re looking for. Try a different term.'   },
};

const EmptyState = ({ type = 'files', onUpload, onCreateFolder }) => {
  const { icon: Icon, title, sub } = STATES[type] || STATES.files;

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-20 px-6 text-center animate-in fade-in zoom-in-95 duration-700">
      {/* Decorative Icon Container */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-lime-200/20 rounded-3xl blur-xl animate-pulse"></div>
        <div className="relative w-20 h-20 rounded-[2rem] bg-white border border-stone-200 flex items-center justify-center shadow-sm">
          <Icon size={32} className="text-lime-800" strokeWidth={1.5} />
        </div>
      </div>

      {/* Text Content */}
      <h3 className="text-xl font-bold text-stone-900 mb-2 tracking-tight">
        {title}
      </h3>
      <p className="text-stone-500 max-w-[320px] leading-relaxed font-medium">
        {sub}
      </p>

      {/* Action Buttons */}
      {(onUpload || onCreateFolder) && (
        <div className="flex flex-col sm:flex-row gap-3 mt-10">
          {onUpload && (
            <button 
              onClick={onUpload}
              className="group flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-lime-800 hover:bg-lime-900 text-white text-sm font-bold transition-all shadow-lg shadow-lime-900/20 active:scale-95"
            >
              <Upload size={16} className="group-hover:-translate-y-0.5 transition-transform" />
              Upload Files
            </button>
          )}
          {onCreateFolder && (
            <button 
              onClick={onCreateFolder}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-stone-200 bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 text-sm font-bold transition-all shadow-sm active:scale-95"
            >
              <FolderPlus size={16} />
              New Folder
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;