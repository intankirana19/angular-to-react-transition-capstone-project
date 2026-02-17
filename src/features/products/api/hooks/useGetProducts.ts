import { useSuspenseQuery } from '@tanstack/react-query';
import { type Product } from '../../types';
import { getProducts } from '../services/productsService';

// custom hook untuk fetch & cache produk pakai react query (service pisah biar hook fokus cache & lifecycle react query aja?)
export function useGetProducts() {
  return useSuspenseQuery({ // ganti dr useQuery jadi pakai useSuspenseQuery biar state loading dihandle di <Suspense fallback> di MainLayout
    queryKey: ['products'],
    queryFn: async (): Promise<Product[]> => {
      return getProducts();
    },
  });
}
