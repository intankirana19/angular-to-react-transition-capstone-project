import { useParams } from 'react-router-dom';
import { Avatar } from '@/shared/ui/Avatar';
import { DEFAULT_PLACEHOLDER, formatCurrency, formatDate } from '@/shared/lib/formatters';
import { useGetProductById } from '../api/useGetProductById';

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();

  const { data: product } = useGetProductById(productId);

  const name = product?.name ?? DEFAULT_PLACEHOLDER;
  const material = product?.material ?? DEFAULT_PLACEHOLDER;
  const description = product?.description ?? DEFAULT_PLACEHOLDER;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">{name}</h1>
            <p className="text-sm text-neutral-600">Product details</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <div className="flex flex-col items-center text-center gap-4">
            <Avatar
              src={product?.avatar}
              alt={`${name} image`}
              fallbackText={name}
              placeholder={!product?.avatar}
              placeholderIcon="image"
              className="h-40 w-40 rounded-xl"
            />
            {/* <div>
              <div className="text-xs uppercase tracking-wide text-neutral-500">Product ID</div>
              <div className="text-sm font-medium text-neutral-900">{product.id}</div>
            </div> */}
          </div>

          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="text-xs uppercase tracking-wide text-neutral-500">Price</div>
                <div className="text-sm font-medium text-neutral-900">
                  {formatCurrency(product?.price)}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-neutral-500">Created</div>
                <div className="text-sm font-medium text-neutral-900">
                  {formatDate(product?.createdAt)}
                </div>
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
    </div>
  );
}
