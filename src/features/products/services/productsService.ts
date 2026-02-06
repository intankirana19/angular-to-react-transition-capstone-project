import { apiClient } from '@/shared/lib/axios';
import { API_ENDPOINTS } from '@/shared/api/endpoints';
import { productListSchema, type Product } from '../types';

// service utk fetch & validasi data produk; dipisah dengan hook in case reusable?
export async function getProducts(): Promise<Product[]> {
  const response = await apiClient.get(API_ENDPOINTS.products);
  return productListSchema.parse(response.data);
}
