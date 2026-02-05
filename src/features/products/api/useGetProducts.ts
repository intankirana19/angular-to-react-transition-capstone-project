import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/lib/axios';
import { API_ENDPOINTS } from '@/shared/api/endpoints';
import { productListSchema, type Product } from '../types';

export function useGetProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async (): Promise<Product[]> => {
      const response = await apiClient.get(API_ENDPOINTS.products);
      return productListSchema.parse(response.data);
    },
  });
}
