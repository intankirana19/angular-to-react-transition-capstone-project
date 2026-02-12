import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProduct } from '../services/productsService';
import { type Product, type ProductInputValues } from '../../types';

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, ProductInputValues>({
    mutationFn: async (payload) => {
      return createProduct(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products'] }); // kalo sukses create, invalidasi utk fetch latest data list product
    },
  });
}
