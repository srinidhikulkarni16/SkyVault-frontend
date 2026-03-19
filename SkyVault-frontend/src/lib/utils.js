// ── Format Helpers ────────────────────────────────────────────────────────────

export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${units[i]}`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  const secs  = Math.floor(diff / 1000);
  const mins  = Math.floor(secs  / 60);
  const hours = Math.floor(mins  / 60);
  const days  = Math.floor(hours / 24);

  if (secs  < 60)  return 'Just now';
  if (mins  < 60)  return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  if (days  < 7)   return `${days}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: days > 365 ? 'numeric' : undefined });
};

export const formatDateFull = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

// ── File Type Helpers ─────────────────────────────────────────────────────────

export const getFileExtension = (name = '') => {
  const parts = name.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
};

export const getFileIcon = (mimeType = '', name = '') => {
  const ext = getFileExtension(name);
  const m = mimeType.toLowerCase();

  if (m.startsWith('image/'))  return 'Image';
  if (m.startsWith('video/'))  return 'Video';
  if (m.startsWith('audio/'))  return 'Music';
  if (m === 'application/pdf') return 'FileText';

  if (['doc','docx','odt','rtf'].includes(ext)) return 'FileText';
  if (['xls','xlsx','csv','ods'].includes(ext)) return 'Sheet';
  if (['ppt','pptx','odp'].includes(ext))       return 'Presentation';
  if (['zip','rar','7z','tar','gz'].includes(ext)) return 'Archive';
  if (['js','ts','jsx','tsx','html','css','json','py','rb','java','go','rs'].includes(ext)) return 'Code';

  return 'File';
};

export const getFileIconClass = (mimeType = '', name = '') => {
  const icon = getFileIcon(mimeType, name);
  const map = {
    Image: 'icon-img',
    Video: 'icon-vid',
    Music: 'icon-audio',
    FileText: 'icon-pdf',
    Sheet: 'icon-sheet',
    Presentation: 'icon-doc',
    Archive: 'icon-zip',
    Code: 'icon-code',
    File: 'icon-default',
  };
  return map[icon] || 'icon-default';
};

export const isPreviewable = (mimeType = '') => {
  return (
    mimeType.startsWith('image/') ||
    mimeType === 'application/pdf' ||
    mimeType.startsWith('text/')
  );
};

export const getMimeColor = (mimeType = '', name = '') => {
  const icon = getFileIcon(mimeType, name);
  const map = {
    Image: '#4EC9B0',
    Video: '#C792EA',
    Music: '#F5A623',
    FileText: '#F55',
    Sheet: '#2ECC71',
    Presentation: '#4F9EF7',
    Archive: '#F0DB4F',
    Code: '#82AAFF',
    File: '#5A6280',
  };
  return map[icon] || '#5A6280';
};

// ── Breadcrumb Helper ─────────────────────────────────────────────────────────

export const generateBreadcrumbs = (folderData, currentFolderId) => {
  const crumbs = [{ id: null, name: 'My Drive' }];
  if (!folderData || !currentFolderId) return crumbs;

  const buildPath = (id, folders, acc = []) => {
    const folder = folders?.find?.((f) => f.id === id);
    if (!folder) return acc;
    acc.unshift({ id: folder.id, name: folder.name });
    if (folder.parent_id) return buildPath(folder.parent_id, folders, acc);
    return acc;
  };

  const path = buildPath(currentFolderId, Array.isArray(folderData) ? folderData : [folderData]);
  return [...crumbs, ...path];
};

// ── Clipboard Helper ──────────────────────────────────────────────────────────

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    return true;
  }
};

// ── Class Name Helper ─────────────────────────────────────────────────────────

export const cn = (...classes) => classes.filter(Boolean).join(' ');