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
import { useDeleteProduct } from '../api/hooks/useDeleteProduct';
import { type Product } from '../types';

interface DeleteProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export function DeleteProductDialog({ open, onOpenChange, product }: DeleteProductDialogProps) {
  const deleteProductMutation = useDeleteProduct();

  const handleConfirm = async () => {
    if (!product) { // guard untuk validasi saat dialog terbuka tanpa target produk.
      return;
    }

    await deleteProductMutation.mutateAsync(product.id);

    onOpenChange(false); // tutup dialog hanya jika mutate sukses
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
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
            onClick={() => onOpenChange(false)}
            disabled={deleteProductMutation.isPending}   // disabled saat proses delete berjalan utk mencegah double submit.
          >
            Cancel
          </Button>
          <Button
            variant="destructive-primary"
            onClick={() => {
              void handleConfirm();
            }}
            disabled={!product || deleteProductMutation.isPending}
          >
            {deleteProductMutation.isPending ? 'Deleting...' : 'Delete Product'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
