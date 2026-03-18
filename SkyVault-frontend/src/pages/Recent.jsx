import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fileAPI } from '../lib/api';
import { useFileStore } from '../store/fileStore';
import toast from 'react-hot-toast';

// Fixed Imports: Changed from ../../ to ../
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

// File/Folder components
import FileCard from "../components/files/FileCard";
import FileList from "../components/files/FileList";

// Modals and Common
import EmptyState from "../components/common/EmptyState";
import ShareModal from '../components/modals/ShareModal';
import FilePreviewModal from '../components/modals/FilePreviewModal';

const Recent = () => {
  const { viewMode } = useFileStore();

  const [shareModal, setShareModal] = useState({ open: false, item: null });
  const [previewModal, setPreviewModal] = useState({ open: false, file: null });

  const { data: files, isLoading } = useQuery({
    queryKey: ['recentFiles'],
    queryFn: () => fileAPI.getRecentFiles().then((res) => res.data),
  });

  const handleDownload = async (file) => {
    try {
      const { data } = await fileAPI.downloadFile(file.id);
      window.open(data.url, '_blank');
      toast.success('Download started');
    } catch (error) {
      toast.error('Failed to download file');
    }
  };

  const handleFileClick = (file) => {
    setPreviewModal({ open: true, file });
  };

  const items = files || [];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col ml-64">
        {/* Header with empty callbacks as this is a filtered view */}
        <Header onUploadClick={() => {}} onNewFolderClick={() => {}} />

        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Recent</h1>
          <p className="text-sm text-gray-500 mt-1">Files you've opened or edited recently</p>
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : items.length === 0 ? (
            <EmptyState type="recent" />
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {items.map((file) => (
                <FileCard
                  key={`file-${file.id}`}
                  file={file}
                  onDownload={() => handleDownload(file)}
                  onRename={() => {}}
                  onMove={() => {}}
                  onDelete={() => {}}
                  onShare={() => setShareModal({ open: true, item: file })}
                  onStar={() => {}}
                  onClick={handleFileClick}
                />
              ))}
            </div>
          ) : (
            <FileList
              items={items}
              onDownload={handleDownload}
              onRename={() => {}}
              onMove={() => {}}
              onDelete={() => {}}
              onShare={(item) => setShareModal({ open: true, item })}
              onStar={() => {}}
              onClick={handleFileClick}
            />
          )}
        </main>
      </div>

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
        onShare={(file) => setShareModal({ open: true, item: { ...file, type: 'file' } })}
      />
    </div>
  );
};

export default Recent;