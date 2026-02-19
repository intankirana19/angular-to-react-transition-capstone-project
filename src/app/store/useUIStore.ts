import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UiState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      sidebarCollapsed: false,
      // toggle cepat buat buka tutup sidebar
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      // setter eksplisit biar sinkronisasi viewport lebih gampang
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      // kalau collapse di desktop sidebar tetep dianggap kebuka
      toggleSidebarCollapsed: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed, sidebarOpen: true })),
      // helper langsung set status collapse
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed, sidebarOpen: true }),
    }),
    {
      name: 'ui-storage',
      // simpan yang perlu dipersist aja
      partialize: (state) => ({ sidebarCollapsed: state.sidebarCollapsed }),
    }
  )
);
