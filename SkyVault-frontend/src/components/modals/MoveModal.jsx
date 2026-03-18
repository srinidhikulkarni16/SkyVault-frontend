import React, { useState, useEffect } from 'react';
import { X, Folder, ChevronRight, ChevronDown, Home } from 'lucide-react';
import { folderAPI } from "../../lib/api";
import toast from 'react-hot-toast';

const FolderTreeItem = ({ folder, level = 0, selectedId, onSelect, expandedFolders, onToggle }) => {
  const hasChildren = folder.hasChildren || false;
  const isExpanded = expandedFolders.includes(folder.id);
  const isSelected = selectedId === folder.id;

  return (
    <div>
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
          isSelected ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-100'
        }`}
        style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
        onClick={() => onSelect(folder.id)}
      >
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(folder.id);
            }}
            className="p-0.5 hover:bg-gray-200 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-5" />}
        <Folder className={`w-5 h-5 ${isSelected ? 'text-primary-600' : 'text-gray-400'}`} />
        <span className="text-sm font-medium truncate">{folder.name}</span>
      </div>
      
      {isExpanded && folder.children && (
        <div className="mt-1">
          {folder.children.map((child) => (
            <FolderTreeItem
              key={child.id}
              folder={child}
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              expandedFolders={expandedFolders}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const MoveModal = ({ isOpen, onClose, item, onMove }) => {
  const [folders, setFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadFolders();
      // If we're moving a file/folder, we can default to the current folder's parent or root
      setSelectedFolderId(null);
    }
  }, [isOpen]);

  const loadFolders = async () => {
    try {
      const { data } = await folderAPI.getFolders();
      // Filter out the folder being moved (and its children) to prevent circular moving
      const filteredFolders = data.filter(f => f.id !== item.id);
      setFolders(filteredFolders);
    } catch (error) {
      toast.error('Failed to load folders');
    }
  };

  const toggleFolder = async (folderId) => {
    if (expandedFolders.includes(folderId)) {
      setExpandedFolders(prev => prev.filter(id => id !== folderId));
    } else {
      setExpandedFolders(prev => [...prev, folderId]);
      // If folder doesn't have children loaded yet, load them
      const folderIndex = folders.findIndex(f => f.id === folderId);
      if (folderIndex !== -1 && !folders[folderIndex].children) {
        try {
          const { data } = await folderAPI.getFolders(folderId);
          const newFolders = [...folders];
          newFolders[folderIndex].children = data.filter(f => f.id !== item.id);
          setFolders(newFolders);
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  const handleMove = async () => {
    setLoading(true);
    try {
      await onMove(item, selectedFolderId);
      toast.success(`${item.type === 'folder' ? 'Folder' : 'File'} moved successfully`);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to move');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !item) return null;

  const rootFolders = folders.filter(f => !f.parent_id);

  return (
    <div className="modal-overlay">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-slide-in flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Move "{item.name}"</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Folder Tree */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer mb-2 transition-colors ${
              selectedFolderId === null ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-100'
            }`}
            onClick={() => setSelectedFolderId(null)}
          >
            <Home className={`w-5 h-5 ${selectedFolderId === null ? 'text-primary-600' : 'text-gray-400'}`} />
            <span className="text-sm font-medium">My Drive</span>
          </div>

          {/* Folders */}
          {rootFolders.map((folder) => (
            <FolderTreeItem
              key={folder.id}
              folder={folder}
              level={0}
              selectedId={selectedFolderId}
              onSelect={setSelectedFolderId}
              expandedFolders={expandedFolders}
              onToggle={toggleFolder}
            />
          ))}

          {folders.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-8">
              No folders available
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            {selectedFolderId === null ? 'Moving to My Drive' : 'Moving to selected folder'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleMove}
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Moving...' : 'Move Here'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoveModal;