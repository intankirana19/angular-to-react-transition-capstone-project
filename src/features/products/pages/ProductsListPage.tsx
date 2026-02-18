import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';
import { Button } from '@/shared/ui/Button';
import { useGetProducts } from '../api/hooks/useGetProducts';
import { DeleteProductDialog } from '../components/DeleteProductDialog';
import { ProductFormDialog } from '../components/ProductFormDialog';
import { ProductsTable } from '../components/ProductsTable';

// refer user page dr skafold
export default function ProductsListPage() {
  const PAGE_SIZE = 10; // INFINITE[1]: Sekali nambah, ambil 10 item
  const navigate = useNavigate();

  // loading + error dihandle suspense + ErrorBoundary di level app/layout
  const { data: products } = useGetProducts();

  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [page, setPage] = useState(1); // INFINITE[2]: Penanda sudah buka batch ke berapa

  const editingProduct = useMemo(
    () => products?.find((product) => product.id === editingProductId),
    [products, editingProductId]
  );
  const deletingProduct = useMemo(
    () => products?.find((product) => product.id === deletingProductId) ?? null,
    [deletingProductId, products]
  );

  const hasProducts = products.length > 0;
  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const hasMore = page < totalPages;
  const visibleProducts = useMemo(
    () => products.slice(0, page * PAGE_SIZE),
    [products, page, PAGE_SIZE]
  ); // INFINITE[3]: Yang ditampilin sekarang cuma sampai batas page ini

  useEffect(() => {
    setPage(1);
  }, [products.length]); // INFINITE[4]: Kalau datanya berubah, mulai lagi dari batch pertama

  useInfiniteScroll({
    enabled: hasProducts && hasMore,
    hasMore,
    scrollContainerId: 'app-main-scroll',
    threshold: 200,
    debounceMs: 300,
    onLoadMore: () => {
      setPage((prevPage) => Math.min(prevPage + 1, totalPages)); // INFINITE[13]: Kalau diminta load lagi, page naik 1
    },
  }); // INFINITE[5]: Halaman ini konfigurasi ke hook infinite scroll

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
          products={visibleProducts}
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
