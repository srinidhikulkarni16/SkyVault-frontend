import React from 'react';
import {
  File, FileText, Image, Video, Music,
  Archive, Code, Table2, Presentation, Folder,
} from 'lucide-react';
import { getFileIcon } from '../../lib/utils';

const ICON_MAP = {
  Image, Video, Music, FileText, Sheet: Table2, Presentation,
  Archive, Code, File, Folder,
};

const FileIcon = ({ mimeType = '', name = '', size = 20, className = '' }) => {
  const iconName = getFileIcon(mimeType, name);
  const Icon = ICON_MAP[iconName] || File;

  const getEarthyColor = () => {
    if (mimeType.startsWith('image/')) return 'text-lime-700 bg-lime-50 border-lime-100';
    if (mimeType.startsWith('video/')) return 'text-orange-700 bg-orange-50 border-orange-100';
    if (mimeType.startsWith('audio/')) return 'text-amber-700 bg-amber-50 border-amber-100';
    if (mimeType.includes('pdf') || mimeType.includes('word')) return 'text-stone-700 bg-stone-100 border-stone-200';
    if (mimeType.includes('zip') || mimeType.includes('tar')) return 'text-olive-900 bg-stone-200 border-stone-300';
    return 'text-lime-800 bg-stone-50 border-stone-100'; // Default Earthy Green
  };

  const themeClasses = getEarthyColor();

  return (
    <div className={`
      relative flex items-center justify-center shrink-0
      transition-all duration-300 group-hover:scale-110
      ${className}
    `}>
      <div className={`
        absolute inset-0 rounded-2xl border opacity-60
        ${themeClasses.split(' ').slice(1).join(' ')}
      `} />
      
      <Icon
        size={size}
        className={`relative z-10 transition-colors duration-300 ${themeClasses.split(' ')[0]}`}
        strokeWidth={2}
      />
    </div>
  );
};

export default FileIcon;