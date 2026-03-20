import React from 'react';

// Layout & UI Components
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import PageTitle from '../components/common/PageTitle';
import EmptyState from '../components/common/EmptyState';

const Shared = () => {
  return (
    <div className="flex h-screen bg-stone-50 text-stone-900 font-sans selection:bg-lime-800 selection:text-white overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header - Actions disabled for Shared view as per original structure */}
        <Header onUploadClick={null} onNewFolderClick={null} />

        {/* Page Heading Section */}
        <div className="px-6 sm:px-10 pt-8 pb-4">
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
            <PageTitle 
              title="Shared with me" 
              sub="Files and folders others have shared with you" 
              className="text-stone-900"
            />
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-6 sm:px-10 pb-10 custom-scrollbar">
          <div className="h-full flex flex-col items-center justify-center bg-white/40 backdrop-blur-[2px] rounded-[2.5rem] border border-stone-200/50 shadow-inner my-2 animate-in fade-in zoom-in-95 duration-700">
          
            <EmptyState type="shared" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Shared;