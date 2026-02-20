import { useMemo, useState } from 'react';

type UseSearchQueryStateOptions<QueryKey extends string> = {
  queryKey: QueryKey; // SEARCH[0]: key payload yang dipakai untuk query search
  initialValue?: string; // SEARCH[0]: nilai awal input search
  minLength?: number; // SEARCH[0]: panjang minimal keyword agar search dianggap aktif
};

export function useSearchQueryState<QueryKey extends string>({
  queryKey,
  initialValue = '',
  minLength = 1,
}: UseSearchQueryStateOptions<QueryKey>) {
  const [searchQuery, setSearchQuery] = useState(initialValue); // SEARCH[2]: state mentah keyword dari input
  const trimmedSearch = searchQuery.trim();  // SEARCH[3]: normalisasi keyword sebelum dipakai ke payload. Tadinya pakai useMemo untuk konsistensi nilai turunan, tapi di sini tidak perlu karena trim() ringan dan cukup dihitung langsung tiap render.
  const canSearch = trimmedSearch.length >= minLength; // SEARCH[4]: flag apakah search aktif
  const queryPart = useMemo<Partial<Record<QueryKey, string>>>(() => {
    if (!canSearch) { // SEARCH[5]: jika keyword belum valid, jangan kirim potongan query search.
      return {};
    }

    // SEARCH[6]: query part dibentuk dari key yang dinamis, jadi type assertion dipakai supaya TypeScript tetap bisa infer tipenya dengan benar.
    return { [queryKey]: trimmedSearch } as Partial<Record<QueryKey, string>>;
  }, [canSearch, trimmedSearch, queryKey]);

  function clearSearch() { // SEARCH[7]: reset keyword ke kondisi default.
    setSearchQuery('');
  }

  return {
    searchQuery, // SEARCH[8]: value untuk binding input
    setSearchQuery, // SEARCH[9]: setter saat user mengetik
    trimmedSearch, // SEARCH[10]: keyword yang sudah dinormalisasi
    hasSearch: canSearch, // SEARCH[11]: status search aktif/tidak
    queryPart, // SEARCH[12]: potongan payload query search
    clearSearch, // SEARCH[13]: helper reset state search
  };
}
