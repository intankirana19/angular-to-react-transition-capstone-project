import { FILTER_ALL_VALUE } from '@/shared/constants/filters';
import { useSelectDateRangeFilterState } from '@/shared/hooks/useSelectDateRangeFilterState';
import { type ProductListQuery } from '../types';

export const PRODUCT_MATERIAL_ALL_VALUE = FILTER_ALL_VALUE;

export function useProductFilterState() {
  const filterState = useSelectDateRangeFilterState({
    allValue: PRODUCT_MATERIAL_ALL_VALUE,
    selectQueryKey: 'material',
    fromQueryKey: 'createdFrom',
    toQueryKey: 'createdTo',
  }); // FILTER[1]: Inisialisasi engine filter shared dengan key khusus payload products

  return {
    materialFilter: filterState.selectFilter, // FILTER[6]: Material aktif untuk badge/summary/filter dialog
    setMaterialFilter: filterState.setSelectFilter, // FILTER[7]: Setter material saat user apply draft
    createdDateRange: filterState.dateRange, // FILTER[8]: Range aktif untuk query dan tampilan dialog
    setCreatedDateRange: filterState.setDateRange, // FILTER[9]: Setter range saat user apply draft
    hasMaterialFilter: filterState.hasSelectFilter, // FILTER[10]: Flag material filter aktif
    hasDateFilter: filterState.hasDateFilter, // FILTER[11]: Flag date filter aktif
    hasAnyFilter: filterState.hasAnyFilter, // FILTER[12]: Flag gabungan untuk empty state/summary UI
    activeStructuredFilterCount: filterState.activeStructuredFilterCount, // FILTER[13]: Jumlah filter aktif untuk badge tombol Filter
    queryFilter: filterState.queryPart as Pick<ProductListQuery, 'material' | 'createdFrom' | 'createdTo'>, // FILTER[14]: Potongan payload { material?, createdFrom?, createdTo? }
    clearFilters: filterState.clearFilters, // FILTER[15]: Reset semua filter terstruktur ke default
  };
}
