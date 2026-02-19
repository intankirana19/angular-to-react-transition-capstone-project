import { apiClient } from '@/shared/lib/axios';
import { API_ENDPOINTS } from '@/shared/api/endpoints';
import { applyProductListQuery } from '../../utils/productListQuery';
import {
  productInputSchema,
  productListSchema,
  productSchema,
  type Product,
  type ProductInputValues,
  type ProductListQuery,
} from '../../types';

const PRODUCTS_STORAGE_KEY = 'mock:products'; // key cache data products mock di localStorage
const MOCK_NETWORK_DELAY_MS = 5000; // delay mock request utk simulasi loading/pending

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// MOCK API: list produk sementara disimpan localStorage supaya hasil create tetap terlihat setelah refresh
function persistProducts(products: Product[]): void {
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
}

// MOCK API: ngambil data dari localStorage dulu; kalau belum ada, fallback ke API list lalu cache
async function loadProducts(): Promise<Product[]> {
  const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);

  if (stored) {
    const parsed = productListSchema.safeParse(JSON.parse(stored));
    if (parsed.success) {
      return parsed.data;
    }
  }

  const response = await apiClient.get(API_ENDPOINTS.products); // fallback seed data awal dari endpoint list
  const products = productListSchema.parse(response.data);
  persistProducts(products); // simpan seed agar create/edit/delete tetap konsisten setelah reload
  return products;
}

// SEARCH[7] + FILTER[13] + SORT[8]: Service list nerima payload query biar kontraknya siap saat API server-side udah ada
export async function getProducts(query: ProductListQuery = {}): Promise<Product[]> {
  const products = await loadProducts(); // ambil dulu source list mentah sebelum masuk proses query
  const queriedProducts = applyProductListQuery(products, query); // SEARCH[8] + FILTER[14] + SORT[9]: sementara diproses lokal biar berasa kayak response API
  return queriedProducts;

  // SEARCH[99] + FILTER[99] + SORT[99]: kalau backend udah support query params, cukup pindah ke request params di sini
  // const response = await apiClient.get(API_ENDPOINTS.products, { params: query });
  // return productListSchema.parse(response.data);
}

// Dipakai ProductDetailPage/EditProductPage buat ambil 1 product berdasarkan id
export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts(); // ambil dari source list yang sama biar data tetap sinkron
  const product = products.find((item) => item.id === id);

  return product ?? null;

  // kalo ada api get detail by id
  // const response = await apiClient.get(API_ENDPOINTS.product(id)); // pakai ini saat endpoint detail sudah ada
  // return productSchema.parse(response.data);
}

// MOCK CREATE API: validasi input, lalu simpan ke localStorage
export async function createProduct(payload: ProductInputValues): Promise<Product> {
  await delay(MOCK_NETWORK_DELAY_MS); // buat tes disable submit button

  const input = productInputSchema.parse(payload); // validasi payload create
  const products = await loadProducts(); // ambil list existing untuk append/prepend

  const newProduct = productSchema.parse({
    id: crypto.randomUUID(),
    ...input,
    createdAt: new Date().toISOString(),
  });

  const nextProducts = [newProduct, ...products]; // prepend biar item baru langsung muncul di atas list
  persistProducts(nextProducts);

  return newProduct;

  // kalo udah ada create api
  // const response = await apiClient.post(API_ENDPOINTS.products, payload); // pakai ini saat create endpoint tersedia
  // return productSchema.parse(response.data);
}

// MOCK UPDATE API: validasi input, update produk berdasarkan id, lalu simpan ke localStorage
export async function updateProduct(id: string, payload: ProductInputValues): Promise<Product> {
  await delay(MOCK_NETWORK_DELAY_MS);

  const input = productInputSchema.parse(payload); // validasi payload update
  const products = await loadProducts();
  // Cari item existing yang akan dioverwrite datanya
  const productIndex = products.findIndex((item) => item.id === id); // cari index product target

  if (productIndex < 0) {
    throw new Error('Product not found');
  }

  const currentProduct = products[productIndex];
  // Pertahankan id/createdAt lama agar tidak berubah saat edit
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
  // const response = await apiClient.put(API_ENDPOINTS.product(id), payload); // pakai ini saat update endpoint tersedia
  // return productSchema.parse(response.data);
}

// MOCK DELETE API: hapus produk berdasarkan id lalu simpan ulang ke localStorage
export async function deleteProduct(id: string): Promise<void> {
  await delay(MOCK_NETWORK_DELAY_MS);

  // buat test negative/failure feedback
  // throw new Error('Mock delete failed. Please try again.'); // aktifkan utk test skenario gagal

  const products = await loadProducts();

  const nextProducts = products.filter((item) => item.id !== id); // immutable delete by id

  if (nextProducts.length === products.length) {
    throw new Error('Product not found');
  }

  persistProducts(nextProducts); // persist ulang agar list langsung sinkron

  // kalo udah ada delete api
  // await apiClient.delete(API_ENDPOINTS.product(id)); // pakai ini saat delete endpoint tersedia
}
