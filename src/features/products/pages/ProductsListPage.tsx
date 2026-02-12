import { Button } from '@/shared/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useGetProducts } from '../api/hooks/useGetProducts';
import { ProductsTable } from '../components/ProductsTable';

// refer user page dr skafold
export default function ProductsListPage() {
  const navigate = useNavigate();
  const { data: products, isLoading, error, refetch, isFetching } = useGetProducts();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-danger-50 p-4 text-danger-800">
        <p className="font-medium">Error loading products</p>
        <p className="text-sm mt-1">{error.message}</p>
        <div className="mt-4">
          <Button variant="secondary" onClick={() => void refetch()} disabled={isFetching}>
            {isFetching ? 'Retrying...' : 'Retry'}
          </Button>
        </div>
      </div>
    );
  }

  const hasProducts = products && products.length > 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Products</h1>
        <Button onClick={() => void navigate('/products/new')}>Add Product</Button>
      </div>

      {hasProducts ? (
        <ProductsTable
          products={products}
          onRowClick={(product) => {
            void navigate(`/products/${product.id}`);
          }}
          onEdit={(product) => {
            void navigate(`/products/edit/${product.id}`);
          }}
        />
      ) : (
        <div className="rounded-lg bg-white p-8 text-center text-neutral-500 shadow-sm border border-neutral-200">
          No products found
        </div>
      )}
    </div>
  );
}
