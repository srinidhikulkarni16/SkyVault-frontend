import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { starAPI, fileAPI } from '../lib/api';
import { useFileStore } from '../store/fileStore';
import toast from 'react-hot-toast';

// Layout & UI Components
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import FileCard from '../components/files/FileCard';
import FolderCard from '../components/files/FolderCard';
import FileList from '../components/files/FileList';
import EmptyState from '../components/common/EmptyState';
import Skeletons from '../components/common/Skeletons';
import PageTitle from '../components/common/PageTitle';

// Modals
import ShareModal from '../components/modals/ShareModal';
import FilePreviewModal from '../components/modals/FilePreviewModal';

const Starred = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { viewMode } = useFileStore();
  const [shareModal, setShareModal] = useState({ open: false, item: null });
  const [previewModal, setPreviewModal] = useState({ open: false, file: null });

  const { data, isLoading } = useQuery({
    queryKey: ['starred'],
    queryFn: () => starAPI.getStarred().then((r) => r.data),
  });

  const unstar = useMutation({
    mutationFn: (item) => starAPI.unstar(item.type, item.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['starred'] });
      toast.success('Removed from starred');
    },
    onError: () => toast.error('Failed to update favorites'),
  });

  const handleDownload = async (file) => {
    try {
      const { data } = await fileAPI.downloadFile(file.id);
      window.open(data.url, '_blank');
      toast.success('Download started');
    } catch {
      toast.error('Download failed');
    }
  };

  const items = Array.isArray(data) ? data : [];

  const commonProps = {
    onDownload: handleDownload,
    onRename: () => {}, // Handled in individual modals if required
    onMove: () => {},
    onDelete: () => {},
    onShare: (item) => setShareModal({ open: true, item }),
    onStar: (item) => unstar.mutate(item),
  };

  return (
    <div className="flex h-screen bg-stone-50 text-stone-900 font-sans selection:bg-lime-800 selection:text-white overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Actions disabled for Starred view per original code structure */}
        <Header onUploadClick={null} onNewFolderClick={null} />

        <div className="px-6 sm:px-10 pt-8 pb-4">
          <div className="bg-white/40 backdrop-blur-md p-4 rounded-2xl border border-stone-200/50 shadow-sm animate-in fade-in slide-in-from-top-2 duration-500">
            <PageTitle 
              title="Starred" 
              sub="Important files and folders you've marked as favorites" 
              className="text-stone-900"
            />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto px-6 sm:px-10 pb-10 custom-scrollbar focus:outline-none">
          {isLoading ? (
            <div className="mt-4">
              <Skeletons count={8} viewMode={viewMode} />
            </div>
          ) : items.length === 0 ? (
            <div className="h-full flex items-center justify-center animate-in fade-in zoom-in-95 duration-700">
              <EmptyState type="starred" />
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {items.map((item) => (
                <div 
                  key={item.type === 'folder' ? `f-${item.id}` : `fi-${item.id}`} 
                  className="group transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-lime-900/5 active:scale-95"
                >
                  {item.type === 'folder' ? (
                    <FolderCard 
                      folder={item} 
                      onOpen={() => navigate(`/folder/${item.id}`)} 
                      {...commonProps} 
                    />
                  ) : (
                    <FileCard 
                      file={item} 
                      onClick={(f) => setPreviewModal({ open: true, file: f })} 
                      {...commonProps} 
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden transition-all duration-300 hover:shadow-md animate-in fade-in">
              <FileList 
                items={items} 
                {...commonProps}
                onClick={(item) => 
                  item.type === 'folder' 
                    ? navigate(`/folder/${item.id}`) 
                    : setPreviewModal({ open: true, file: item })
                } 
              />
            </div>
          )}
        </main>
      </div>

      {/* Shared Overlays */}
      <ShareModal 
        isOpen={shareModal.open} 
        onClose={() => setShareModal({ open: false, item: null })} 
        item={shareModal.item} 
      />
      
      <FilePreviewModal 
        isOpen={previewModal.open} 
        onClose={() => setPreviewModal({ open: false, file: null })} 
        file={previewModal.file} 
        onDownload={handleDownload} 
        onShare={(f) => setShareModal({ open: true, item: { ...f, type: 'file' } })} 
      />
    </div>
  );
};

export default Starred;