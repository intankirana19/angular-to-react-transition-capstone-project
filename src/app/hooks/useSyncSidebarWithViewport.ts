import { useEffect } from 'react';
import { useUiStore } from '@/app/store/useUIStore';
import { useMediaQuery } from '@/shared/hooks/useMediaQuery';

export function useSyncSidebarWithViewport() {
  // baca lebar layar biar tau lagi mode desktop atau mobile
  const isDesktop = useMediaQuery('(min-width: 1024px)', true);
  const { setSidebarOpen } = useUiStore();

  // sinkronin state sidebar tiap kali breakpoint berubah
  useEffect(() => {
    setSidebarOpen(isDesktop);
  }, [isDesktop, setSidebarOpen]);

  // balikin status desktop buat dipake komponen lain kalau perlu
  return isDesktop;
}
