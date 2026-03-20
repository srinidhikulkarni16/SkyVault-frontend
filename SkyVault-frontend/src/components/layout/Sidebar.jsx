import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Star, Clock, Trash2, Cloud, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';

const NAV = [
  { label: 'My Drive',         path: '/',         icon: Home   },
  { label: 'Shared with me',   path: '/shared',   icon: Users  },
  { label: 'Starred',          path: '/starred',  icon: Star   },
  { label: 'Recent',           path: '/recent',   icon: Clock  },
  { label: 'Trash',            path: '/trash',    icon: Trash2 },
];

const STORAGE_USED  = 2.5;
const STORAGE_TOTAL = 15;
const STORAGE_PCT   = (STORAGE_USED / STORAGE_TOTAL) * 100;

const Sidebar = () => {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) =>
    path === '/' ? pathname === '/' || pathname.startsWith('/folder/') : pathname === path;

  const initials = (user?.name || 'U').split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <aside className="flex flex-col w-64 shrink-0 bg-stone-50 border-r border-stone-200 h-screen sticky top-0 z-40">
      {/* Branding */}
      <div className="h-20 flex items-center gap-3 px-8 shrink-0">
        <div className="w-10 h-10 rounded-2xl bg-lime-800 flex items-center justify-center shadow-lg shadow-lime-900/20 transform transition-transform hover:rotate-3">
          <Cloud size={20} className="text-white" strokeWidth={2.5} />
        </div>
        <span className="font-black text-stone-900 text-xl tracking-tighter">SkyVault</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5 overflow-y-auto">
        {NAV.map(({ label, path, icon: Icon }) => (
          <Link
            key={path} 
            to={path}
            className={cn(
              'flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 no-underline group active:scale-95',
              isActive(path)
                ? 'bg-lime-800 text-white shadow-md shadow-lime-900/10'
                : 'text-stone-500 hover:text-lime-800 hover:bg-lime-100/50'
            )}
          >
            <Icon 
              size={18} 
              className={cn("shrink-0 transition-transform duration-300 group-hover:scale-110", isActive(path) ? "text-white" : "text-stone-400 group-hover:text-lime-700")} 
              strokeWidth={isActive(path) ? 2.5 : 2}
            />
            {label}
          </Link>
        ))}
      </nav>

      {/* Storage Widget
      <div className="px-5 py-6 shrink-0">
        <div className="bg-white border border-stone-200 rounded-[2rem] p-5 shadow-sm">
          <div className="flex justify-between items-end mb-3">
            <div>
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-1">Storage</p>
              <p className="text-xs font-bold text-stone-900">{STORAGE_USED} GB <span className="text-stone-400 font-medium">used</span></p>
            </div>
            <span className="text-[10px] font-bold text-lime-800 bg-lime-50 px-2 py-0.5 rounded-full">
              {Math.round(STORAGE_PCT)}%
            </span>
          </div>
          
          <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-lime-800 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${STORAGE_PCT}%` }}
            />
          </div>
          
          <p className="text-[10px] text-stone-400 mt-3 font-semibold italic text-center">
            {(STORAGE_TOTAL - STORAGE_USED).toFixed(1)} GB of earthy space left
          </p>
        </div>
      </div> */}

      {/* User Profile Section */}
      <div className="px-4 py-4 border-t border-stone-200 shrink-0 bg-stone-100/30">
        <div className="flex items-center gap-3 px-3 py-3 rounded-[1.5rem] bg-white border border-stone-200 shadow-sm transition-all hover:border-stone-300">
          <div className="w-10 h-10 rounded-xl bg-lime-100 border border-lime-200 flex items-center justify-center text-lime-800 text-xs font-black shrink-0 shadow-inner">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-stone-900 truncate tracking-tight">{user?.name || 'Explorer'}</p>
            <p className="text-[10px] font-medium text-stone-400 truncate uppercase tracking-wider">{user?.email}</p>
          </div>
          <button 
            onClick={logout} 
            title="Sign out"
            className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-all active:scale-90"
          >
            <LogOut size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;