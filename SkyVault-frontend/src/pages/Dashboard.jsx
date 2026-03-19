import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fileAPI, folderAPI, starAPI } from '../lib/api';
import { useFileStore } from '../store/fileStore';
import { generateBreadcrumbs } from '../lib/utils';
import toast from 'react-hot-toast';

import Sidebar      from '../components/layout/Sidebar';
import Header       from '../components/layout/Header';
import Breadcrumb   from '../components/layout/Breadcrumb';
import FileCard     from '../components/files/FileCard';
import FolderCard   from '../components/files/FolderCard';
import FileList     from '../components/files/FileList';
import EmptyState   from '../components/common/EmptyState';
import Skeletons    from '../components/common/Skeletons';
import UploadModal     from '../components/modals/UploadModal';
import NewFolderModal  from '../components/modals/NewFolderModal';
import RenameModal     from '../components/modals/RenameModal';
import DeleteModal     from '../components/modals/DeleteModal';
import ShareModal      from '../components/modals/ShareModal';
import MoveModal       from '../components/modals/MoveModal';
import FilePreviewModal from '../components/modals/FilePreviewModal';

const Dashboard = () => {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { viewMode, setFiles, setFolders, setCurrentFolderId, setBreadcrumbs, getSortedAndFilteredItems } = useFileStore();

  const [uploadOpen,    setUploadOpen]    = useState(false);
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [renameModal,   setRenameModal]   = useState({ open: false, item: null });
  const [deleteModal,   setDeleteModal]   = useState({ open: false, item: null });
  const [shareModal,    setShareModal]    = useState({ open: false, item: null });
  const [moveModal,     setMoveModal]     = useState({ open: false, item: null });
  const [previewModal,  setPreviewModal]  = useState({ open: false, file: null });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['folders', folderId] });
    qc.invalidateQueries({ queryKey: ['files',   folderId] });
  };

  const { data: folderData, isLoading: fLoading } = useQuery({
    queryKey: ['folders', folderId],
    queryFn:  () => folderAPI.getFolders(folderId).then((r) => r.data),
  });

  const { data: fileData, isLoading: fiLoading } = useQuery({
    queryKey: ['files', folderId],
    queryFn:  () => fileAPI.getFiles(folderId).then((r) => r.data),
  });

  useEffect(() => {
    if (Array.isArray(folderData)) setFolders(folderData);
    if (Array.isArray(fileData))   setFiles(fileData);
    setCurrentFolderId(folderId || null);
    setBreadcrumbs(generateBreadcrumbs(folderData, folderId));
  }, [folderData, fileData, folderId]);

  // Mutations
  const createFolder = useMutation({
    mutationFn: (d) => folderAPI.create(d),
    onSuccess: () => { invalidate(); toast.success('Folder created'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to create folder'),
  });

  const rename = useMutation({
    mutationFn: ({ item, name }) => item.type === 'folder' ? folderAPI.rename(item.id, name) : fileAPI.rename(item.id, name),
    onSuccess: () => { invalidate(); toast.success('Renamed'); },
  });

  const remove = useMutation({
    mutationFn: (item) => item.type === 'folder' ? folderAPI.delete(item.id) : fileAPI.delete(item.id),
    onSuccess: () => { invalidate(); toast.success('Moved to trash'); },
  });

  const star = useMutation({
    mutationFn: (item) => item.is_starred ? starAPI.unstar(item.type, item.id) : starAPI.star(item.type, item.id),
    onSuccess: (_, item) => {
      invalidate();
      toast.success(item.is_starred ? 'Removed from starred' : 'Added to starred');
    },
  });

  const move = useMutation({
    mutationFn: ({ item, targetFolderId }) =>
      item.type === 'folder' ? folderAPI.move(item.id, targetFolderId) : fileAPI.move(item.id, targetFolderId),
    onSuccess: () => { invalidate(); toast.success('Moved'); },
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

  const items = getSortedAndFilteredItems();
  const isLoading = fLoading || fiLoading;

  const commonProps = {
    onDownload: handleDownload,
    onRename:  (item) => setRenameModal({ open: true, item }),
    onMove:    (item) => setMoveModal({ open: true, item }),
    onDelete:  (item) => setDeleteModal({ open: true, item }),
    onShare:   (item) => setShareModal({ open: true, item }),
    onStar:    (item) => star.mutate(item),
  };

  return (
    <div className="page-layout">
      <Sidebar />

      <div className="page-main">
        <Header onUploadClick={() => setUploadOpen(true)} onNewFolderClick={() => setNewFolderOpen(true)} />
        <Breadcrumb />

        <main className="page-content">
          {isLoading ? (
            <Skeletons count={12} viewMode={viewMode} />
          ) : items.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid-files">
                {items.map((item) =>
                  item.type === 'folder' ? (
                    <FolderCard key={`f-${item.id}`} folder={item} onOpen={(f) => navigate(`/folder/${f.id}`)} {...commonProps} />
                  ) : (
                    <FileCard key={`fi-${item.id}`} file={item} onClick={(f) => setPreviewModal({ open: true, file: f })} {...commonProps} />
                  )
                )}
              </div>
            ) : (
              <FileList
                items={items}
                {...commonProps}
                onClick={(item) => item.type === 'folder' ? navigate(`/folder/${item.id}`) : setPreviewModal({ open: true, file: item })}
              />
            )
          ) : (
            <EmptyState type="files" onUpload={() => setUploadOpen(true)} onCreateFolder={() => setNewFolderOpen(true)} />
          )}
        </main>
      </div>

      {/* Modals */}
      <UploadModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} folderId={folderId} onUploadComplete={invalidate} />
      <NewFolderModal isOpen={newFolderOpen} onClose={() => setNewFolderOpen(false)} parentFolderId={folderId} onCreateFolder={(d) => createFolder.mutate(d)} />
      <RenameModal isOpen={renameModal.open} onClose={() => setRenameModal({ open: false, item: null })} item={renameModal.item} onRename={(item, name) => rename.mutate({ item, name })} />
      <DeleteModal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, item: null })} item={deleteModal.item} onDelete={(item) => remove.mutate(item)} />
      <ShareModal  isOpen={shareModal.open}  onClose={() => setShareModal({ open: false, item: null })}  item={shareModal.item} />
      <MoveModal   isOpen={moveModal.open}   onClose={() => setMoveModal({ open: false, item: null })}   item={moveModal.item} onMove={(item, tgt) => move.mutate({ item, targetFolderId: tgt })} />
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