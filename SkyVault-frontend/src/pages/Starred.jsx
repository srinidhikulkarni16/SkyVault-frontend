import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { starAPI, fileAPI } from '../lib/api';
import { useFileStore } from '../store/fileStore';
import toast from 'react-hot-toast';

// Fixed Layout Imports: Moved from ../../ to ../
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

// File/Folder components
import FileCard from "../components/files/FileCard";
import FolderCard from "../components/files/FolderCard";
import FileList from "../components/files/FileList";

// Modals and Common
import EmptyState from "../components/common/EmptyState";
import ShareModal from '../components/modals/ShareModal';
import FilePreviewModal from '../components/modals/FilePreviewModal';

const Starred = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { viewMode } = useFileStore();

  const [shareModal, setShareModal] = useState({ open: false, item: null });
  const [previewModal, setPreviewModal] = useState({ open: false, file: null });

  // Fetch starred items
  const { data, isLoading } = useQuery({
    queryKey: ['starred'],
    queryFn: () => starAPI.getStarred().then((res) => res.data),
  });

  // Mutation to unstar items
  const unstarMutation = useMutation({
    mutationFn: (item) => starAPI.unstar(item.type, item.id),
    onSuccess: () => {
      queryClient.invalidateQueries(['starred']);
      toast.success('Removed from starred');
    },
    onError: () => {
      toast.error('Failed to update star status');
    }
  });

  const handleDownload = async (file) => {
    try {
      const { data } = await fileAPI.downloadFile(file.id);
      window.open(data.url, '_blank');
    } catch (error) {
      toast.error('Failed to download');
    }
  };

  const handleFileClick = (file) => {
    setPreviewModal({ open: true, file });
  };

  const handleFolderOpen = (folder) => {
    navigate(`/folder/${folder.id}`);
  };

  // Ensure items is defined even if data is still loading
  const items = data || [];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col ml-64">
        <Header onUploadClick={() => {}} onNewFolderClick={() => {}} />

        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Starred</h1>
          <p className="text-sm text-gray-500 mt-1">Important files and folders you've starred</p>
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : items.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {items.map((item) =>
                  item.type === 'folder' ? (
                    <FolderCard
                      key={`folder-${item.id}`}
                      folder={item}
                      onOpen={() => handleFolderOpen(item)}
                      onRename={() => {}}
                      onMove={() => {}}
                      onDelete={() => {}}
                      onShare={() => setShareModal({ open: true, item })}
                      onStar={() => unstarMutation.mutate(item)}
                    />
                  ) : (
                    <FileCard
                      key={`file-${item.id}`}
                      file={item}
                      onDownload={() => handleDownload(item)}
                      onRename={() => {}}
                      onMove={() => {}}
                      onDelete={() => {}}
                      onShare={() => setShareModal({ open: true, item })}
                      onStar={() => unstarMutation.mutate(item)}
                      onClick={handleFileClick}
                    />
                  )
                )}
              </div>
            ) : (
              <FileList
                items={items}
                onDownload={handleDownload}
                onRename={() => {}}
                onMove={() => {}}
                onDelete={() => {}}
                onShare={(item) => setShareModal({ open: true, item })}
                onStar={(item) => unstarMutation.mutate(item)}
                onClick={(item) => item.type === 'folder' ? handleFolderOpen(item) : handleFileClick(item)}
              />
            )
          ) : (
            <EmptyState type="starred" />
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

export default Starred;