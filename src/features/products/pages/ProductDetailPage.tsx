import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';
import { Avatar } from '@/shared/ui/Avatar';
import { Button } from '@/shared/ui/Button';
import { DEFAULT_PLACEHOLDER, formatCurrency, formatDate } from '@/shared/lib/formatters';
import { useGetProductById } from '../api/hooks/useGetProductById';
import { DeleteProductDialog } from '../components/DeleteProductDialog';
import ProductEntityNotFoundPage from './ProductEntityNotFoundPage';

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { data: product } = useGetProductById(productId);

  if (!productId) {
    throw new Error('Product ID is required'); // sebelumnya error pakai UI lokal, sekarang dilempar ke ErrorBoundary untuk standarisai.
  }
  if (!product) {
    return <ProductEntityNotFoundPage />;
  }

  const name = product.name ?? DEFAULT_PLACEHOLDER;
  const material = product.material ?? DEFAULT_PLACEHOLDER;
  const description = product.description ?? DEFAULT_PLACEHOLDER;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <ArrowLeft className="cursor-pointer" onClick={() => void navigate(-1)} />
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">{name}</h1>
            <p className="text-sm text-neutral-600">Product details</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              void navigate(`/products/edit/${productId}`, { replace: true }); // replace history entry supaya alur edit tidak numpuk detail lama di tombol Back.
            }}
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive-secondary"
            onClick={() => {
              setDeleteDialogOpen(true);
            }}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <div className="flex flex-col items-center text-center gap-4">
            <Avatar
              src={product.avatar}
              alt={`${name} image`}
              fallbackText={name}
              placeholder={!product.avatar}
              placeholderIcon="image"
              className="h-40 w-40 rounded-xl"
            />
          </div>

          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="text-xs uppercase tracking-wide text-neutral-500">Price</div>
                <div className="text-sm font-medium text-neutral-900">{formatCurrency(product.price)}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-neutral-500">Created</div>
                <div className="text-sm font-medium text-neutral-900">{formatDate(product.createdAt)}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-neutral-500">Material</div>
                <div className="text-sm font-medium text-neutral-900">{material}</div>
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-1">Description</div>
              <div className="text-sm text-neutral-900">{description}</div>
            </div>
          </div>
        </div>
      </div>

      <DeleteProductDialog
        open={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDeleted={() => {
          void navigate('/products');
        }}
        product={product}
      />
    </div>
  );
}
