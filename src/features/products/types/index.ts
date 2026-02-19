// pakai zod bisa infer tipe TypeScript sekaligus validasi pas runtime + parsing/coercion
import { z } from 'zod';

export const productSchema = z
  .object({
    id: z.string(), // id unik product.
    name: z.string().optional(), // nama product (optional karena data mock bisa tidak lengkap).
    price: z.coerce.number().optional(), // data price dari mock api type string jd coerce ke number biar di seluruh app bisa hitung, sort, dan format harga tanpa konversi berulang?
    avatar: z.string().optional(), // url gambar.
    material: z.string().optional(), // kategori material product.
    description: z.string().optional(), // deskripsi singkat product.
    createdAt: z.string().optional(), // tanggal dibuat (ISO string).
  });
// .passthrough(); // blm perlu? unknown keys behavior/ kalo ada field data baru: defaultnya strip -> dibuang, strict() -> error, passthrough() -> field baru tetap disimpan

export type Product = z.infer<typeof productSchema>; // tipe produk untuk dipakai di seluruh app.
export const productListSchema = z.array(productSchema); // skema list produk (array dari product).

export type ProductSortField = 'createdAt' | 'price' | 'name' | 'material'; // field sort yang diizinkan query.
export type ProductSortOrder = 'asc' | 'desc'; // arah sort yang diizinkan query.

export interface ProductListQuery {
  search?: string; // SEARCH[13]: keyword search bebas yang dikirim page ke service.
  material?: string; // FILTER[23]: material filter yang dipilih user.
  createdFrom?: string; // FILTER[24]: batas bawah createdAt (ISO string).
  createdTo?: string; // FILTER[25]: batas atas createdAt (ISO string).
  sortBy?: ProductSortField; // SORT[21]: field target sorting.
  sortOrder?: ProductSortOrder; // SORT[22]: arah sorting.
}

export const productInputSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'), // name wajib ada.
  price: z.coerce.number().nonnegative('Price must be a valid number'), // coerce ke number biar validasi konsisten walau input string.
  avatar: z.string().trim().optional(), // optional url avatar.
  material: z.string().trim().optional(), // optional material text.
  description: z.string().trim().optional(), // optional description text.
});

export type ProductInputValues = z.infer<typeof productInputSchema>;
