import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { starAPI, fileAPI } from '../lib/api';
import { useFileStore } from '../store/fileStore';
import toast from 'react-hot-toast';

import Sidebar   from '../components/layout/Sidebar';
import Header    from '../components/layout/Header';
import FileCard  from '../components/files/FileCard';
import FolderCard from '../components/files/FolderCard';
import FileList  from '../components/files/FileList';
import EmptyState from '../components/common/EmptyState';
import Skeletons  from '../components/common/Skeletons';
import PageTitle  from '../components/common/PageTitle';
import ShareModal from '../components/modals/ShareModal';
import FilePreviewModal from '../components/modals/FilePreviewModal';

const Starred = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { viewMode } = useFileStore();
  const [shareModal,   setShareModal]   = useState({ open: false, item: null });
  const [previewModal, setPreviewModal] = useState({ open: false, file: null });

  const { data, isLoading } = useQuery({
    queryKey: ['starred'],
    queryFn:  () => starAPI.getStarred().then((r) => r.data),
  });

  const unstar = useMutation({
    mutationFn: (item) => starAPI.unstar(item.type, item.id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['starred'] }); toast.success('Removed from starred'); },
  });

  const handleDownload = async (file) => {
    try { const { data } = await fileAPI.downloadFile(file.id); window.open(data.url, '_blank'); }
    catch { toast.error('Download failed'); }
  };

  const items = Array.isArray(data) ? data : [];

  const commonProps = {
    onDownload: handleDownload,
    onRename: () => {},
    onMove:   () => {},
    onDelete: () => {},
    onShare:  (item) => setShareModal({ open: true, item }),
    onStar:   (item) => unstar.mutate(item),
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-main">
        <Header onUploadClick={null} onNewFolderClick={null} />
        <PageTitle title="Starred" sub="Important files and folders you've starred" />
        <main className="page-content">
          {isLoading ? <Skeletons count={8} viewMode={viewMode} />
           : items.length === 0 ? <EmptyState type="starred" />
           : viewMode === 'grid' ? (
            <div className="grid-files">
              {items.map((item) =>
                item.type === 'folder' ? (
                  <FolderCard key={`f-${item.id}`} folder={item} onOpen={() => navigate(`/folder/${item.id}`)} {...commonProps} />
                ) : (
                  <FileCard key={`fi-${item.id}`} file={item} onClick={(f) => setPreviewModal({ open: true, file: f })} {...commonProps} />
                )
              )}
            </div>
          ) : (
            <FileList items={items} {...commonProps} onClick={(item) => item.type === 'folder' ? navigate(`/folder/${item.id}`) : setPreviewModal({ open: true, file: item })} />
          )}
        </main>
      </div>
      <ShareModal isOpen={shareModal.open} onClose={() => setShareModal({ open: false, item: null })} item={shareModal.item} />
      <FilePreviewModal isOpen={previewModal.open} onClose={() => setPreviewModal({ open: false, file: null })} file={previewModal.file} onDownload={handleDownload} onShare={(f) => setShareModal({ open: true, item: { ...f, type: 'file' } })} />
    </div>
  );
};

export default Starred;