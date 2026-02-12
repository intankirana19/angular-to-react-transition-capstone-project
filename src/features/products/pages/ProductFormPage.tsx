import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';
import { ProductForm } from '../components/ProductForm';
import { useGetProductById } from '../api/hooks/useGetProductById';

export default function ProductFormPage() {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId?: string }>();
  const isEdit = Boolean(productId);
  const { data: product } = useGetProductById(productId);

  const handleBack = () => {
    if (window.history.length > 1) {
      void navigate(-1);
      return;
    }
    void navigate('/products');
  };

  const initialValues = isEdit
    ? {
        name: product?.name ?? '',
        price: product?.price ?? 0,
        avatar: product?.avatar ?? '',
        material: product?.material ?? '',
        description: product?.description ?? '',
      }
    : undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            {isEdit ? 'Edit Product' : 'New Product'}
          </h1>
          <p className="text-sm text-neutral-600">
            {isEdit ? 'Update product details' : 'Fill the form to add a product'}
          </p>
        </div>
        <Button variant="secondary" onClick={handleBack}>
          Cancel
        </Button>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm border border-neutral-200">
        <ProductForm
          initialValues={initialValues}
          mode={isEdit ? 'edit' : 'create'}
          onSuccess={() => {
            void navigate('/products');
          }}
        />
      </div>
    </div>
  );
}
