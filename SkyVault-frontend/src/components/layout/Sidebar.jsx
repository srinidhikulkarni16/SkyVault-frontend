import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  FolderOpen,
  Users,
  Star,
  Clock,
  Trash2,
  Cloud,
  Settings,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'My Drive', href: '/', icon: Home },
    { name: 'Shared with me', href: '/shared', icon: Users },
    { name: 'Starred', href: '/starred', icon: Star },
    { name: 'Recent', href: '/recent', icon: Clock },
    { name: 'Trash', href: '/trash', icon: Trash2 },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname.startsWith('/folder/');
    }
    return location.pathname === path;
  };

  return (
    <div className="flex flex-col h-screen bg-white border-r border-gray-200 w-64 fixed left-0 top-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-gray-200">
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
          <Cloud className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-gray-900 tracking-tight">CloudDrive</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              isActive(item.href)
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            <item.icon className={cn(
              'w-5 h-5',
              isActive(item.href) ? 'text-primary-600' : 'text-gray-400'
            )} />
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Storage Status */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">Storage</span>
            <span className="text-xs font-semibold text-gray-900">2.5 GB / 15 GB</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-primary-600 h-1.5 rounded-full"
              style={{ width: '17%' }}
            ></div>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="px-3 py-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="flex items-center justify-center w-10 h-10 bg-primary-100 text-primary-700 rounded-full font-semibold">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;