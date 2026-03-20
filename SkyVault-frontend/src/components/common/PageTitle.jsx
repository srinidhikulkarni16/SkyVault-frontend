import React from 'react';

const PageTitle = ({ title, sub, action, className = '' }) => (
  <div className={`
    flex items-center justify-between 
    px-6 py-6 sm:px-10 
    bg-white/40 backdrop-blur-md 
    border-b border-stone-200/60 
    shrink-0 z-10
    animate-in fade-in slide-in-from-top-4 duration-500
    ${className}
  `}>
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight leading-none">
        {title}
      </h1>
      {sub && (
        <p className="text-sm font-medium text-stone-500 tracking-wide">
          {sub}
        </p>
      )}
    </div>

    {action && (
      <div className="flex items-center gap-3 animate-in fade-in zoom-in-95 delay-200">
        {action}
      </div>
    )}
  </div>
);

export default PageTitle;