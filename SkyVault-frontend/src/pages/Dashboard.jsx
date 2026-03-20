import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fileAPI, folderAPI, starAPI } from '../lib/api';
import { useFileStore } from '../store/fileStore';
import { generateBreadcrumbs } from '../lib/utils';
import toast from 'react-hot-toast';

import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import Breadcrumb from '../components/layout/Breadcrumb';
import FileCard from '../components/files/FileCard';
import FolderCard from '../components/files/FolderCard';
import FileList from '../components/files/FileList';
import EmptyState from '../components/common/EmptyState';
import Skeletons from '../components/common/Skeletons';

import UploadModal from '../components/modals/UploadModal';
import NewFolderModal from '../components/modals/NewFolderModal';
import RenameModal from '../components/modals/RenameModal';
import DeleteModal from '../components/modals/DeleteModal';
import ShareModal from '../components/modals/ShareModal';
import MoveModal from '../components/modals/MoveModal';
import FilePreviewModal from '../components/modals/FilePreviewModal';

const Dashboard = () => {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const currentPathId = (!folderId || folderId === 'root') ? null : folderId;

  const { viewMode, setFiles, setFolders, setCurrentFolderId, setBreadcrumbs, getSortedAndFilteredItems } = useFileStore();

  const [uploadOpen,    setUploadOpen]    = useState(false);
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [renameModal,   setRenameModal]   = useState({ open: false, item: null });
  const [deleteModal,   setDeleteModal]   = useState({ open: false, item: null });
  const [shareModal,    setShareModal]    = useState({ open: false, item: null });
  const [moveModal,     setMoveModal]     = useState({ open: false, item: null });
  const [previewModal,  setPreviewModal]  = useState({ open: false, file: null });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['folders',  currentPathId] });
    qc.invalidateQueries({ queryKey: ['files',    currentPathId] });
    qc.invalidateQueries({ queryKey: ['starred'] });
  };

  const { data: folderData, isLoading: fLoading } = useQuery({
    queryKey: ['folders', currentPathId],
    queryFn:  () => folderAPI.getFolders(currentPathId).then(r => r.data),
  });

  const { data: fileData, isLoading: fiLoading } = useQuery({
    queryKey: ['files', currentPathId],
    queryFn:  () => fileAPI.getFiles(currentPathId).then(r => r.data),
  });

  // ── Fetch starred separately and merge is_starred onto cards ─────────────
  // The /files and /folders endpoints don't return is_starred — only /stars does.
  const { data: starredData } = useQuery({
    queryKey: ['starred'],
    queryFn:  () => starAPI.getStarred().then(r => r.data),
  });

  // "file:uuid" or "folder:uuid" — O(1) lookup
  const starredSet = new Set(
    Array.isArray(starredData) ? starredData.map(s => `${s.type}:${s.id}`) : []
  );

  useEffect(() => {
    if (Array.isArray(folderData)) {
      setFolders(folderData.map(f => ({
        ...f,
        type:       'folder',
        is_starred: starredSet.has(`folder:${f.id}`),
      })));
    }
    if (Array.isArray(fileData)) {
      setFiles(fileData.map(f => ({
        ...f,
        type:       'file',
        is_starred: starredSet.has(`file:${f.id}`),
      })));
    }
    setCurrentFolderId(currentPathId);
    setBreadcrumbs(generateBreadcrumbs(folderData, currentPathId));
  }, [folderData, fileData, starredData, currentPathId]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleDownload = async (file) => {
    if (!file?.id) return toast.error('File data missing');
    try {
      const { data } = await fileAPI.downloadFile(file.id);
      if (data?.url) window.open(data.url, '_blank');
    } catch { toast.error('Download failed'); }
  };

  const handleRename = (item) => setRenameModal({ open: true, item });
  const handleMove   = (item) => setMoveModal  ({ open: true, item });
  const handleDelete = (item) => setDeleteModal({ open: true, item });
  const handleShare  = (item) => setShareModal ({ open: true, item });

  const handleStar = async (item) => {
    if (!item?.id) return;
    const type      = item.type || (item.mime_type ? 'file' : 'folder');
    const isStarred = starredSet.has(`${type}:${item.id}`);
    try {
      if (isStarred) {
        await starAPI.unstar(type, item.id);
        toast.success('Removed from starred');
      } else {
        await starAPI.star(type, item.id);
        toast.success('Added to starred');
      }
      invalidate();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update starred');
    }
  };

  // ── Modal API callers ─────────────────────────────────────────────────────
  const doRename = async (item, newName) => {
    item.type === 'folder'
      ? await folderAPI.renameFolder(item.id, { name: newName })
      : await fileAPI.renameFile(item.id, { name: newName });
    invalidate();
  };

  const doMove = async (item, targetId) => {
    item.type === 'folder'
      ? await folderAPI.moveFolder(item.id, { parent_id: targetId ?? null })
      : await fileAPI.moveFile(item.id, { folder_id: targetId ?? null });
    invalidate();
  };

  const doDelete = async (item) => {
    item.type === 'folder'
      ? await folderAPI.deleteFolder(item.id)
      : await fileAPI.deleteFile(item.id);
    invalidate();
  };

  const commonProps = {
    onDownload: handleDownload,
    onRename:   handleRename,
    onMove:     handleMove,
    onDelete:   handleDelete,
    onShare:    handleShare,
    onStar:     handleStar,
  };

  const items = getSortedAndFilteredItems();

  return (
    <div className="flex h-screen bg-stone-50 text-stone-900 font-sans selection:bg-lime-800 selection:text-white overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Header onUploadClick={() => setUploadOpen(true)} onNewFolderClick={() => setNewFolderOpen(true)} />
        <div className="px-6 sm:px-10 pt-6">
          <div className="bg-white/50 backdrop-blur-sm p-3 rounded-xl border border-stone-200/60 shadow-sm inline-block">
            <Breadcrumb />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto px-6 sm:px-10 py-6 scroll-smooth">
          {fLoading || fiLoading ? (
            <Skeletons count={12} viewMode={viewMode} />
          ) : items.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
                {items.map((item) =>
                  item.type === 'folder' ? (
                    <FolderCard key={item.id} folder={item} onOpen={(f) => navigate(`/folder/${f.id}`)} {...commonProps} />
                  ) : (
                    <FileCard key={item.id} file={item} onClick={(f) => setPreviewModal({ open: true, file: f })} {...commonProps} />
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

      <UploadModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} folderId={currentPathId} onUploadComplete={invalidate} />
      <NewFolderModal isOpen={newFolderOpen} onClose={() => setNewFolderOpen(false)} parentFolderId={currentPathId} onCreateFolder={(data) => folderAPI.createFolder(data).then(invalidate)} />
      <RenameModal isOpen={renameModal.open} item={renameModal.item} onClose={() => setRenameModal({ open: false, item: null })} onRename={doRename} />
      <DeleteModal isOpen={deleteModal.open} item={deleteModal.item} onClose={() => setDeleteModal({ open: false, item: null })} onDelete={doDelete} />
      <ShareModal isOpen={shareModal.open} item={shareModal.item} onClose={() => setShareModal({ open: false, item: null })} />
      <MoveModal isOpen={moveModal.open} item={moveModal.item} onClose={() => setMoveModal({ open: false, item: null })} onMove={doMove} />
      <FilePreviewModal isOpen={previewModal.open} file={previewModal.file} onClose={() => setPreviewModal({ open: false, file: null })} onDownload={handleDownload} onShare={handleShare} />
    </div>
  );
};

export default Dashboard;