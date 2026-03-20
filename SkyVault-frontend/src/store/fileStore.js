import { create } from 'zustand'

export const useFileStore = create((set, get) => ({
  files:           [],
  folders:         [],
  currentFolderId: null,
  breadcrumbs:     [],
  viewMode:        'grid',       // 'grid' | 'list'
  searchQuery:     '',
  sortBy:          'name',       // 'name' | 'date' | 'size'
  sortOrder:       'asc',        // 'asc' | 'desc'
  selectedItems:   [],

  setFiles:           (files)           => set({ files }),
  setFolders:         (folders)         => set({ folders }),
  setCurrentFolderId: (id)              => set({ currentFolderId: id }),
  setBreadcrumbs:     (breadcrumbs)     => set({ breadcrumbs }),
  setViewMode:        (viewMode)        => set({ viewMode }),
  setSearchQuery:     (searchQuery)     => set({ searchQuery }),
  setSortBy:          (sortBy)          => set({ sortBy }),
  setSortOrder:       (sortOrder)       => set({ sortOrder }),

  toggleItemSelection: (item) => {
    const { selectedItems } = get()
    const exists = selectedItems.some((i) => i.id === item.id && i.type === item.type)
    set({
      selectedItems: exists
        ? selectedItems.filter((i) => !(i.id === item.id && i.type === item.type))
        : [...selectedItems, item],
    })
  },
  clearSelection: () => set({ selectedItems: [] }),

  getSortedAndFilteredItems: () => {
    const { files, folders, searchQuery, sortBy, sortOrder } = get()

    const allFolders = folders.map((f) => ({ ...f, type: 'folder' }))
    const allFiles   = files.map((f)   => ({ ...f, type: 'file'   }))
    let items = [...allFolders, ...allFiles]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      items = items.filter((i) => i.name?.toLowerCase().includes(q))
    }

    items.sort((a, b) => {
      // Folders first
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1

      let cmp = 0
      if (sortBy === 'name') cmp = (a.name || '').localeCompare(b.name || '')
      else if (sortBy === 'date') cmp = new Date(a.updated_at || 0) - new Date(b.updated_at || 0)
      else if (sortBy === 'size') cmp = (a.size_bytes || 0) - (b.size_bytes || 0)
      return sortOrder === 'asc' ? cmp : -cmp
    })

    return items
  },
}))