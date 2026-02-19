import { useMemo, useState } from 'react';

type UseSearchQueryStateOptions<QueryKey extends string> = {
  queryKey: QueryKey; // SEARCH[0]: key payload yang dipakai di alur SEARCH pada list page
  initialValue?: string; // SEARCH[0]: nilai awal input SEARCH
  minLength?: number; // SEARCH[0]: panjang minimal keyword sebelum dianggap aktif
};

// SEARCH[1]: Hook reusable untuk alur SEARCH, pegang keyword dan bentuk query part payload list API
export function useSearchQueryState<QueryKey extends string>({
  queryKey,
  initialValue = '',
  minLength = 1,
}: UseSearchQueryStateOptions<QueryKey>) {
  const [searchQuery, setSearchQuery] = useState(initialValue); // SEARCH[2]: state mentah keyword dari input
  const trimmedSearch = useMemo(() => searchQuery.trim(), [searchQuery]); // SEARCH[3]: normalisasi keyword sebelum dipakai ke payload
  const canSearch = trimmedSearch.length >= minLength;
  const queryPart = useMemo<Partial<Record<QueryKey, string>>>(() => {
    if (!canSearch) {
      return {}; // SEARCH[4]: kalau keyword kosong, jangan kirim query part
    }

    return { [queryKey]: trimmedSearch } as Partial<Record<QueryKey, string>>; // SEARCH[5]: bentuk query part sesuai key yang dikonfigurasi
  }, [canSearch, trimmedSearch, queryKey]);

  function clearSearch() {
    setSearchQuery(''); // SEARCH[6]: reset state ke default
  }

  return {
    searchQuery, // SEARCH[7]: value untuk binding input
    setSearchQuery, // SEARCH[8]: setter saat user mengetik
    trimmedSearch, // SEARCH[9]: keyword yang sudah dinormalisasi
    hasSearch: canSearch, // SEARCH[10]: flag alur SEARCH aktif/tidak
    queryPart, // SEARCH[11]: potongan payload dari alur SEARCH
    clearSearch, // SEARCH[12]: helper reset
  };
}
