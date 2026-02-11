// pakai zod bisa infer tipe TypeScript sekaligus validasi pas runtime + parsing/coercion
import { z } from 'zod';

export const productSchema = z
  .object({
    id: z.string(),
    name: z.string().optional(),
    price: z.coerce.number().optional(), // data price dari mock api type string jd coerce ke number biar di seluruh app bisa hitung, sort, dan format harga tanpa konversi berulang?
    avatar: z.string().optional(),
    material: z.string().optional(),
    description: z.string().optional(),
    createdAt: z.string().optional(),
  })
  // .passthrough(); // blm perlu? unknown keys behavior/ kalo ada field data baru: defaultnya strip -> (dibuang), strict() -> error, passthrough() -> field baru tetap disimpan.
  

export type Product = z.infer<typeof productSchema>; // tipe produk untuk dipakai di seluruh app.
export const productListSchema = z.array(productSchema); // skema list produk (array dari product).


export const productInputSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  price: z.coerce.number().nonnegative('Price must be a valid number'), // coerce ke number biar validasi konsisten walau input string.
  // Opsional, cuma string bersih.
  avatar: z.string().trim().optional(),
  material: z.string().trim().optional(),
  description: z.string().trim().optional(),
});

export type ProductInputValues = z.infer<typeof productInputSchema>;