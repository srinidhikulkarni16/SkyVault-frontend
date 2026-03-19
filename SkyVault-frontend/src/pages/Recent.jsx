import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fileAPI } from '../lib/api';
import { useFileStore } from '../store/fileStore';
import toast from 'react-hot-toast';

import Sidebar   from '../components/layout/Sidebar';
import Header    from '../components/layout/Header';
import FileCard  from '../components/files/FileCard';
import FileList  from '../components/files/FileList';
import EmptyState from '../components/common/EmptyState';
import Skeletons  from '../components/common/Skeletons';
import PageTitle  from '../components/common/PageTitle';
import ShareModal from '../components/modals/ShareModal';
import FilePreviewModal from '../components/modals/FilePreviewModal';

const Recent = () => {
  const { viewMode } = useFileStore();
  const [shareModal,   setShareModal]   = useState({ open: false, item: null });
  const [previewModal, setPreviewModal] = useState({ open: false, file: null });

  const { data, isLoading } = useQuery({
    queryKey: ['recentFiles'],
    queryFn:  () => fileAPI.getRecentFiles().then((r) => r.data),
  });

  const handleDownload = async (file) => {
    try {
      const { data } = await fileAPI.downloadFile(file.id);
      window.open(data.url, '_blank');
      toast.success('Download started');
    } catch { toast.error('Download failed'); }
  };

  const items = Array.isArray(data) ? data : [];

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-main">
        <Header onUploadClick={null} onNewFolderClick={null} />
        <PageTitle title="Recent" sub="Files you've recently accessed or modified" />
        <main className="page-content">
          {isLoading ? (
            <Skeletons count={8} viewMode={viewMode} />
          ) : items.length === 0 ? (
            <EmptyState type="recent" />
          ) : viewMode === 'grid' ? (
            <div className="grid-files">
              {items.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  onDownload={() => handleDownload(file)}
                  onRename={() => {}} onMove={() => {}} onDelete={() => {}}
                  onShare={() => setShareModal({ open: true, item: file })}
                  onStar={() => {}}
                  onClick={(f) => setPreviewModal({ open: true, file: f })}
                />
              ))}
            </div>
          ) : (
            <FileList
              items={items}
              onDownload={handleDownload}
              onRename={() => {}} onMove={() => {}} onDelete={() => {}}
              onShare={(i) => setShareModal({ open: true, item: i })}
              onStar={() => {}}
              onClick={(i) => setPreviewModal({ open: true, file: i })}
            />
          )}
        </main>
      </div>
      <ShareModal isOpen={shareModal.open} onClose={() => setShareModal({ open: false, item: null })} item={shareModal.item} />
      <FilePreviewModal isOpen={previewModal.open} onClose={() => setPreviewModal({ open: false, file: null })} file={previewModal.file} onDownload={handleDownload} onShare={(f) => setShareModal({ open: true, item: { ...f, type: 'file' } })} />
    </div>
  );
};

export default Recent;