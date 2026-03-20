//  Formatting 
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

export const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now  = new Date()
  const diff = now - date
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)

  if (mins < 1)   return 'Just now'
  if (mins < 60)  return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7)   return `${days}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: days > 365 ? 'numeric' : undefined })
}

//  File icon/color mapping 
export const getFileIcon = (mimeType = '', name = '') => {
  const ext = name.split('.').pop()?.toLowerCase()
  if (mimeType.startsWith('image/'))                  return 'Image'
  if (mimeType.startsWith('video/'))                  return 'Video'
  if (mimeType.startsWith('audio/'))                  return 'Music'
  if (mimeType === 'application/pdf')                 return 'FileText'
  if (mimeType.includes('spreadsheet') || ['xls','xlsx','csv'].includes(ext)) return 'Sheet'
  if (mimeType.includes('presentation') || ['ppt','pptx'].includes(ext))      return 'Presentation'
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) return 'Archive'
  if (mimeType.startsWith('text/') || ['js','jsx','ts','tsx','html','css','json','py','java','c','cpp','go','rs'].includes(ext)) return 'Code'
  if (mimeType.includes('word') || ['doc','docx'].includes(ext))              return 'FileText'
  return 'File'
}

export const getMimeColor = (mimeType = '', name = '') => {
  const ext = name.split('.').pop()?.toLowerCase()
  if (mimeType.startsWith('image/'))  return '#f472b6'
  if (mimeType.startsWith('video/'))  return '#a78bfa'
  if (mimeType.startsWith('audio/'))  return '#34d399'
  if (mimeType === 'application/pdf') return '#f87171'
  if (mimeType.includes('spreadsheet') || ['xls','xlsx','csv'].includes(ext)) return '#4ade80'
  if (mimeType.includes('presentation') || ['ppt','pptx'].includes(ext))      return '#fb923c'
  if (mimeType.includes('zip') || mimeType.includes('rar'))                    return '#fbbf24'
  if (mimeType.startsWith('text/') || ['js','jsx','ts','tsx','html','css','json'].includes(ext)) return '#60a5fa'
  return '#94a3b8'
}

export const isPreviewable = (mimeType = '') =>
  mimeType.startsWith('image/') ||
  mimeType === 'application/pdf' ||
  mimeType.startsWith('text/')

//  Breadcrumbs 
export const generateBreadcrumbs = (folders, currentFolderId) => {
  if (!currentFolderId) return [{ id: null, name: 'My Drive' }]
  const crumbs = [{ id: null, name: 'My Drive' }]
  const folderMap = {}
  if (Array.isArray(folders)) folders.forEach((f) => { folderMap[f.id] = f })
  const current = folderMap[currentFolderId]
  if (current) crumbs.push({ id: current.id, name: current.name })
  return crumbs
}

//  Clipboard 
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const el = document.createElement('textarea')
    el.value = text
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  }
}

//  cn utility (classnames) 
export const cn = (...classes) => classes.filter(Boolean).join(' ')