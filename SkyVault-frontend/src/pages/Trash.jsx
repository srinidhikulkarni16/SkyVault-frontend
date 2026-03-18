import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trashAPI, fileAPI } from '../lib/api'; // Corrected (one level up to src)
import { useFileStore } from "../store/fileStore"; // Corrected
import { formatFileSize, formatDate } from "../lib/utils"; // Corrected
import toast from 'react-hot-toast';
import { RotateCcw, Trash2, AlertTriangle, X } from 'lucide-react';

// Layout components - Change from ../../ to ../
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import EmptyState from "../components/common/EmptyState";

const ConfirmDeleteModal = ({ isOpen, onClose, item, onConfirm }) => {
  if (!isOpen || !item) return null;

  return (
    <div className="modal-overlay">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-slide-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Permanent Delete?</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-gray-700">
            Are you sure you want to permanently delete <span className="font-semibold">"{item.name}"</span>? 
            This action cannot be undone.
          </p>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button onClick={onClose} className="btn btn-secondary">Cancel</button>
          <button onClick={onConfirm} className="btn bg-red-600 hover:bg-red-700 text-white">Delete Forever</button>
        </div>
      </div>
    </div>
  );
};

const Trash = () => {
  const queryClient = useQueryClient();
  const [confirmModal, setConfirmModal] = useState({ open: false, item: null });

  const { data: trashItems, isLoading } = useQuery({
    queryKey: ['trash'],
    queryFn: () => trashAPI.getTrash().then((res) => res.data),
  });

  const restoreMutation = useMutation({
    mutationFn: (item) => trashAPI.restore(item.type, item.id),
    onSuccess: () => {
      queryClient.invalidateQueries(['trash']);
      toast.success('Item restored');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (item) => trashAPI.permanentDelete(item.type, item.id),
    onSuccess: () => {
      queryClient.invalidateQueries(['trash']);
      toast.success('Item permanently deleted');
    },
  });

  const handleRestore = (item) => {
    restoreMutation.mutate(item);
  };

  const handlePermanentDelete = (item) => {
    setConfirmModal({ open: true, item });
  };

  const confirmDelete = () => {
    if (confirmModal.item) {
      deleteMutation.mutate(confirmModal.item);
      setConfirmModal({ open: false, item: null });
    }
  };

  const items = trashItems || [];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col ml-64">
        <Header onUploadClick={() => {}} onNewFolderClick={() => {}} />

        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Trash</h1>
            <p className="text-sm text-gray-500 mt-1">Items here will be deleted after 30 days</p>
          </div>
          {items.length > 0 && (
            <button
              onClick={() => toast.error('Empty trash not implemented')}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              <Trash2 className="w-5 h-5" />
              Empty Trash
            </button>
          )}
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : items.length === 0 ? (
            <EmptyState type="trash" />
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={`${item.type}-${item.id}`} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Trash2 className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{item.type === 'file' ? formatFileSize(item.size_bytes) : 'Folder'}</span>
                          <span>•</span>
                          <span>Deleted on {formatDate(item.deleted_at)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRestore(item)}
                        disabled={restoreMutation.isLoading}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Restore
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(item)}
                        disabled={deleteMutation.isLoading}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Forever
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      <ConfirmDeleteModal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, item: null })}
        item={confirmModal.item}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default Trash;