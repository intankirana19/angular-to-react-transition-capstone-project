import { apiClient } from '@/shared/lib/axios';
import { API_ENDPOINTS } from '@/shared/api/endpoints';
import { productListSchema, type Product } from '../types';

// service utk fetch & validasi data produk; dipisah dengan hook in case reusable?
export async function getProducts(): Promise<Product[]> {
  const response = await apiClient.get(API_ENDPOINTS.products);
  return productListSchema.parse(response.data);
}

export async function getProductById(id: string): Promise<Product> {
  const products = await getProducts();
  const product = products.find((item) => item.id === id);

  if (!product) {
    throw new Error('Product not found');
  }

  return product;

  // kalo ada api get detail by id
  // const response = await apiClient.get(API_ENDPOINTS.product(id));
  // return productSchema.parse(response.data);
}
