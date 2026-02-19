import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';
import { ProductForm } from '../components/ProductForm';

export default function CreateProductPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      void navigate(-1);
      return;
    }
    void navigate('/products');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-stretch justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">New Product</h1>
          <p className="text-sm text-neutral-600">Fill the form to add a product</p>
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
          mode="create"
          onSuccess={() => {
            void navigate('/products');
          }}
        />
      </div>
    </div>
  );
}
