import React, { useState } from 'react';
import {
  Search,
  Upload,
  Grid3x3,
  List,
  SlidersHorizontal,
  FolderPlus,
} from 'lucide-react';
import { useFileStore } from '../../store/fileStore';
import { cn } from '../../lib/utils';

const Header = ({ onUploadClick, onNewFolderClick }) => {
  const { viewMode, setViewMode, searchQuery, setSearchQuery, sortBy, setSortBy } = useFileStore();
  const [showSortMenu, setShowSortMenu] = useState(false);

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'date', label: 'Date modified' },
    { value: 'size', label: 'Size' },
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files and folders..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 rounded-lg outline-none transition-all"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 rounded transition-colors',
                viewMode === 'grid'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
              title="Grid view"
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded transition-colors',
                viewMode === 'list'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* New Folder Button */}
          <button
            onClick={onNewFolderClick}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FolderPlus className="w-5 h-5" />
            <span className="hidden md:inline">New Folder</span>
          </button>

          {/* Upload Button */}
          <button
            onClick={onUploadClick}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
          >
            <Upload className="w-5 h-5" />
            <span className="hidden md:inline">Upload</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;