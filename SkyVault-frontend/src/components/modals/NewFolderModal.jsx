import React, { useState } from 'react';
import { X, FolderPlus } from 'lucide-react';
import toast from 'react-hot-toast';

const NewFolderModal = ({ isOpen, onClose, parentFolderId, onCreateFolder }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Folder name cannot be empty');
      return;
    }

    setLoading(true);
    try {
      await onCreateFolder({ name: name.trim(), parent_id: parentFolderId });
      toast.success('Folder created successfully');
      setName('');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create folder');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={handleClose}>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FolderPlus className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">New Folder</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Folder name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Untitled folder"
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-2">
              Create a new folder in the current location
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !name.trim()}
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewFolderModal;