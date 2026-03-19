import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Star, Clock, Trash2, Cloud, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';

const NAV = [
  { label: 'My Drive',       path: '/',        icon: Home  },
  { label: 'Shared with me', path: '/shared',  icon: Users },
  { label: 'Starred',        path: '/starred', icon: Star  },
  { label: 'Recent',         path: '/recent',  icon: Clock },
  { label: 'Trash',          path: '/trash',   icon: Trash2 },
];

const STORAGE_USED  = 2.5;
const STORAGE_TOTAL = 15;
const STORAGE_PCT   = (STORAGE_USED / STORAGE_TOTAL) * 100;

const Sidebar = () => {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) =>
    path === '/' ? pathname === '/' || pathname.startsWith('/folder/') : pathname === path;

  const initials = (user?.name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{ padding: '0 16px', height: 60, display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--border)' }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Cloud size={18} color="#fff" />
        </div>
        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-1)' }}>SkyVault</span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(({ label, path, icon: Icon }) => (
          <Link key={path} to={path} className={cn('sidebar-link', isActive(path) && 'active')}>
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Storage */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
        <div style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Storage</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-2)', fontWeight: 600 }}>{STORAGE_USED} / {STORAGE_TOTAL} GB</span>
          </div>
          <div className="storage-bar">
            <div className="storage-fill" style={{ width: `${STORAGE_PCT}%` }} />
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-3)', marginTop: 6 }}>
            {(STORAGE_TOTAL - STORAGE_USED).toFixed(1)} GB available
          </p>
        </div>
      </div>

      {/* User */}
      <div style={{ padding: '10px 8px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px', borderRadius: 'var(--radius-md)' }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(79,110,247,0.2)', border: '1px solid rgba(79,110,247,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-light)', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'User'}</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
          </div>
          <button onClick={logout} className="btn btn-icon btn-ghost" title="Sign out">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;