import { useFilterDialogDraftState } from '@/shared/hooks/useFilterDialogDraftState';
import { type DateRangeValue } from '@/shared/types/dateRange'; // FILTER[0]: pakai tipe date range global agar konsisten lintas fitur
import { PRODUCT_MATERIAL_ALL_VALUE } from './useProductFilterState';

type ProductFilterDialogControls = {
  materialFilter: string;
  createdDateRange: DateRangeValue | undefined;
  setMaterialFilter: (value: string) => void;
  setCreatedDateRange: (value: DateRangeValue | undefined) => void;
};

// FILTER[6]: Hook ini khusus buat alur draft dialog filter (open/apply/clear) di products page
export function useProductFilterDialogState({
  materialFilter,
  createdDateRange,
  setMaterialFilter,
  setCreatedDateRange,
}: ProductFilterDialogControls) {
  const dialogState = useFilterDialogDraftState({
    allValue: PRODUCT_MATERIAL_ALL_VALUE,
    baseSelectValue: materialFilter,
    baseDateRange: createdDateRange,
    onApplySelectValue: setMaterialFilter,
    onApplyDateRange: setCreatedDateRange,
  }); // FILTER[7]: Pakai engine draft shared, hook ini tinggal mapping nama state ke kebutuhan products

  return {
    isFilterDialogOpen: dialogState.isDialogOpen, // FILTER[11]: State buka/tutup dialog filter
    onFilterDialogOpenChange: dialogState.onDialogOpenChange, // FILTER[12]: Handler open change, sekaligus sync draft saat dibuka
    draftMaterialFilter: dialogState.draftSelectValue, // FILTER[13]: Nilai draft material sebelum apply
    setDraftMaterialFilter: dialogState.setDraftSelectValue, // FILTER[14]: Setter draft material di dalam dialog
    draftDateRange: dialogState.draftDateRange, // FILTER[15]: Nilai draft date range sebelum apply
    setDraftDateRange: dialogState.setDraftDateRange, // FILTER[16]: Setter draft date range di dalam dialog
    applyFilterDraft: dialogState.applyDraft, // FILTER[17]: Commit draft ke filter aktif lalu close dialog
    clearDraftFilters: dialogState.clearDraft, // FILTER[18]: Reset draft tanpa mengubah filter aktif
  };
}
