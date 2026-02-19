import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpDown, Search, SlidersVertical } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { DateRangePicker } from '@/shared/ui/DatePicker';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/Dialog';
import { Input } from '@/shared/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/shared/ui/Select';
import { SimpleSelect } from '@/shared/ui/SimpleSelect';
import { useGetProducts } from '../api/hooks/useGetProducts';
import { DeleteProductDialog } from '../components/DeleteProductDialog';
import { ProductFormDialog } from '../components/ProductFormDialog';
import { ProductsTable } from '../components/ProductsTable';
import { useProductFilterDialogState } from '../hooks/useProductFilterDialogState';
import { useProductFilterState } from '../hooks/useProductFilterState';
import { useProductInfiniteList } from '../hooks/useProductInfiniteList';
import { useProductMaterialOptions } from '../hooks/useProductMaterialOptions';
import { useProductSearchState } from '../hooks/useProductSearchState';
import { useProductSortState } from '../hooks/useProductSortState';
import { type ProductListQuery } from '../types';

// refer user page dr skafold
export default function ProductsListPage() {
  const navigate = useNavigate();

  const searchState = useProductSearchState(); // SEARCH[2]: Hook search pegang state + query part search
  const filterState = useProductFilterState(); // FILTER[5]: Hook filter pegang state + query part filter
  const sortState = useProductSortState(); // SORT[3]: Hook sort pegang state + query part sort
  const dialogState = useProductFilterDialogState({
    materialFilter: filterState.materialFilter,
    createdDateRange: filterState.createdDateRange,
    setMaterialFilter: filterState.setMaterialFilter,
    setCreatedDateRange: filterState.setCreatedDateRange,
  }); // FILTER[6]: Draft dialog filter dipisah biar aman sebelum apply

  const queryPayload = useMemo<ProductListQuery>(
    () => ({
      ...sortState.querySort,
      ...searchState.querySearch,
      ...filterState.queryFilter,
    }),
    [sortState.querySort, searchState.querySearch, filterState.queryFilter]
  ); // SEARCH[4]: Payload akhir digabung dari query part search/filter/sort

  // loading + error dihandle suspense + ErrorBoundary di level app/layout
  const { data: products } = useGetProducts(queryPayload); // SEARCH[5]: Payload diteruskan ke hook query list
  const materialOptions = useProductMaterialOptions(products); // FILTER[28]: Material options dibentuk dari data products yang lagi aktif

  const { hasProducts, visibleProducts } = useProductInfiniteList(products, queryPayload);

  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const editingProduct = useMemo(
    () => products.find((product) => product.id === editingProductId),
    [products, editingProductId]
  );
  const deletingProduct = useMemo(
    () => products.find((product) => product.id === deletingProductId) ?? null,
    [products, deletingProductId]
  );

  const hasActiveFilters = searchState.hasSearch || filterState.hasAnyFilter;
  const activeStructuredFilterCount = filterState.activeStructuredFilterCount;

  function clearAllFilters() {
    searchState.clearSearch();
    filterState.clearFilters();
  } // FILTER[9]: Reset search + filter aktif

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Products</h1>
        <Button
          onClick={() => {
            void navigate('/products/new');
          }}
        >
          Add Product
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-4 mb-6 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* SEARCH[1]: user input keyword, nanti payload kebentuk dari state search/filter/sort */}
          <Input
            value={searchState.searchQuery}
            onChange={(event) => {
              searchState.setSearchQuery(event.target.value);
            }}
            placeholder="Search products (min. 3 chars)..."
            leading={<Search />}
            containerClassName="border-neutral-300 bg-neutral-50 shadow-md ring-1 ring-neutral-200/70"
            inputClassName="text-sm font-medium text-neutral-900 placeholder:text-neutral-500"
            className="w-full lg:max-w-sm"
          />

          <div className="flex items-center gap-2">
            {/* FILTER[1]: Tombol buat buka dialog filter material + tanggal, jadi toolbar tetap rapi */}
            <Button
              type="button"
              variant="secondary"
              onClick={() => dialogState.onFilterDialogOpenChange(true)}
              className="border-neutral-300 bg-neutral-50 text-neutral-800 shadow-md ring-1 ring-neutral-200/70 hover:bg-neutral-100 active:bg-neutral-200"
            >
              <SlidersVertical className="w-4 h-4" />
              Filter
              {activeStructuredFilterCount > 0 && (
                <span className="ml-1 min-w-5 h-5 px-1 rounded-full bg-primary-500 text-white text-xs font-semibold">
                  {activeStructuredFilterCount}
                </span>
              )}
            </Button>

            {/* SORT[1]: Sort dropdown di toolbar, label tetap "Sort by" biar konsisten sama list team */}
            <Select value={sortState.sortValue} onValueChange={sortState.onSortValueChange}>
              <SelectTrigger
                size="sm"
                showIcon={false}
                className="h-10 w-auto min-w-0 !justify-start gap-2 border-neutral-300 bg-neutral-50 px-4 text-sm font-semibold text-neutral-800 shadow-md ring-1 ring-neutral-200/70 hover:bg-neutral-100 active:bg-neutral-200"
              >
                <ArrowUpDown className="w-4 h-4 opacity-80" />
                <span>Sort by</span>
              </SelectTrigger>
              <SelectContent align="end" className="min-w-[180px]">
                {sortState.sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between px-4 py-3 mt-4 bg-primary-50 rounded-lg border border-primary-200">
            <p className="text-sm text-neutral-700">
              <span className="font-semibold text-primary-600">{products.length}</span> products found
            </p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      <Dialog open={dialogState.isFilterDialogOpen} onOpenChange={dialogState.onFilterDialogOpenChange}>
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>Filter Products</DialogTitle>
            <DialogDescription>Set material and created date range filters.</DialogDescription>
          </DialogHeader>

          <DialogBody className="space-y-4">
            {/* FILTER[2]: Pilihan material ini masih draft, baru kepakai pas klik Apply Filters */}
            <SimpleSelect
              value={dialogState.draftMaterialFilter}
              onChange={dialogState.setDraftMaterialFilter}
              options={materialOptions}
              placeholder="Material"
              className="w-full"
            />

            {/* FILTER[3]: Satu date-range picker untuk isi tanggal from/to sekaligus */}
            <DateRangePicker
              dateRange={dialogState.draftDateRange}
              onDateRangeChange={dialogState.setDraftDateRange}
              placeholder="Created date range"
              monthsToShow={1}
              className="w-full"
            />
          </DialogBody>

          <DialogFooter className="sm:justify-between sm:space-x-0">
            <Button type="button" variant="text" onClick={dialogState.clearDraftFilters}>
              Clear
            </Button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  dialogState.onFilterDialogOpenChange(false);
                }}
              >
                Cancel
              </Button>
              <Button type="button" onClick={dialogState.applyFilterDraft}>
                Apply Filters
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {hasProducts ? (
        <ProductsTable
          products={visibleProducts}
          onRowClick={(product) => {
            void navigate(`/products/detail/${product.id}`);
          }}
          onEdit={(product) => {
            setEditingProductId(product.id);
          }}
          onDelete={(product) => {
            setDeletingProductId(product.id);
          }}
        />
      ) : (
        <div className="rounded-lg bg-white p-8 text-center text-neutral-500 shadow-sm border border-neutral-200">
          {hasActiveFilters ? 'No products match current filters' : 'No products found'}
        </div>
      )}

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
