import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useFileStore } from '../../store/fileStore';
import { cn } from '../../lib/utils';

const Breadcrumb = () => {
  const { breadcrumbs } = useFileStore();
  
  // Return a minimal spacer if no breadcrumbs to maintain layout height consistency
  if (!breadcrumbs?.length) return <div className="h-12 shrink-0" />;

  return (
    <nav className="flex items-center gap-1 px-6 h-12 bg-white/40 backdrop-blur-md border-b border-stone-100 text-sm shrink-0 sticky top-0 z-20 animate-in fade-in duration-500">
      {breadcrumbs.map((crumb, i) => {
        const isLast = i === breadcrumbs.length - 1;
        const isFirst = i === 0;
        const path = crumb.id ? `/folder/${crumb.id}` : '/';

        return (
          <React.Fragment key={crumb.id || 'root'}>
            {/* Earthy separator icon */}
            {!isFirst && (
              <ChevronRight 
                size={14} 
                className="text-stone-300 shrink-0 mx-1" 
                strokeWidth={2.5} 
              />
            )}

            {isLast ? (
              <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-stone-100/50 text-stone-900 font-bold transition-all">
                {!crumb.id && <Home size={14} className="shrink-0 text-lime-800" strokeWidth={2} />}
                <span className="truncate max-w-[150px] sm:max-w-none">
                  {crumb.name}
                </span>
              </div>
            ) : (
              <Link 
                to={path}
                className={cn(
                  "flex items-center gap-2 px-2 py-1 rounded-lg text-stone-500 font-semibold",
                  "hover:text-lime-800 hover:bg-lime-50 transition-all duration-200 active:scale-95"
                )}
              >
                {!crumb.id && <Home size={14} className="shrink-0" strokeWidth={2} />}
                <span className="truncate max-w-[100px] sm:max-w-none">
                  {crumb.name}
                </span>
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;