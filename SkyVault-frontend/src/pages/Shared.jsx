import React from 'react';
import Sidebar    from '../components/layout/Sidebar';
import Header     from '../components/layout/Header';
import EmptyState from '../components/common/EmptyState';
import PageTitle  from '../components/common/PageTitle';

const Shared = () => (
  <div className="page-layout">
    <Sidebar />
    <div className="page-main">
      <Header onUploadClick={null} onNewFolderClick={null} />
      <PageTitle title="Shared with me" sub="Files and folders others have shared with you" />
      <main className="page-content">
        <EmptyState type="shared" />
      </main>
    </div>
  </div>
);

export default Shared;