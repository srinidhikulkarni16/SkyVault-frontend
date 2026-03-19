import React from 'react';
import {
  File, FileText, Image, Video, Music,
  Archive, Code, Table2, Presentation, Folder,
} from 'lucide-react';
import { getFileIcon, getMimeColor } from '../../lib/utils';

const ICON_MAP = {
  Image, Video, Music, FileText, Sheet: Table2, Presentation,
  Archive, Code, File, Folder,
};

const FileIcon = ({ mimeType = '', name = '', size = 24, className = '' }) => {
  const iconName = getFileIcon(mimeType, name);
  const color    = getMimeColor(mimeType, name);
  const Icon     = ICON_MAP[iconName] || File;

  return (
    <Icon
      size={size}
      style={{ color, flexShrink: 0 }}
      className={className}
      strokeWidth={1.75}
    />
  );
};

export default FileIcon;