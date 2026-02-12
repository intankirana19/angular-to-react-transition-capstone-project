import { useQuery } from '@tanstack/react-query';
import { type Product } from '../../types';
import { getProducts } from '../services/productsService';

// custom hook untuk fetch & cache produk pakai react query (service pisah biar hook fokus cache & lifecycle react query aja?)
export function useGetProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async (): Promise<Product[]> => {
      return getProducts();
    },
  });
}
