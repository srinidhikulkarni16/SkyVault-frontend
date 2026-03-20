import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trashAPI } from '../lib/api';
import { formatFileSize, formatDate } from '../lib/utils';
import { RotateCcw, Trash2, AlertTriangle, X, Folder, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import EmptyState from '../components/common/EmptyState';
import PageTitle from '../components/common/PageTitle';
import FileIcon from '../components/common/FileIcon';

const ConfirmModal = ({ isOpen, onClose, onConfirm, item }) => {
  if (!isOpen || !item) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white border border-stone-200 rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden transform animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center">
              <AlertTriangle size={20} className="text-orange-600" />
            </div>
            <h2 className="text-lg font-bold text-stone-900">Delete permanently?</h2>
          </div>
          <button onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-all">
            <X size={18} />
          </button>
        </div>
        
        {/* Body */}
        <div className="px-8 py-6 text-center sm:text-left">
          <p className="text-stone-500 leading-relaxed">
            The item <span className="font-bold text-stone-900 italic">"{item.name}"</span> will be scrubbed from the vault. This action is irreversible.
          </p>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 px-6 py-5 bg-stone-50/50 border-t border-stone-100">
          <button onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 text-sm font-bold transition-all active:scale-95">
            Keep Item
          </button>
          <button onClick={onConfirm}
            className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold transition-all shadow-lg shadow-orange-600/20 active:scale-95">
            Delete Forever
          </button>
        </div>
      </div>
    </div>
  );
};

const Trash = () => {
  const qc = useQueryClient();
  const [confirm, setConfirm] = useState({ open: false, item: null });

  const { data, isLoading } = useQuery({
    queryKey: ['trash'],
    queryFn: () => trashAPI.getTrash().then((r) => r.data),
  });

  const restore = useMutation({
    mutationFn: (item) => trashAPI.restore(item.type, item.id),
    onSuccess: () => { 
      qc.invalidateQueries({ queryKey: ['trash'] }); 
      toast.success('Item restored to vault'); 
    },
  });

  const perm = useMutation({
    mutationFn: (item) => trashAPI.permanentDelete(item.type, item.id),
    onSuccess: () => { 
      qc.invalidateQueries({ queryKey: ['trash'] }); 
      toast.success('Permanently deleted'); 
    },
  });

  const emptyTrash = useMutation({
    mutationFn: () => trashAPI.emptyTrash(),
    onSuccess: () => { 
      qc.invalidateQueries({ queryKey: ['trash'] }); 
      toast.success('Trash emptied'); 
    },
  });

  const items = Array.isArray(data) ? data : [];

  const EmptyBtn = items.length > 0 ? (
    <button
      onClick={() => emptyTrash.mutate()}
      disabled={emptyTrash.isPending}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-orange-600 hover:border-orange-200 hover:bg-orange-50 text-xs font-bold transition-all disabled:opacity-50 shadow-sm active:scale-95"
    >
      <Trash2 size={14} /> Empty Trash
    </button>
  ) : null;

  return (
    <div className="flex h-screen bg-stone-50 text-stone-900 font-sans selection:bg-lime-800 selection:text-white overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header onUploadClick={null} onNewFolderClick={null} />
        
        <div className="px-6 sm:px-10 pt-8 pb-4">
          <PageTitle 
            title="Trash" 
            sub="Items are permanently deleted after 30 days" 
            action={EmptyBtn} 
          />
        </div>

        <main className="flex-1 overflow-y-auto px-6 sm:px-10 pb-10 custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3 animate-pulse">
              <Loader2 size={32} className="text-lime-800 animate-spin" />
              <p className="text-stone-400 text-sm font-medium">Loading deleted items...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="h-full flex items-center justify-center animate-in fade-in duration-700">
              <EmptyState type="trash" />
            </div>
          ) : (
            <div className="bg-white border border-stone-200 rounded-[2rem] overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="divide-y divide-stone-100">
                {items.map((item) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="group flex items-center gap-4 px-6 py-4 hover:bg-stone-50 transition-all cursor-default"
                  >
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-stone-200">
                      {item.type === 'folder'
                        ? <Folder size={22} className="text-lime-700" />
                        : <FileIcon mimeType={item.mime_type} name={item.name} size={22} />
                      }
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-stone-800 truncate">{item.name}</p>
                      <p className="text-xs text-stone-400 mt-1 flex items-center gap-2">
                        <span className="bg-stone-100 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">
                          {item.type === 'file' ? formatFileSize(item.size_bytes) : 'Folder'}
                        </span>
                        <span>•</span>
                        <span>Deleted {formatDate(item.deleted_at || item.updated_at)}</span>
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 shrink-0 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 sm:translate-x-2">
                      <button
                        onClick={() => restore.mutate(item)}
                        disabled={restore.isPending}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-lime-800 text-stone-600 hover:text-white text-xs font-bold transition-all disabled:opacity-50"
                      >
                        <RotateCcw size={14} /> Restore
                      </button>
                      <button
                        onClick={() => setConfirm({ open: true, item })}
                        disabled={perm.isPending}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-orange-600 text-stone-600 hover:text-white text-xs font-bold transition-all disabled:opacity-50"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      <ConfirmModal
        isOpen={confirm.open}
        onClose={() => setConfirm({ open: false, item: null })}
        item={confirm.item}
        onConfirm={() => { 
          perm.mutate(confirm.item); 
          setConfirm({ open: false, item: null }); 
        }}
      />
    </div>
  );
};

export default Trash;