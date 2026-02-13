import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProduct } from '../services/productsService';

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await deleteProduct(id);
    },
    onSuccess: async (_, id) => {
      await queryClient.invalidateQueries({ queryKey: ['products'] }); // refresh list biar item yang dihapus langsung hilang dari table.
      await queryClient.invalidateQueries({ queryKey: ['products', id] }); // refresh cache detail produk utk id yang didelete.
    },
  });
}
