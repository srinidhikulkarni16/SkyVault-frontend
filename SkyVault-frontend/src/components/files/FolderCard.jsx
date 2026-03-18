import React, { useState } from 'react';
import {
  MoreVertical,
  Trash2,
  Edit,
  Share2,
  Star,
  Folder,
  FolderOpen,
  Move,
} from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { useFileStore } from '../../store/fileStore';

const FolderCard = ({ folder, onOpen, onRename, onMove, onDelete, onShare, onStar }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { selectedItems, toggleItemSelection } = useFileStore();
  
  const isSelected = selectedItems.some((item) => item.id === folder.id && item.type === 'folder');

  const handleMenuClick = (e, action) => {
    e.stopPropagation();
    setShowMenu(false);
    action();
  };

  return (
    <div
      className={`relative group bg-white border-2 rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer ${
        isSelected ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onOpen(folder)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between mb-3">
        <div 
          className="p-2 bg-blue-50 rounded-lg group-hover:bg-white transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            toggleItemSelection({ id: folder.id, type: 'folder' });
          }}
        >
          {isHovered ? (
            <FolderOpen className="w-8 h-8 text-blue-600" />
          ) : (
            <Folder className="w-8 h-8 text-blue-600" />
          )}
        </div>

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-20">
              <button
                onClick={(e) => handleMenuClick(e, () => onOpen(folder))}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
              >
                <FolderOpen className="w-4 h-4" />
                Open
              </button>
              <button
                onClick={(e) => handleMenuClick(e, onRename)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
              >
                <Edit className="w-4 h-4" />
                Rename
              </button>
              <button
                onClick={(e) => handleMenuClick(e, onMove)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
              >
                <Move className="w-4 h-4" />
                Move
              </button>
              <button
                onClick={(e) => handleMenuClick(e, onShare)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button
                onClick={(e) => handleMenuClick(e, onStar)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
              >
                <Star className={`w-4 h-4 ${folder.is_starred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                {folder.is_starred ? 'Unstar' : 'Star'}
              </button>
              <div className="border-t border-gray-200 my-1"></div>
              <button
                onClick={(e) => handleMenuClick(e, onDelete)}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="font-medium text-gray-900 truncate" title={folder.name}>
          {folder.name}
        </h3>
        <p className="text-xs text-gray-500">
          Modified {formatDate(folder.updated_at)}
        </p>
      </div>
    </div>
  );
};

export default FolderCard;