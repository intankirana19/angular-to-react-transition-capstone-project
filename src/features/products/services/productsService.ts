import { apiClient } from '@/shared/lib/axios';
import { API_ENDPOINTS } from '@/shared/api/endpoints';
import {
  productListSchema,
  type Product,
} from '../types';

const PRODUCTS_STORAGE_KEY = 'mock:products';

// MOCK API: list produk sementara disimpan localStorage supaya hasil create tetap terlihat setelah refresh.
function persistProducts(products: Product[]): void {
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
}

// MOCK API: ngambil data dari localStorage dulu; kalau belum ada, fallback ke API list lalu cache.
async function loadProducts(): Promise<Product[]> {
  const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);

  if (stored) {
    const parsed = productListSchema.safeParse(JSON.parse(stored));
    if (parsed.success) {
      return parsed.data;
    }
  }

  const response = await apiClient.get(API_ENDPOINTS.products);
  const products = productListSchema.parse(response.data);
  persistProducts(products);
  return products;
}

// service utk fetch & validasi data produk; dipisah dengan hook in case reusable?
export async function getProducts(): Promise<Product[]> {
  return loadProducts();
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
