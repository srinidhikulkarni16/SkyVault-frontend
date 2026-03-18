import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useFileStore } from '../../store/fileStore';

const Breadcrumb = () => {
  const { breadcrumbs } = useFileStore();

  if (!breadcrumbs || breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center gap-2 px-6 py-3 bg-gray-50 border-b border-gray-200">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const path = crumb.id ? `/folder/${crumb.id}` : '/';

        return (
          <React.Fragment key={crumb.id || 'root'}>
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            )}
            {isLast ? (
              <span className="text-sm font-medium text-gray-900 truncate">
                {crumb.id ? (
                  crumb.name
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Home className="w-4 h-4" />
                    {crumb.name}
                  </span>
                )}
              </span>
            ) : (
              <Link
                to={path}
                className="text-sm text-gray-600 hover:text-primary-600 transition-colors truncate"
              >
                {crumb.id ? (
                  crumb.name
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Home className="w-4 h-4" />
                    {crumb.name}
                  </span>
                )}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;