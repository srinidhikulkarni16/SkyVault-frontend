import React, { useState } from 'react';
import {
  MoreVertical,
  Download,
  Trash2,
  Edit,
  Share2,
  Star,
  Move,
  FileText,
  Image as ImageIcon,
  File,
  Folder,
} from 'lucide-react';
import { formatFileSize, formatDate, getFileIcon } from '../../lib/utils';
import { useFileStore } from '../../store/fileStore';

const iconMap = {
  File: File,
  FileText: FileText,
  Image: ImageIcon,
  Video: File,
  Music: File,
  Archive: File,
  Code: FileText,
  Sheet: File,
  Presentation: File,
};

const FileListItem = ({ item, onDownload, onRename, onMove, onDelete, onShare, onStar, onClick }) => {
  const [showMenu, setShowMenu] = useState(false);
  const { selectedItems, toggleItemSelection } = useFileStore();
  
  const isFolder = item.type === 'folder';
  const isSelected = selectedItems.some((i) => i.id === item.id && i.type === item.type);
  const IconComponent = isFolder ? Folder : (iconMap[getFileIcon(item.mime_type, item.name)] || File);

  const handleMenuClick = (e, action) => {
    e.stopPropagation();
    setShowMenu(false);
    action();
  };

  return (
    <div
      className={`group flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 last:border-0 ${
        isSelected ? 'bg-primary-50' : ''
      }`}
      onClick={() => onClick()}
    >
      <div 
        className="w-4 flex items-center justify-center"
        onClick={(e) => {
          e.stopPropagation();
          toggleItemSelection({ id: item.id, type: item.type });
        }}
      >
        <div className={`w-4 h-4 rounded border ${
          isSelected ? 'bg-primary-600 border-primary-600' : 'border-gray-300'
        } flex items-center justify-center`}>
          {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
        </div>
      </div>

      <div className="flex-1 flex items-center gap-3 min-w-0">
        <IconComponent className={`w-5 h-5 flex-shrink-0 ${isFolder ? 'text-blue-500' : 'text-gray-500'}`} />
        <span className="text-sm font-medium text-gray-900 truncate">{item.name}</span>
      </div>

      <div className="hidden md:block w-32 text-sm text-gray-500 truncate">
        {item.owner?.name || 'Me'}
      </div>

      <div className="hidden lg:block w-32 text-sm text-gray-500">
        {formatDate(item.updated_at)}
      </div>

      <div className="hidden sm:block w-24 text-right text-sm text-gray-500">
        {isFolder ? '--' : formatFileSize(item.size_bytes)}
      </div>

      <div className="w-8 relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors opacity-0 group-hover:opacity-100"
        >
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>

        {showMenu && (
          <>
            <div className="fixed inset-0 z-20" onClick={() => setShowMenu(false)}></div>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-30">
              {!isFolder && (
                <button
                  onClick={(e) => handleMenuClick(e, onDownload)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              )}
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
                <Star className={`w-4 h-4 ${item.is_starred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                {item.is_starred ? 'Unstar' : 'Star'}
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
          </>
        )}
      </div>
    </div>
  );
};

const FileList = ({ items, onDownload, onRename, onMove, onDelete, onShare, onStar, onClick }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
        <div className="w-4"></div>
        <div className="flex-1">Name</div>
        <div className="hidden md:block w-32">Owner</div>
        <div className="hidden lg:block w-32">Modified</div>
        <div className="hidden sm:block w-24 text-right">Size</div>
        <div className="w-8"></div>
      </div>

      {/* Items */}
      <div className="divide-y divide-gray-200">
        {items.map((item) => (
          <FileListItem
            key={`${item.type}-${item.id}`}
            item={item}
            onDownload={() => onDownload(item)}
            onRename={() => onRename(item)}
            onMove={() => onMove(item)}
            onDelete={() => onDelete(item)}
            onShare={() => onShare(item)}
            onStar={() => onStar(item)}
            onClick={() => onClick(item)}
          />
        ))}
      </div>
    </div>
  );
};

export default FileList;