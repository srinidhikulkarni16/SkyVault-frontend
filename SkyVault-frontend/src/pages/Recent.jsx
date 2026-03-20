import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fileAPI } from '../lib/api';
import { useFileStore } from '../store/fileStore';
import toast from 'react-hot-toast';

// Layout & UI Components
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import FileCard from '../components/files/FileCard';
import FileList from '../components/files/FileList';
import EmptyState from '../components/common/EmptyState';
import Skeletons from '../components/common/Skeletons';
import PageTitle from '../components/common/PageTitle';

// Modals
import ShareModal from '../components/modals/ShareModal';
import FilePreviewModal from '../components/modals/FilePreviewModal';

export const Recent = () => {
  const { viewMode } = useFileStore();
  const [shareModal, setShareModal] = useState({ open: false, item: null });
  const [previewModal, setPreviewModal] = useState({ open: false, file: null });

  const { data, isLoading } = useQuery({
    queryKey: ['recentFiles'],
    queryFn: () => fileAPI.getRecentFiles().then((r) => r.data),
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

  return (
    <div className="flex h-screen bg-stone-50 text-stone-900 font-sans selection:bg-lime-800 selection:text-white overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header with disabled upload/folder actions for Recent view */}
        <Header onUploadClick={null} onNewFolderClick={null} />

        <div className="px-6 sm:px-10 pt-8 pb-4">
          <PageTitle 
            title="Recent Activity" 
            sub="Files you've recently accessed or modified" 
            className="text-stone-900"
          />
        </div>

        <main className="flex-1 overflow-y-auto px-6 sm:px-10 pb-10 custom-scrollbar focus:outline-none">
          {isLoading ? (
            <div className="mt-4">
              <Skeletons count={8} viewMode={viewMode} />
            </div>
          ) : items.length === 0 ? (
            <div className="h-full flex items-center justify-center animate-in fade-in duration-700">
              <EmptyState type="recent" />
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6 mt-4 animate-in slide-in-from-bottom-4 duration-500">
              {items.map((file) => (
                <div 
                  key={file.id} 
                  className="group transform transition-all duration-300 hover:-translate-y-1.5 active:scale-95"
                >
                  <FileCard
                    file={file}
                    onDownload={() => handleDownload(file)}
                    onRename={() => {}} 
                    onMove={() => {}} 
                    onDelete={() => {}}
                    onShare={() => setShareModal({ open: true, item: file })}
                    onStar={() => {}}
                    onClick={(f) => setPreviewModal({ open: true, file: f })}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden transition-all duration-300 hover:shadow-md animate-in fade-in">
              <FileList
                items={items}
                onDownload={handleDownload}
                onRename={() => {}}
                onMove={() => {}}
                onDelete={() => {}}
                onShare={(i) => setShareModal({ open: true, item: i })}
                onStar={() => {}}
                onClick={(i) => setPreviewModal({ open: true, file: i })}
              />
            </div>
          )}
        </main>
      </div>

      {/* Shared Modals */}
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

export default Recent;