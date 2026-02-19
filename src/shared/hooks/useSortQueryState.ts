import { useMemo, useState } from 'react';

export type SortOption<Value extends string, SortBy extends string, SortOrder extends string> = {
  value: Value; // SORT[0]: value opsi di kontrol SORT
  label: string; // label yang ditampilkan ke user
  sortBy: SortBy; // SORT[0]: field target di payload
  sortOrder: SortOrder; // SORT[0]: arah asc/desc
};

type UseSortQueryStateOptions<Value extends string, SortBy extends string, SortOrder extends string> = {
  options: SortOption<Value, SortBy, SortOrder>[]; // SORT[0]: daftar opsi untuk alur SORT
  defaultValue: Value; // SORT[0]: opsi default saat alur mulai
};

// SORT[1]: Hook reusable untuk alur SORT, pegang opsi aktif dan bentuk query part payload list API
export function useSortQueryState<Value extends string, SortBy extends string, SortOrder extends string>({
  options,
  defaultValue,
}: UseSortQueryStateOptions<Value, SortBy, SortOrder>) {
  const [sortValue, setSortValue] = useState<Value>(defaultValue); // SORT[2]: state opsi aktif

  const optionMap = useMemo(() => {
    return new Map(options.map((option) => [option.value, option])); // SORT[3]: map lookup cepat value -> detail opsi
  }, [options]);

  const selectedOption = optionMap.get(sortValue) ?? optionMap.get(defaultValue); // SORT[4]: fallback ke default kalau value tidak valid

  const queryPart = useMemo(() => {
    if (!selectedOption) {
      return {} as { sortBy?: SortBy; sortOrder?: SortOrder }; // SORT[5]: guard aman kalau opsi belum ada
    }

    return {
      sortBy: selectedOption.sortBy,
      sortOrder: selectedOption.sortOrder,
    }; // SORT[6]: bentuk query part final
  }, [selectedOption]);

  function onSortValueChange(value: string) {
    if (optionMap.has(value as Value)) {
      setSortValue(value as Value); // SORT[7]: update state hanya untuk opsi valid
    }
  }

  return {
    sortValue, // SORT[8]: value aktif untuk kontrol UI
    sortOptions: options, // SORT[9]: semua opsi untuk dirender
    queryPart, // SORT[10]: potongan payload dari alur SORT
    onSortValueChange, // SORT[11]: handler perubahan opsi dari UI
  };
}
