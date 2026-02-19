import { useEffect, useMemo, useState } from 'react';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';
import { type ProductListQuery, type Product } from '../types';

const PAGE_SIZE = 10;

export function useProductInfiniteList(products: Product[], queryPayload: ProductListQuery) {
  const [page, setPage] = useState(1); // INFINITE[1]: Pakai useState buat nyimpen halaman batch yang lagi aktif

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const hasMore = page < totalPages;
  const hasProducts = products.length > 0;
  const visibleProducts = useMemo(() => products.slice(0, page * PAGE_SIZE), [products, page]); // INFINITE[2]: Pakai useMemo biar slicing visibleProducts cuma dihitung ulang saat products/page berubah

  useEffect(() => {
    setPage(1);
  }, [queryPayload]); // INFINITE[3]: Pakai useEffect buat reset ke batch pertama tiap query search/filter/sort berubah

  // INFINITE[4]: Hook shared ini mantau posisi scroll lalu trigger load batch berikutnya
  useInfiniteScroll({
    enabled: hasProducts && hasMore,
    hasMore,
    scrollContainerId: 'app-main-scroll',
    threshold: 200,
    debounceMs: 300,
    onLoadMore: () => {
      // INFINITE[5]: Saat near-bottom, page dinaikin sampai mentok totalPages
      setPage((prevPage) => Math.min(prevPage + 1, totalPages));
    },
  });

  return { hasProducts, visibleProducts };
}
