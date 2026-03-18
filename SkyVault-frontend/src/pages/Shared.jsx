import React, { useState } from 'react';
import { useFileStore } from '../store/fileStore';
import toast from 'react-hot-toast';

import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import EmptyState from '../components/common/EmptyState';

const Shared = () => {
  const { viewMode } = useFileStore();

  // TODO: Implement shared files API
  // For now, showing empty state
  const items = [];
  const isLoading = false;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col ml-64">
        <Header onUploadClick={() => {}} onNewFolderClick={() => {}} />

        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Shared with me</h1>
          <p className="text-sm text-gray-500 mt-1">Files and folders others have shared with you</p>
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
               {/* Implement shared list here */}
            </div>
          ) : (
            <EmptyState type="shared" />
          )}
        </main>
      </div>
    </div>
  );
};

export default Shared;