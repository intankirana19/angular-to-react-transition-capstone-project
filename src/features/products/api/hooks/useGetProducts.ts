import { useSuspenseQuery } from '@tanstack/react-query';
import { type Product, type ProductListQuery } from '../../types';
import { getProducts } from '../services/productsService';

// custom hook untuk fetch & cache produk pakai react query
export function useGetProducts(query: ProductListQuery = {}) {
  // SEARCH[4] + FILTER[10] + SORT[5]: Pakai useSuspenseQuery biar data list ke-cache dan loading awal di-handle lewat Suspense
  return useSuspenseQuery({
    queryKey: ['products', query], // SEARCH[5] + FILTER[11] + SORT[6]: cache key expected bawa shape payload { search?, material?, createdFrom?, createdTo?, sortBy?, sortOrder? }
    queryFn: (): Promise<Product[]> => getProducts(query), // SEARCH[8] + FILTER[12] + SORT[7]: final output expected Product[] siap dipakai table
  });
}
