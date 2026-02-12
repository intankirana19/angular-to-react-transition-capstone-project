import { useQuery } from '@tanstack/react-query';
import { type Product } from '../../types';
import { getProductById } from '../services/productsService';

export function useGetProductById(productId?: string) {
  return useQuery<Product, Error>({
    queryKey: ['products', productId],
    queryFn: () => {
      if (!productId) {
        throw new Error('Product ID is required');
      }
      return getProductById(productId);
    },
    enabled: Boolean(productId),
  });
}
