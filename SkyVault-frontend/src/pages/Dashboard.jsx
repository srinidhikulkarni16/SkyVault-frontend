import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fileAPI, folderAPI, starAPI } from '../lib/api';
import { useFileStore } from '../store/fileStore';
import { generateBreadcrumbs } from '../lib/utils';
import toast from 'react-hot-toast';

// Layout & UI Components
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import Breadcrumb from '../components/layout/Breadcrumb';
import FileCard from '../components/files/FileCard';
import FolderCard from '../components/files/FolderCard';
import FileList from '../components/files/FileList';
import EmptyState from '../components/common/EmptyState';
import Skeletons from '../components/common/Skeletons';

// Modals
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

  const {
    viewMode,
    setFiles,
    setFolders,
    setCurrentFolderId,
    setBreadcrumbs,
    getSortedAndFilteredItems
  } = useFileStore();

  const [uploadOpen, setUploadOpen] = useState(false);
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [renameModal, setRenameModal] = useState({ open: false, item: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null });
  const [shareModal, setShareModal] = useState({ open: false, item: null });
  const [moveModal, setMoveModal] = useState({ open: false, item: null });
  const [previewModal, setPreviewModal] = useState({ open: false, file: null });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['folders', currentPathId] });
    qc.invalidateQueries({ queryKey: ['files', currentPathId] });
  };

  const { data: folderData, isLoading: fLoading } = useQuery({
    queryKey: ['folders', currentPathId],
    queryFn: () => folderAPI.getFolders(currentPathId).then(r => r.data),
  });

  const { data: fileData, isLoading: fiLoading } = useQuery({
    queryKey: ['files', currentPathId],
    queryFn: () => fileAPI.getFiles(currentPathId).then(r => r.data),
  });

  useEffect(() => {
    if (Array.isArray(folderData)) setFolders(folderData);
    if (Array.isArray(fileData)) setFiles(fileData);
    setCurrentFolderId(currentPathId);
    setBreadcrumbs(generateBreadcrumbs(folderData, currentPathId));
  }, [folderData, fileData, currentPathId]);

  const handleDownload = async (file) => {
    if (!file?.id) return toast.error("File data missing");
    try {
      const { data } = await fileAPI.downloadFile(file.id);
      if (data?.url) window.open(data.url, '_blank');
      else {
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file.name);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (err) { toast.error("Download failed"); }
  };

  const commonProps = {
    onDownload: (item) => handleDownload(item),
    onRename: async (item, newName) => {
      item.type === 'folder' ? await folderAPI.rename(item.id, newName) : await fileAPI.rename(item.id, newName);
      invalidate();
    },
    onMove: async (item, targetId) => {
      item.type === 'folder' ? await folderAPI.move(item.id, targetId) : await fileAPI.move(item.id, targetId);
      invalidate();
    },
    onDelete: async (item) => {
      item.type === 'folder' ? await folderAPI.delete(item.id) : await fileAPI.delete(item.id);
      invalidate();
    },
    onShare: (item) => setShareModal({ open: true, item }),
    onStar: async (item) => {
      item.is_starred ? await starAPI.unstar(item.type, item.id) : await starAPI.star(item.type, item.id);
      invalidate();
    },
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
            <div className={viewMode === 'grid' ? "grid gap-6 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]" : ""}>
              {items.map((item) => (
                <div key={item.id}>
                  {item.type === 'folder' ? (
                    <FolderCard folder={item} onOpen={(f) => navigate(`/folder/${f.id}`)} {...commonProps} />
                  ) : (
                    <FileCard file={item} onClick={(f) => setPreviewModal({ open: true, file: f })} {...commonProps} />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState type="files" onUpload={() => setUploadOpen(true)} onCreateFolder={() => setNewFolderOpen(true)} />
          )}
        </main>
      </div>

      {/* MODALS LAYER - SPREAD commonProps into EVERY modal */}
      <UploadModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} folderId={currentPathId} onUploadComplete={invalidate} />
      <NewFolderModal isOpen={newFolderOpen} onClose={() => setNewFolderOpen(false)} parentFolderId={currentPathId} onCreateFolder={(data) => folderAPI.create(data).then(invalidate)} />
      <RenameModal isOpen={renameModal.open} item={renameModal.item} onClose={() => setRenameModal({ open: false, item: null })} {...commonProps} />
      <DeleteModal isOpen={deleteModal.open} item={deleteModal.item} onClose={() => setDeleteModal({ open: false, item: null })} {...commonProps} />
      <ShareModal isOpen={shareModal.open} item={shareModal.item} onClose={() => setShareModal({ open: false, item: null })} />
      <MoveModal isOpen={moveModal.open} item={moveModal.item} onClose={() => setMoveModal({ open: false, item: null })} {...commonProps} />
      <FilePreviewModal isOpen={previewModal.open} file={previewModal.file} onClose={() => setPreviewModal({ open: false, file: null })} {...commonProps} />
    </div>
  );
};

export default Dashboard;