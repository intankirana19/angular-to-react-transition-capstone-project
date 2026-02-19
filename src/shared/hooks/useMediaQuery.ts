import { useEffect, useState } from 'react';

export function useMediaQuery(query: string, defaultValue = false) {
  // simpan status cocok tidaknya query terhadap viewport saat ini
  const [matches, setMatches] = useState(defaultValue);

  // pasang listener media query biar nilai otomatis update saat ukuran layar berubah
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    // update state saat hasil query berubah
    const onChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // sync nilai awal waktu hook pertama jalan
    setMatches(mediaQuery.matches);
    mediaQuery.addEventListener('change', onChange);

    // cleanup listener saat unmount atau query berubah
    return () => {
      mediaQuery.removeEventListener('change', onChange);
    };
  }, [query]);

  // expose hasil akhir ke komponen pemakai
  return matches;
}
