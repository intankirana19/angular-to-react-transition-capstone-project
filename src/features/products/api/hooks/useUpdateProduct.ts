import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProduct } from '../services/productsService';
import { type Product, type ProductInputValues } from '../../types';

interface UpdateProductParams {
  id: string;
  payload: ProductInputValues;
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, UpdateProductParams>({
    mutationFn: async ({ id, payload }) => {
      return updateProduct(id, payload);
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['products'] }); // "refresh" list produk yang barusan diupdate.
      await queryClient.invalidateQueries({ queryKey: ['products', variables.id] }); // "refresh" detail produk yang barusan diupdate.
    },
  });
}
