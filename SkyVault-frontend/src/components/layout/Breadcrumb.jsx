import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useFileStore } from '../../store/fileStore';

const Breadcrumb = () => {
  const { breadcrumbs } = useFileStore();
  if (!breadcrumbs?.length) return null;

  return (
    <nav className="breadcrumb">
      {breadcrumbs.map((crumb, i) => {
        const isLast = i === breadcrumbs.length - 1;
        const path   = crumb.id ? `/folder/${crumb.id}` : '/';

        return (
          <React.Fragment key={crumb.id || 'root'}>
            {i > 0 && <ChevronRight size={13} style={{ color: 'var(--text-3)', flexShrink: 0 }} />}
            {isLast ? (
              <span className="current" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {!crumb.id && <Home size={13} />}
                {crumb.name}
              </span>
            ) : (
              <Link to={path} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {!crumb.id && <Home size={13} />}
                {crumb.name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;