import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/Dialog';
import { type Product, type ProductInputValues } from '../types';
import { ProductForm } from './ProductForm';

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  product?: Product;
}

function getInitialValues(product?: Product): ProductInputValues | undefined {
  if (!product) {
    return undefined;
  }

  return {
    name: product.name ?? '',
    price: product.price ?? 0,
    avatar: product.avatar ?? '',
    material: product.material ?? '',
    description: product.description ?? '',
  };
}

export function ProductFormDialog({ open, onOpenChange, mode, product }: ProductFormDialogProps) {
  const isEdit = mode === 'edit';
  const title = isEdit ? 'Edit Product' : 'Add Product';
  const description = isEdit ? 'Update product details.' : 'Fill the form to add a new product.';
  const initialValues = getInitialValues(product);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogBody>
          {isEdit && !product ? (
            <p className="text-sm text-neutral-600">Product not found.</p>
          ) : (
            <ProductForm
              productId={product?.id}
              initialValues={initialValues}
              mode={mode}
              onSuccess={() => {
                onOpenChange(false);
              }}
            />
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
