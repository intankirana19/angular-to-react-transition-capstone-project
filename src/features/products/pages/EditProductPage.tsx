import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';
import { ProductForm } from '../components/ProductForm';
import { useGetProductById } from '../api/hooks/useGetProductById';
import { type ProductInputValues } from '../types';

export default function EditProductPage() {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();

  if (!productId) {
    throw new Error('Product ID is required');
  }

  const { data: product } = useGetProductById(productId);

  const handleBack = () => {
    if (window.history.length > 1) {
      void navigate(-1);
      return;
    }
    void navigate('/products');
  };

  const initialValues: Partial<ProductInputValues> = {
    name: product?.name ?? '',
    price: product?.price ?? 0,
    avatar: product?.avatar ?? '',
    material: product?.material ?? '',
    description: product?.description ?? '',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Edit Product</h1>
          <p className="text-sm text-neutral-600">Update product details</p>
        </div>
        <Button variant="secondary" onClick={handleBack}>
          Cancel
        </Button>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm border border-neutral-200">
        <ProductForm
          productId={productId}
          initialValues={initialValues}
          mode="edit"
          onSuccess={() => {
            void navigate('/products');
          }}
        />
      </div>
    </div>
  );
}
