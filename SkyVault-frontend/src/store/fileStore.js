import { create } from 'zustand';

export const useFileStore = create((set, get) => ({
  // State
  files: [],
  folders: [],
  currentFolderId: null,
  selectedItems: [],
  viewMode: 'grid', // 'grid' or 'list'
  sortBy: 'name', // 'name', 'date', 'size'
  sortOrder: 'asc', // 'asc' or 'desc'
  searchQuery: '',
  isLoading: false,
  breadcrumbs: [],

  // Actions
  setFiles: (files) => set({ files }),
  setFolders: (folders) => set({ folders }),
  setCurrentFolderId: (folderId) => set({ currentFolderId: folderId }),
  
  setSelectedItems: (items) => set({ selectedItems: items }),
  toggleItemSelection: (item) => {
    const { selectedItems } = get();
    const isSelected = selectedItems.some(
      (i) => i.id === item.id && i.type === item.type
    );
    
    if (isSelected) {
      set({
        selectedItems: selectedItems.filter(
          (i) => !(i.id === item.id && i.type === item.type)
        ),
      });
    } else {
      set({ selectedItems: [...selectedItems, item] });
    }
  },
  
  clearSelection: () => set({ selectedItems: [] }),
  
  setViewMode: (viewMode) => set({ viewMode }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
  
  addFile: (file) => set((state) => ({ files: [file, ...state.files] })),
  updateFile: (id, updates) =>
    set((state) => ({
      files: state.files.map((file) =>
        file.id === id ? { ...file, ...updates } : file
      ),
    })),
  removeFile: (id) =>
    set((state) => ({
      files: state.files.filter((file) => file.id !== id),
    })),
    
  addFolder: (folder) => set((state) => ({ folders: [folder, ...state.folders] })),
  updateFolder: (id, updates) =>
    set((state) => ({
      folders: state.folders.map((folder) =>
        folder.id === id ? { ...folder, ...updates } : folder
      ),
    })),
  removeFolder: (id) =>
    set((state) => ({
      folders: state.folders.filter((folder) => folder.id !== id),
    })),

  // Computed getters
  getSortedAndFilteredItems: () => {
    const { files, folders, searchQuery, sortBy, sortOrder } = get();
    
    let allItems = [
      ...folders.map((f) => ({ ...f, type: 'folder' })),
      ...files.map((f) => ({ ...f, type: 'file' })),
    ];

    // Filter by search query
    if (searchQuery) {
      allItems = allItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort items
    allItems.sort((a, b) => {
      // Always keep folders first
      if (a.type === 'folder' && b.type === 'file') return -1;
      if (a.type === 'file' && b.type === 'folder') return 1;

      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.created_at) - new Date(b.created_at);
          break;
        case 'size':
          comparison = (a.size_bytes || 0) - (b.size_bytes || 0);
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return allItems;
  },
}));