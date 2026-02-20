import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/Dialog';
import { Button } from '@/shared/ui/Button';
import { AlertTriangle } from 'lucide-react';
import { useToast } from '@/shared/hooks/useToast';
import { useDeleteProduct } from '../api/hooks/useDeleteProduct';
import { type Product } from '../types';
import { getErrorMessage } from '@/shared/lib/error';

interface DeleteProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onDeleted?: () => void; // tambah callback opsional ini karena penambahan action delete di page detail (misal utk navigate ke list setelah delete success)
}

export function DeleteProductDialog({
  open,
  onOpenChange,
  product,
  onDeleted,
}: DeleteProductDialogProps) {
  const deleteProductMutation = useDeleteProduct();
  const isDeleting = deleteProductMutation.isPending;
  const { addToast } = useToast();

  const handleOpenChange = (nextOpen: boolean) => {
    if (isDeleting && !nextOpen) {
      return;
    }

    onOpenChange(nextOpen);
  };

  const handleConfirm = async () => {
    if (!product) { // guard untuk validasi saat dialog terbuka tanpa target produk.
      return;
    }

    try {
      await deleteProductMutation.mutateAsync(product.id);

      addToast({ // feedback sukses setelah API delete berhasil.
        type: 'success',
        title: 'Product Deleted Successfully',
        message: `"${product.name ?? 'Product'}" was deleted successfully.`,
        duration: 6000, // durasi lebih lama biar user sempat baca?
      }); 

      onDeleted?.(); // `?.()` berarti panggil callback kalau ada, kalau gaada skip tanpa error
      
      onOpenChange(false); // tutup dialog hanya jika mutate sukses
      
    } catch (error) {
      addToast({ // feedback gagal
        type: 'error',
        title: 'Failed to delete product',
        message: getErrorMessage(error, 'Please try again in a few moments.'),
        duration: 7000,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        size="sm"
        showClose={!isDeleting}
        className="mx-5 w-[calc(100%-2.5rem)] p-5 sm:mx-0 sm:w-full sm:p-6"
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-danger-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-danger-600" />
            </div>
            <DialogTitle>Delete Product</DialogTitle>
          </div>
          <DialogDescription>
            {product
              ? `Are you sure you want to delete "${product.name ?? 'this product'}"? This action cannot be undone.`
              : 'Select a product to delete.'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => handleOpenChange(false)}
            disabled={isDeleting}   // disabled saat proses delete berjalan utk mencegah double submit.
          >
            Cancel
          </Button>
          <Button
            variant="destructive-primary"
            onClick={() => {
              void handleConfirm();
            }}
            disabled={!product || isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Product'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
