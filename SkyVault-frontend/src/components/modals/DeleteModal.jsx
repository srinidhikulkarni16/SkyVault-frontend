import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';

const DeleteModal = ({ isOpen, onClose, item, onDelete }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(item);
      toast.success('Moved to trash');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-stone-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white border border-stone-200 rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-stone-100 bg-stone-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center shrink-0 shadow-sm shadow-red-100">
              <AlertTriangle size={18} className="text-red-600" strokeWidth={2.5} />
            </div>
            <h2 className="text-base font-black text-stone-900 tracking-tight">
              Delete {item.type === 'folder' ? 'Folder' : 'File'}?
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-200 transition-all active:scale-90"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-8 flex flex-col gap-5">
          <p className="text-sm font-medium text-stone-500 leading-relaxed">
            Are you sure you want to move{' '}
            <span className="font-bold text-stone-900 italic underline decoration-lime-800/30 underline-offset-4">
              "{item.name}"
            </span>{' '}
            to the trash?
          </p>

          {item.type === 'folder' && (
            <div className="px-4 py-3 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3 items-start animate-pulse-subtle">
              <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider leading-tight">
                Warning: All contents inside this folder will also be archived.
              </p>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs font-semibold text-stone-400">
            <div className="w-1 h-1 rounded-full bg-stone-300" />
            Items can be restored from Trash within 30 days.
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 px-8 py-6 border-t border-stone-100 bg-stone-50/30">
          <button
            onClick={onClose}
            disabled={loading}
            className="order-2 sm:order-1 px-6 py-3 rounded-2xl border border-stone-200 bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 text-sm font-bold transition-all active:scale-95 disabled:opacity-50"
          >
            Keep it
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="order-1 sm:order-2 px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-all active:scale-95 shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Move to Trash'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;