import { apiClient } from '@/shared/lib/axios';
import { API_ENDPOINTS } from '@/shared/api/endpoints';
import {
  productInputSchema,
  productListSchema,
  productSchema,
  type Product,
  type ProductInputValues,
} from '../../types';

const PRODUCTS_STORAGE_KEY = 'mock:products';
const MOCK_NETWORK_DELAY_MS = 5000; // buat tes disable submit button

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

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

// MOCK CREATE API: validasi input, lalu simpan ke localStorage.
export async function createProduct(payload: ProductInputValues): Promise<Product> {
  await delay(MOCK_NETWORK_DELAY_MS);  // buat tes disable submit button

  const input = productInputSchema.parse(payload);
  const products = await loadProducts();

  const newProduct = productSchema.parse({
    id: crypto.randomUUID(),
    ...input,
    createdAt: new Date().toISOString(),
  });

  const nextProducts = [newProduct, ...products]; // MOCK CREATE API: diprepend biar produk baru ada di index 0/awal list, tinggal ubah kalo mau diappend
  persistProducts(nextProducts);

  return newProduct;

  // kalo udah ada create api
  // const response = await apiClient.post(API_ENDPOINTS.products, payload);
  // return productSchema.parse(response.data);
}

// MOCK UPDATE API: validasi input, update produk berdasarkan id, lalu simpan ke localStorage.
export async function updateProduct(id: string, payload: ProductInputValues): Promise<Product> {
  await delay(MOCK_NETWORK_DELAY_MS);

  const input = productInputSchema.parse(payload);
  const products = await loadProducts();
  // Cari item existing yang akan dioverwrite datanya.
  const productIndex = products.findIndex((item) => item.id === id);

  if (productIndex < 0) {
    throw new Error('Product not found');
  }

  const currentProduct = products[productIndex];
  // Pertahankan id/createdAt lama agar tidak berubah saat edit.
  const updatedProduct = productSchema.parse({
    ...currentProduct,
    ...input,
    id: currentProduct.id,
    createdAt: currentProduct.createdAt ?? new Date().toISOString(),
  });

  const nextProducts = [...products];
  nextProducts[productIndex] = updatedProduct;
  persistProducts(nextProducts);

  return updatedProduct;

  // kalo udah ada update api
  // const response = await apiClient.put(API_ENDPOINTS.product(id), payload);
  // return productSchema.parse(response.data);
}

// MOCK DELETE API: hapus produk berdasarkan id lalu simpan ulang ke localStorage.
export async function deleteProduct(id: string): Promise<void> {
  await delay(MOCK_NETWORK_DELAY_MS);

  const products = await loadProducts();

  const nextProducts = products.filter((item) => item.id !== id); // Hapus item by id; array baru biar approach immutable/ update data tanpa langsung ubah yg lama biar mudah dilacak dan aman untuk state sync.

  if (nextProducts.length === products.length) {
    throw new Error('Product not found');
  }

  persistProducts(nextProducts); // persist ulang buat update list dilocalhost

  // kalo udah ada delete api
  // await apiClient.delete(API_ENDPOINTS.product(id));
}
