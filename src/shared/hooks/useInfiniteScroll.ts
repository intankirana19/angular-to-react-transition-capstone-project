import { useEffect, useState } from 'react';
import { useDebounce } from './useDebounce';

// https://blog.logrocket.com/react-infinite-scroll/
interface UseInfiniteScrollParams {
  enabled?: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  scrollContainerId?: string;
  threshold?: number;
  debounceMs?: number;
}

export function useInfiniteScroll({
  enabled = true,
  hasMore,
  onLoadMore,
  scrollContainerId,
  threshold = 200,
  debounceMs = 300,
}: UseInfiniteScrollParams) {
  const [scrollTick, setScrollTick] = useState(0); // INFINITE[7]: Counter kecil yang naik tiap ada scroll
  const debouncedScrollTick = useDebounce(scrollTick, debounceMs); // INFINITE[8]: Counter ini ditahan dulu biar ga terlalu sering proses

  useEffect(() => {
    if (!enabled) { // INFINITE[9]: Kalau dimatiin, stop dulu
      return;
    }

    // INFINITE[10]: Cari target scroll: pakai id container, kalau ga ada pakai window
    const scrollContainer = scrollContainerId
      ? document.getElementById(scrollContainerId)
      : null;
    const target: HTMLElement | Window = scrollContainer ?? window;

    const handleScroll = () => {
      setScrollTick((prev) => prev + 1); // INFINITE[11]: Pas scroll, cukup naikkan counter
    };

    target.addEventListener('scroll', handleScroll); // INFINITE[12]: Pasang listener scroll
    handleScroll(); // INFINITE[13]: Cek sekali di awal, jadi ga perlu nunggu user scroll

    return () => {
      target.removeEventListener('scroll', handleScroll); // INFINITE[14]: Beresin listener saat komponen ditutup
    };
  }, [enabled, scrollContainerId]);

  useEffect(() => {
    if (!enabled || !hasMore) { // INFINITE[15]: Skip kalau nonaktif atau memang ga ada data lagi
      return;
    }

    const scrollContainer = scrollContainerId
      ? document.getElementById(scrollContainerId)
      : null;

    const isAtBottom = scrollContainer
      ? Math.ceil(scrollContainer.clientHeight + scrollContainer.scrollTop) >=
        scrollContainer.scrollHeight - threshold
      : Math.ceil(window.innerHeight + window.scrollY) >=
        document.documentElement.scrollHeight - threshold; // INFINITE[16]: Cek, posisi scroll sudah deket bawah belum

    if (isAtBottom) {
      onLoadMore(); // INFINITE[17]: Kalau udah deket bawah, minta load batch berikutnya
    }
  }, [debouncedScrollTick, enabled, hasMore, onLoadMore, scrollContainerId, threshold]);
}
