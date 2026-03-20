import React, { useState, useEffect } from 'react';
import { X, FolderPlus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';

const NewFolderModal = ({ isOpen, onClose, parentFolderId, onCreateFolder }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (isOpen) setName(''); }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { toast.error('Folder name cannot be empty'); return; }
    setLoading(true);
    try {
      await onCreateFolder({ name: name.trim(), parent_id: parentFolderId || null });
      toast.success('Folder created successfully');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create folder');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-stone-900/40 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white border border-stone-200 rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-stone-100 bg-stone-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-lime-800 flex items-center justify-center shrink-0 shadow-lg shadow-lime-900/20">
              <FolderPlus size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-base font-black text-stone-900 tracking-tight">New Folder</h2>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-200 transition-all active:scale-90"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="px-8 py-8">
            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-3 ml-1">
              Identify Your Space
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Untitled folder"
              autoFocus
              className="w-full px-5 py-3.5 text-sm font-bold rounded-2xl border border-stone-200 bg-stone-50/50 text-stone-900 placeholder-stone-300 outline-none focus:ring-4 focus:ring-lime-800/10 focus:border-lime-800 focus:bg-white transition-all shadow-inner"
            />
            <p className="mt-3 ml-1 text-[11px] font-medium text-stone-400 italic">
              Keep it descriptive for a more organized vault.
            </p>
          </div>

          {/* Action Footer */}
          <div className="flex justify-end gap-3 px-8 py-6 border-t border-stone-100 bg-stone-50/30">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 rounded-2xl border border-stone-200 bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 text-sm font-bold transition-all active:scale-95 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="px-8 py-3 rounded-2xl bg-lime-800 hover:bg-lime-900 text-white text-sm font-black transition-all active:scale-95 shadow-lg shadow-lime-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                'Create Folder'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewFolderModal;