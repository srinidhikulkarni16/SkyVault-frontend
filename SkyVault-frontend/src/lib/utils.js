import { format } from 'date-fns';

// Format file size
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

// Format date
export const formatDate = (date) => {
  if (!date) return '';
  try {
    return format(new Date(date), 'MMM dd, yyyy');
  } catch {
    return '';
  }
};

export const formatDateTime = (date) => {
  if (!date) return '';
  try {
    return format(new Date(date), 'MMM dd, yyyy HH:mm');
  } catch {
    return '';
  }
};

// Get file extension
export const getFileExtension = (filename) => {
  if (!filename) return '';
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
};

// Get file icon class based on mime type
export const getFileIcon = (mimeType, fileName) => {
  if (!mimeType && !fileName) return 'File';
  
  const extension = getFileExtension(fileName);
  
  if (mimeType?.startsWith('image/')) return 'Image';
  if (mimeType?.startsWith('video/')) return 'Video';
  if (mimeType?.startsWith('audio/')) return 'Music';
  
  const iconMap = {
    // Documents
    'pdf': 'FileText',
    'doc': 'FileText',
    'docx': 'FileText',
    'txt': 'FileText',
    'rtf': 'FileText',
    // Spreadsheets
    'xls': 'Sheet',
    'xlsx': 'Sheet',
    'csv': 'Sheet',
    // Presentations
    'ppt': 'Presentation',
    'pptx': 'Presentation',
    // Archives
    'zip': 'Archive',
    'rar': 'Archive',
    '7z': 'Archive',
    'tar': 'Archive',
    'gz': 'Archive',
    // Code
    'js': 'Code',
    'jsx': 'Code',
    'ts': 'Code',
    'tsx': 'Code',
    'html': 'Code',
    'css': 'Code',
    'json': 'Code',
    'py': 'Code',
  };

  return iconMap[extension] || 'File';
};

// Check if file is previewable in browser
export const isPreviewable = (mimeType) => {
  if (!mimeType) return false;
  
  const previewableTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/svg+xml',
    'image/webp',
    'application/pdf',
    'text/plain',
    'text/html',
  ];
  
  return previewableTypes.includes(mimeType) || mimeType.startsWith('text/');
};

// Copy text to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy: ', err);
    return false;
  }
};

// Combine Tailwind classes
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// Validate file type for upload
export const validateFileType = (file) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ];
  return allowedTypes.includes(file.type);
};

// Generate breadcrumbs from folder path
export const generateBreadcrumbs = (folders, currentFolderId) => {
  const breadcrumbs = [{ id: null, name: 'My Drive' }];
  
  if (!currentFolderId) return breadcrumbs;
  
  const findPath = (folderId, path = []) => {
    const folder = folders.find((f) => f.id === folderId);
    if (!folder) return path;
    
    path.unshift(folder);
    if (folder.parent_id) {
      return findPath(folder.parent_id, path);
    }
    return path;
  };
  
  const path = findPath(currentFolderId);
  return [...breadcrumbs, ...path];
};

// Create unique filename if duplicate exists
export const createUniqueFilename = (filename, existingNames) => {
  if (!existingNames.includes(filename)) return filename;
  
  const ext = getFileExtension(filename);
  const nameWithoutExt = ext 
    ? filename.slice(0, filename.lastIndexOf('.'))
    : filename;
  
  let counter = 1;
  let newName = ext 
    ? `${nameWithoutExt} (${counter}).${ext}`
    : `${nameWithoutExt} (${counter})`;
  
  while (existingNames.includes(newName)) {
    counter++;
    newName = ext 
      ? `${nameWithoutExt} (${counter}).${ext}`
      : `${nameWithoutExt} (${counter})`;
  }
  
  return newName;
};