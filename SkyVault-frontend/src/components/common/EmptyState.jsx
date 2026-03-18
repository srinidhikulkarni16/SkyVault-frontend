import React from 'react';
import { FolderOpen, Upload, Search, Inbox, Trash2, Star, Clock } from 'lucide-react';

const EmptyState = ({ type = 'files', onUpload, onCreateFolder }) => {
  const states = {
    files: {
      icon: FolderOpen,
      title: 'No files or folders',
      description: 'Upload files or create a folder to get started',
      actions: [
        { label: 'Upload files', onClick: onUpload, primary: true },
        { label: 'New folder', onClick: onCreateFolder, primary: false },
      ],
    },
    search: {
      icon: Search,
      title: 'No results found',
      description: 'Try adjusting your search or filters',
      actions: [],
    },
    trash: {
      icon: Trash2,
      title: 'Trash is empty',
      description: 'Items you delete will appear here for 30 days',
      actions: [],
    },
    starred: {
      icon: Star,
      title: 'No starred items',
      description: 'Star important files and folders to find them quickly',
      actions: [],
    },
    recent: {
      icon: Clock,
      title: 'No recent files',
      description: 'Files you open or edit will appear here',
      actions: [],
    },
    shared: {
      icon: Inbox,
      title: 'No shared files',
      description: 'Files shared with you will appear here',
      actions: [],
    },
  };

  const state = states[type] || states.files;
  const Icon = state.icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <Icon className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{state.title}</h3>
      <p className="text-gray-500 mb-8 text-center max-w-md">{state.description}</p>
      
      {state.actions.length > 0 && (
        <div className="flex gap-3">
          {state.actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                action.primary
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmptyState;