import { useMemo, useState } from 'react';
import { type DateRangeValue } from '@/shared/types/dateRange';

type UseSelectDateRangeFilterStateOptions<
  SelectKey extends string,
  FromKey extends string,
  ToKey extends string,
> = {
  allValue: string; // FILTER[0]: nilai default untuk kondisi belum aktif
  selectQueryKey: SelectKey; // FILTER[0]: key payload untuk select value
  fromQueryKey: FromKey; // FILTER[0]: key payload untuk batas tanggal awal
  toQueryKey: ToKey; // FILTER[0]: key payload untuk batas tanggal akhir
  initialSelectValue?: string; // FILTER[0]: nilai awal select filter
};

// FILTER[1]: Hook reusable untuk alur FILTER, gabung select filter + date range jadi 1 query part payload
export function useSelectDateRangeFilterState<
  SelectKey extends string,
  FromKey extends string,
  ToKey extends string,
>({
  allValue,
  selectQueryKey,
  fromQueryKey,
  toQueryKey,
  initialSelectValue,
}: UseSelectDateRangeFilterStateOptions<SelectKey, FromKey, ToKey>) {
  const [selectFilter, setSelectFilter] = useState(initialSelectValue ?? allValue); // FILTER[2]: state select filter aktif
  const [dateRange, setDateRange] = useState<DateRangeValue | undefined>(undefined); // FILTER[3]: state date range filter aktif

  const hasSelectFilter = selectFilter !== allValue; // FILTER[4]: flag select filter aktif
  const hasDateFilter = Boolean(dateRange?.from || dateRange?.to); // FILTER[5]: flag date filter aktif
  const activeStructuredFilterCount = Number(hasSelectFilter) + Number(hasDateFilter); // FILTER[6]: jumlah filter aktif untuk badge/summary

  const queryPart = useMemo<
    Partial<Record<SelectKey | FromKey | ToKey, string>>
  >(() => {
    const payload: Partial<Record<SelectKey | FromKey | ToKey, string>> = {};

    if (hasSelectFilter) {
      payload[selectQueryKey] = selectFilter; // FILTER[7]: kirim select filter hanya kalau aktif
    }

    if (dateRange?.from) {
      payload[fromQueryKey] = dateRange.from.toISOString(); // FILTER[8]: kirim batas bawah tanggal
    }

    if (dateRange?.to) {
      payload[toQueryKey] = dateRange.to.toISOString(); // FILTER[9]: kirim batas atas tanggal
    }

    return payload; // FILTER[10]: hasil final query part
  }, [dateRange, fromQueryKey, hasSelectFilter, selectFilter, selectQueryKey, toQueryKey]);

  function clearFilters() {
    setSelectFilter(allValue); // FILTER[11]: reset select filter ke default
    setDateRange(undefined); // FILTER[12]: reset date range filter
  }

  return {
    selectFilter, // FILTER[13]: value select filter aktif
    setSelectFilter, // FILTER[14]: setter select filter
    dateRange, // FILTER[15]: value date range aktif
    setDateRange, // FILTER[16]: setter date range
    hasSelectFilter, // FILTER[17]: status select filter
    hasDateFilter, // FILTER[18]: status date filter
    hasAnyFilter: hasSelectFilter || hasDateFilter, // FILTER[19]: status gabungan filter aktif
    activeStructuredFilterCount, // FILTER[20]: jumlah filter aktif
    queryPart, // FILTER[21]: potongan payload dari alur filter
    clearFilters, // FILTER[22]: reset semua filter
  };
}
