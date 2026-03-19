import { create } from 'zustand';

export const useFileStore = create((set, get) => ({
  files:           [],
  folders:         [],
  currentFolderId: null,
  selectedItems:   [],
  viewMode:        'grid',
  sortBy:          'name',
  sortOrder:       'asc',
  searchQuery:     '',
  isLoading:       false,
  breadcrumbs:     [],

  // Setters
  setFiles:           (files)         => set({ files }),
  setFolders:         (folders)       => set({ folders }),
  setCurrentFolderId: (currentFolderId) => set({ currentFolderId }),
  setViewMode:        (viewMode)      => set({ viewMode }),
  setSortBy:          (sortBy)        => set({ sortBy }),
  setSortOrder:       (sortOrder)     => set({ sortOrder }),
  setSearchQuery:     (searchQuery)   => set({ searchQuery }),
  setBreadcrumbs:     (breadcrumbs)   => set({ breadcrumbs }),
  setIsLoading:       (isLoading)     => set({ isLoading }),

  // Selection
  setSelectedItems: (items)  => set({ selectedItems: items }),
  clearSelection:   ()       => set({ selectedItems: [] }),
  toggleItemSelection: (item) => {
    const { selectedItems } = get();
    const exists = selectedItems.some((i) => i.id === item.id && i.type === item.type);
    set({
      selectedItems: exists
        ? selectedItems.filter((i) => !(i.id === item.id && i.type === item.type))
        : [...selectedItems, item],
    });
  },

  // File mutations
  addFile:    (file)         => set((s) => ({ files: [file, ...s.files] })),
  updateFile: (id, updates)  => set((s) => ({ files: s.files.map((f) => f.id === id ? { ...f, ...updates } : f) })),
  removeFile: (id)           => set((s) => ({ files: s.files.filter((f) => f.id !== id) })),

  // Folder mutations
  addFolder:    (folder)        => set((s) => ({ folders: [folder, ...s.folders] })),
  updateFolder: (id, updates)   => set((s) => ({ folders: s.folders.map((f) => f.id === id ? { ...f, ...updates } : f) })),
  removeFolder: (id)            => set((s) => ({ folders: s.folders.filter((f) => f.id !== id) })),

  // Computed
  getSortedAndFilteredItems: () => {
    const { files, folders, searchQuery, sortBy, sortOrder } = get();

    let items = [
      ...folders.map((f) => ({ ...f, type: 'folder' })),
      ...files.map((f) => ({ ...f, type: 'file' })),
    ];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter((i) => i.name.toLowerCase().includes(q));
    }

    items.sort((a, b) => {
      if (a.type === 'folder' && b.type === 'file') return -1;
      if (a.type === 'file'   && b.type === 'folder') return 1;
      let cmp = 0;
      if (sortBy === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortBy === 'date') cmp = new Date(a.updated_at || a.created_at) - new Date(b.updated_at || b.created_at);
      else if (sortBy === 'size') cmp = (a.size_bytes || 0) - (b.size_bytes || 0);
      return sortOrder === 'asc' ? cmp : -cmp;
    });

    return items;
  },
}));