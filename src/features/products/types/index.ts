import { z } from 'zod';

export const productSchema = z
  .object({
    id: z.string(),
    name: z.string().optional(),
    price: z.number().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  })
  .passthrough();

export type Product = z.infer<typeof productSchema>;

export const productListSchema = z.array(productSchema);
