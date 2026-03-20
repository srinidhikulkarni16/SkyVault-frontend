import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { starAPI, fileAPI } from '../lib/api';
import { useFileStore } from '../store/fileStore';
import toast from 'react-hot-toast';

import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import FileCard from '../components/files/FileCard';
import FolderCard from '../components/files/FolderCard';
import FileList from '../components/files/FileList';
import EmptyState from '../components/common/EmptyState';
import Skeletons from '../components/common/Skeletons';
import PageTitle from '../components/common/PageTitle';
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

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['starred'] });
    // Also bust dashboard cache so star indicators update when user goes back
    qc.invalidateQueries({ queryKey: ['files'] });
    qc.invalidateQueries({ queryKey: ['folders'] });
  };

  // Items on this page always have is_starred: true (they came from /stars).
  // Clicking star here always REMOVES from starred.
  const handleStar = async (item) => {
    if (!item?.id) return;
    const type = item.type || (item.mime_type ? 'file' : 'folder');
    try {
      await starAPI.unstar(type, item.id);
      toast.success('Removed from starred');
      invalidate();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to remove from starred');
    }
  };

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
    onRename:   () => {},
    onMove:     () => {},
    onDelete:   () => {},
    onShare:    (item) => setShareModal({ open: true, item }),
    onStar:     handleStar,
  };

  return (
    <div className="flex h-screen bg-stone-50 text-stone-900 font-sans selection:bg-lime-800 selection:text-white overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header onUploadClick={null} onNewFolderClick={null} />

        <div className="px-6 sm:px-10 pt-8 pb-4">
          <div className="bg-white/40 backdrop-blur-md p-4 rounded-2xl border border-stone-200/50 shadow-sm animate-in fade-in slide-in-from-top-2 duration-500">
            <PageTitle title="Starred" sub="Important files and folders you've marked as favorites" />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto px-6 sm:px-10 pb-10">
          {isLoading ? (
            <div className="mt-4"><Skeletons count={8} viewMode={viewMode} /></div>
          ) : items.length === 0 ? (
            <div className="h-full flex items-center justify-center animate-in fade-in zoom-in-95 duration-700">
              <EmptyState type="starred" />
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {items.map((item) => (
                <div key={`${item.type}-${item.id}`} className="group transform transition-all duration-300 hover:-translate-y-2 active:scale-95">
                  {item.type === 'folder' ? (
                    <FolderCard folder={item} onOpen={() => navigate(`/folder/${item.id}`)} {...commonProps} />
                  ) : (
                    <FileCard file={item} onClick={(f) => setPreviewModal({ open: true, file: f })} {...commonProps} />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden animate-in fade-in">
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

      <ShareModal isOpen={shareModal.open} onClose={() => setShareModal({ open: false, item: null })} item={shareModal.item} />
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