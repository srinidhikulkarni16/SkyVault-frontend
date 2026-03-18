import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const DeleteModal = ({ isOpen, onClose, item, onDelete }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(item);
      toast.success(`${item.type === 'folder' ? 'Folder' : 'File'} moved to trash`);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete');
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Delete {item.type === 'folder' ? 'Folder' : 'File'}?</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete <span className="font-semibold">"{item.name}"</span>?
          </p>
          {item.type === 'folder' && (
            <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
              This will also delete all files and folders inside.
            </p>
          )}
          <p className="text-sm text-gray-500 mt-4">
            Items can be restored from trash within 30 days.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="btn bg-red-600 hover:bg-red-700 text-white"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Move to Trash'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;