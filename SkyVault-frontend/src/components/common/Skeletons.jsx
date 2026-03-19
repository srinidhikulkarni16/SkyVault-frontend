import React from 'react';

export const SkeletonCard = () => (
  <div className="file-card" style={{ pointerEvents: 'none' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
      <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 10 }} />
      <div className="skeleton" style={{ width: 24, height: 24, borderRadius: 6 }} />
    </div>
    <div className="skeleton" style={{ height: 14, width: '75%', marginBottom: 8, borderRadius: 4 }} />
    <div className="skeleton" style={{ height: 11, width: '50%', borderRadius: 4 }} />
  </div>
);

export const SkeletonRow = () => (
  <div className="list-row" style={{ pointerEvents: 'none' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div className="skeleton" style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0 }} />
      <div className="skeleton" style={{ height: 13, width: 160, borderRadius: 4 }} />
    </div>
    <div className="skeleton" style={{ height: 12, width: 80, borderRadius: 4 }} />
    <div className="skeleton" style={{ height: 12, width: 80, borderRadius: 4 }} />
    <div className="skeleton" style={{ height: 12, width: 50, borderRadius: 4 }} />
    <div />
  </div>
);

const Skeletons = ({ count = 8, viewMode = 'grid' }) => {
  if (viewMode === 'list') {
    return (
      <div className="card" style={{ overflow: 'hidden' }}>
        {Array.from({ length: count }).map((_, i) => <SkeletonRow key={i} />)}
      </div>
    );
  }
  return (
    <div className="grid-files">
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
};

export default Skeletons;