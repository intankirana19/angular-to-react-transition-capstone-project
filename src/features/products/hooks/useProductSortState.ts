import { useSortQueryState, type SortOption } from '@/shared/hooks/useSortQueryState';
import { type ProductListQuery, type ProductSortField, type ProductSortOrder } from '../types';

type SortOptionValue =
  | 'createdAt:desc'
  | 'createdAt:asc'
  | 'price:asc'
  | 'price:desc'
  | 'name:asc'
  | 'name:desc'
  | 'material:asc'
  | 'material:desc';

const SORT_OPTIONS: SortOption<SortOptionValue, ProductSortField, ProductSortOrder>[] = [
  { value: 'createdAt:desc', label: 'Newest First', sortBy: 'createdAt', sortOrder: 'desc' },
  { value: 'createdAt:asc', label: 'Oldest First', sortBy: 'createdAt', sortOrder: 'asc' },
  { value: 'price:asc', label: 'Price Low to High', sortBy: 'price', sortOrder: 'asc' },
  { value: 'price:desc', label: 'Price High to Low', sortBy: 'price', sortOrder: 'desc' },
  { value: 'name:asc', label: 'Name A-Z', sortBy: 'name', sortOrder: 'asc' },
  { value: 'name:desc', label: 'Name Z-A', sortBy: 'name', sortOrder: 'desc' },
  { value: 'material:asc', label: 'Material A-Z', sortBy: 'material', sortOrder: 'asc' },
  { value: 'material:desc', label: 'Material Z-A', sortBy: 'material', sortOrder: 'desc' },
];

export function useProductSortState() {
  const sortState = useSortQueryState({
    options: SORT_OPTIONS,
    defaultValue: 'createdAt:desc',
  }); // SORT[1]: Inisialisasi engine sort shared dengan opsi khusus products

  return {
    sortValue: sortState.sortValue, // SORT[4]: Value aktif untuk komponen Select "Sort by"
    sortOptions: sortState.sortOptions, // SORT[5]: Daftar opsi yang dirender di dropdown
    sortBy: sortState.queryPart.sortBy ?? 'createdAt', // SORT[6]: Field sort final, fallback default
    sortOrder: sortState.queryPart.sortOrder ?? 'desc', // SORT[7]: Arah sort final, fallback default
    querySort: sortState.queryPart as Pick<ProductListQuery, 'sortBy' | 'sortOrder'>, // SORT[8]: Potongan payload { sortBy, sortOrder }
    onSortValueChange: sortState.onSortValueChange, // SORT[9]: Handler saat user pilih opsi sort lain
  };
}
