import { useSearchQueryState } from '@/shared/hooks/useSearchQueryState';
import { type ProductListQuery } from '../types';

export function useProductSearchState() {
  const searchState = useSearchQueryState({
    queryKey: 'search',
  }); // SEARCH[1]: Inisialisasi engine search shared dengan key payload "search"

  return {
    searchQuery: searchState.searchQuery, // SEARCH[4]: Nilai untuk Input search toolbar
    setSearchQuery: searchState.setSearchQuery, // SEARCH[5]: Setter yang dipanggil saat user ngetik
    clearSearch: searchState.clearSearch, // SEARCH[6]: Reset keyword ke kosong saat clear filters
    hasSearch: searchState.hasSearch, // SEARCH[7]: Flag ada keyword aktif atau tidak
    querySearch: searchState.queryPart as Pick<ProductListQuery, 'search'>, // SEARCH[8]: Potongan payload { search } atau {}
  };
}
