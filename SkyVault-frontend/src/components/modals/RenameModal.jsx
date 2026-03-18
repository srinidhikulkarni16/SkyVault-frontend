import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

const RenameModal = ({ isOpen, onClose, item, onRename }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setName(item.name || '');
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    if (name === item?.name) {
      onClose();
      return;
    }

    setLoading(true);
    try {
      await onRename(item, name.trim());
      toast.success(`${item.type === 'folder' ? 'Folder' : 'File'} renamed successfully`);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to rename');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !item) return null;

  return (
    <div className="modal-overlay">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Rename {item.type === 'folder' ? 'Folder' : 'File'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="Enter name..."
              autoFocus
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
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
              {loading ? 'Renaming...' : 'Rename'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RenameModal;