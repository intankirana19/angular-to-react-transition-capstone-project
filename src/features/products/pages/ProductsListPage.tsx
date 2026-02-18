import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';
import { useGetProducts } from '../api/hooks/useGetProducts';
import { DeleteProductDialog } from '../components/DeleteProductDialog';
import { ProductFormDialog } from '../components/ProductFormDialog';
import { ProductsTable } from '../components/ProductsTable';
import { getErrorMessage } from '@/shared/lib/error';
import { ErrorState } from '@/shared/ui/ErrorState';

// refer user page dr skafold
export default function ProductsListPage() {
  const navigate = useNavigate();
  const { data: products, error, refetch, isFetching } = useGetProducts();
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  const editingProduct = useMemo(
    () => products?.find((product) => product.id === editingProductId),
    [products, editingProductId]
  );
  const deletingProduct = useMemo(
    () => products?.find((product) => product.id === deletingProductId) ?? null,
    [deletingProductId, products]
  );

  if (error) {
    return (
      <ErrorState
        title="Error loading products"
        message={getErrorMessage(error)}
        actions={[
          {
            label: isFetching ? 'Retrying...' : 'Retry',
            onClick: () => refetch(),
            disabled: isFetching,
          },
        ]}
      />
    );
  }

  const hasProducts = products && products.length > 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Products</h1>
        <Button
          onClick={() => {
            void navigate('/products/new');
            // setCreateDialogOpen(true);
          }}
        >
          Add Product
        </Button>
      </div>

      {hasProducts ? (
        <ProductsTable
          products={products}
          onRowClick={(product) => {
            void navigate(`/products/${product.id}`);
          }}
          onEdit={(product) => {
            setEditingProductId(product.id);
            // void navigate(`/products/edit/${product.id}`);
          }}
          onDelete={(product) => {
            setDeletingProductId(product.id);
          }}
        />
      ) : (
        <div className="rounded-lg bg-white p-8 text-center text-neutral-500 shadow-sm border border-neutral-200">
          No products found
        </div>
      )}

      <ProductFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setCreateDialogOpen}
        mode="create"
      />

      <ProductFormDialog
        open={Boolean(editingProductId)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingProductId(null);
          }
        }}
        mode="edit"
        product={editingProduct}
      />

      <DeleteProductDialog
        open={Boolean(deletingProductId)}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingProductId(null);
          }
        }}
        product={deletingProduct}
      />
    </div>
  );
}
