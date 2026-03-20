import React from 'react';

/** ─── Grid View Skeleton ─── */
export const SkeletonCard = () => (
  <div className="bg-white border border-stone-200 rounded-[2rem] p-5 pointer-events-none shadow-sm shadow-stone-200/50">
    <div className="flex justify-between items-start mb-6">
      {/* Icon placeholder */}
      <div className="w-14 h-14 rounded-2xl bg-stone-100 animate-pulse" />
      {/* Menu/Action placeholder */}
      <div className="w-6 h-6 rounded-full bg-stone-100 animate-pulse" />
    </div>
    {/* Title placeholder */}
    <div className="h-4 w-3/4 rounded-full bg-stone-100 animate-pulse mb-3" />
    {/* Subtitle placeholder */}
    <div className="h-3 w-1/2 rounded-full bg-stone-50 animate-pulse" />
  </div>
);

/** ─── List View Skeleton ─── */
export const SkeletonRow = () => (
  <div className="grid grid-cols-[1fr_120px_120px_80px_40px] items-center gap-6 px-6 py-4 border-b border-stone-100 pointer-events-none last:border-0">
    <div className="flex items-center gap-4">
      {/* Icon placeholder */}
      <div className="w-10 h-10 rounded-xl bg-stone-100 animate-pulse shrink-0" />
      {/* Name placeholder */}
      <div className="h-3.5 w-48 rounded-full bg-stone-100 animate-pulse" />
    </div>
    {/* Metadata placeholders */}
    <div className="h-3 w-20 rounded-full bg-stone-50 animate-pulse hidden sm:block" />
    <div className="h-3 w-24 rounded-full bg-stone-50 animate-pulse hidden md:block" />
    <div className="h-3 w-12 rounded-full bg-stone-50 animate-pulse hidden lg:block" />
    <div />
  </div>
);

const Skeletons = ({ count = 8, viewMode = 'grid' }) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-white border border-stone-200 rounded-[2rem] overflow-hidden shadow-sm animate-in fade-in duration-500">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export default Skeletons;