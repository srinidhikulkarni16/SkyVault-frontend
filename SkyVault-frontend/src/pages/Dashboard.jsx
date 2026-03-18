import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fileAPI, folderAPI, starAPI } from '../lib/api';
import { useFileStore } from '../store/fileStore';
import { generateBreadcrumbs } from '../lib/utils';
import toast from 'react-hot-toast';

// Layout components
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import Breadcrumb from '../components/layout/Breadcrumb';

// File/Folder components
import FileCard from '../components/files/FileCard';
import FolderCard from '../components/files/FolderCard';
import FileList from '../components/files/FileList';

// Modals
import UploadModal from '../components/modals/UploadModal';
import NewFolderModal from '../components/modals/NewFolderModal';
import RenameModal from '../components/modals/RenameModal';
import DeleteModal from '../components/modals/DeleteModal';
import ShareModal from '../components/modals/ShareModal';
import MoveModal from '../components/modals/MoveModal';
import FilePreviewModal from '../components/modals/FilePreviewModal';

// Common components
import EmptyState from '../components/common/EmptyState';
const Dashboard = () => {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { 
    viewMode, 
    setFiles, 
    setFolders, 
    setCurrentFolderId, 
    setBreadcrumbs,
    getSortedAndFilteredItems 
  } = useFileStore();

  // Modal states
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newFolderModalOpen, setNewFolderModalOpen] = useState(false);
  const [renameModal, setRenameModal] = useState({ open: false, item: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null });
  const [shareModal, setShareModal] = useState({ open: false, item: null });
  const [moveModal, setMoveModal] = useState({ open: false, item: null });
  const [previewModal, setPreviewModal] = useState({ open: false, file: null });

  // Fetch folders
  const { data: folderData, isLoading: foldersLoading } = useQuery({
    queryKey: ['folders', folderId],
    queryFn: () => folderAPI.getFolders(folderId).then((res) => res.data),
    onSuccess: (data) => setFolders(data),
  });

  // Fetch files
  const { data: fileData, isLoading: filesLoading } = useQuery({
    queryKey: ['files', folderId],
    queryFn: () => fileAPI.getFiles(folderId).then((res) => res.data),
    onSuccess: (data) => setFiles(data),
  });

  useEffect(() => {
    setCurrentFolderId(folderId || null);
    if (folderData) {
      setBreadcrumbs(generateBreadcrumbs(folderData, folderId));
    }
  }, [folderId, folderData]);

  // Mutations
  const createFolderMutation = useMutation({
    mutationFn: (data) => folderAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['folders', folderId]);
      toast.success('Folder created');
    },
  });

  const renameMutation = useMutation({
    mutationFn: ({ item, name }) => 
      item.type === 'folder' 
        ? folderAPI.rename(item.id, name)
        : fileAPI.rename(item.id, name),
    onSuccess: () => {
      queryClient.invalidateQueries(['folders', folderId]);
      queryClient.invalidateQueries(['files', folderId]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (item) => 
      item.type === 'folder'
        ? folderAPI.delete(item.id)
        : fileAPI.delete(item.id),
    onSuccess: () => {
      queryClient.invalidateQueries(['folders', folderId]);
      queryClient.invalidateQueries(['files', folderId]);
    },
  });

  const starMutation = useMutation({
    mutationFn: (item) => starAPI.star(item.type, item.id),
    onSuccess: () => {
      queryClient.invalidateQueries(['folders', folderId]);
      queryClient.invalidateQueries(['files', folderId]);
      toast.success('Added to starred');
    },
  });

  const unstarMutation = useMutation({
    mutationFn: (item) => starAPI.unstar(item.type, item.id),
    onSuccess: () => {
      queryClient.invalidateQueries(['folders', folderId]);
      queryClient.invalidateQueries(['files', folderId]);
      toast.success('Removed from starred');
    },
  });

  const moveMutation = useMutation({
    mutationFn: ({ item, targetFolderId }) =>
      item.type === 'folder'
        ? folderAPI.move(item.id, targetFolderId)
        : fileAPI.move(item.id, targetFolderId),
    onSuccess: () => {
      queryClient.invalidateQueries(['folders', folderId]);
      queryClient.invalidateQueries(['files', folderId]);
    },
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

  const items = getSortedAndFilteredItems();
  const isLoading = foldersLoading || filesLoading;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col ml-64">
        <Header 
          onUploadClick={() => setUploadModalOpen(true)}
          onNewFolderClick={() => setNewFolderModalOpen(true)}
        />
        
        <Breadcrumb />

        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : items.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {items.map((item) => (
                  item.type === 'folder' ? (
                    <FolderCard
                      key={`folder-${item.id}`}
                      folder={item}
                      onOpen={(f) => navigate(`/folder/${f.id}`)}
                      onRename={() => setRenameModal({ open: true, item })}
                      onMove={() => setMoveModal({ open: true, item })}
                      onDelete={() => setDeleteModal({ open: true, item })}
                      onShare={() => setShareModal({ open: true, item })}
                      onStar={() => item.is_starred ? unstarMutation.mutate(item) : starMutation.mutate(item)}
                    />
                  ) : (
                    <FileCard
                      key={`file-${item.id}`}
                      file={item}
                      onDownload={() => handleDownload(item)}
                      onRename={() => setRenameModal({ open: true, item })}
                      onMove={() => setMoveModal({ open: true, item })}
                      onDelete={() => setDeleteModal({ open: true, item })}
                      onShare={() => setShareModal({ open: true, item })}
                      onStar={() => item.is_starred ? unstarMutation.mutate(item) : starMutation.mutate(item)}
                      onClick={handleFileClick}
                    />
                  )
                ))}
              </div>
            ) : (
              <FileList
                items={items}
                onDownload={handleDownload}
                onRename={(item) => setRenameModal({ open: true, item })}
                onMove={(item) => setMoveModal({ open: true, item })}
                onDelete={(item) => setDeleteModal({ open: true, item })}
                onShare={(item) => setShareModal({ open: true, item })}
                onStar={(item) => item.is_starred ? unstarMutation.mutate(item) : starMutation.mutate(item)}
                onClick={(item) => item.type === 'file' ? handleFileClick(item) : navigate(`/folder/${item.id}`)}
              />
            )
          ) : (
            <EmptyState 
              type="files" 
              onUpload={() => setUploadModalOpen(true)}
              onCreateFolder={() => setNewFolderModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        folderId={folderId}
        onUploadComplete={() => {
          queryClient.invalidateQueries(['files', folderId]);
        }}
      />

      <NewFolderModal
        isOpen={newFolderModalOpen}
        onClose={() => setNewFolderModalOpen(false)}
        parentFolderId={folderId}
        onCreateFolder={(data) => createFolderMutation.mutate(data)}
      />

      <RenameModal
        isOpen={renameModal.open}
        onClose={() => setRenameModal({ open: false, item: null })}
        item={renameModal.item}
        onRename={(item, name) => renameMutation.mutate({ item, name })}
      />

      <DeleteModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, item: null })}
        item={deleteModal.item}
        onDelete={(item) => deleteMutation.mutate(item)}
      />

      <ShareModal
        isOpen={shareModal.open}
        onClose={() => setShareModal({ open: false, item: null })}
        item={shareModal.item}
      />

      <MoveModal
        isOpen={moveModal.open}
        onClose={() => setMoveModal({ open: false, item: null })}
        item={moveModal.item}
        onMove={(item, targetFolderId) => moveMutation.mutate({ item, targetFolderId })}
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

export default Dashboard;