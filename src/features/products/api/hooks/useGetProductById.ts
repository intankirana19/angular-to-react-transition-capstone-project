import { useSuspenseQuery } from '@tanstack/react-query';
import { type Product } from '../../types';
import { getProductById } from '../services/productsService';

export function useGetProductById(productId?: string) {
  return useSuspenseQuery<Product | null, Error>({ // sebelumnya pakai useQuery + branch isLoading/error manual di page, sekarang loading/error di-handle oleh Suspense + ErrorBoundary 
    queryKey: ['products', productId],
    queryFn: () => {
      if (!productId) {
        return Promise.resolve(null);
      }
      return getProductById(productId);
    },
    // enabled: Boolean(productId), // sebelumnya dipakai saat masih useQuery (non-suspense) biar query ga jalan kalau id belum ada, sekarang dihapus karena guard id sudah dipindah ke level page/route + ErrorBoundary
  });
}
