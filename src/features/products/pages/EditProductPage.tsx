import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';
import { ErrorState } from '@/shared/ui/ErrorState';
import { ProductForm } from '../components/ProductForm';
import { useGetProductById } from '../api/hooks/useGetProductById';
import { type ProductInputValues } from '../types';

export default function EditProductPage() {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const { data: product } = useGetProductById(productId);

  if (!product) {
    return (
      <ErrorState
        variant="warning"
        title="Product not found"
        message="The product ID exists in route format, but no product data was found."
        actions={[
          {
            label: 'Back to Products',
            variant: 'primary',
            onClick: () => navigate('/products', { replace: true }),
          },
        ]}
      />
    );
  }

  const detailPath = `/products/detail/${productId}`;

  const handleBack = () => {
    void navigate(detailPath, { replace: true }); // replace agar cancel kembali ke detail tanpa menambah stack history baru.
  };

  const initialValues: Partial<ProductInputValues> = {
    name: product.name ?? '',
    price: product.price ?? 0,
    avatar: product.avatar ?? '',
    material: product.material ?? '',
    description: product.description ?? '',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-stretch justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Edit Product</h1>
          <p className="text-sm text-neutral-600">Update product details</p>
        </div>
        <Button
          className="self-stretch h-auto min-h-[44px] px-4 text-sm"
          variant="secondary"
          onClick={handleBack}
        >
          Cancel
        </Button>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
        <ProductForm
          productId={productId}
          initialValues={initialValues}
          mode="edit"
          onSuccess={() => {
            void navigate(detailPath, { replace: true }); // replace agar setelah save, Back tidak kembali ke form edit.
          }}
        />
      </div>
    </div>
  );
}
