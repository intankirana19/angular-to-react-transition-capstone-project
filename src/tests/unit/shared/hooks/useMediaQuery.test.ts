import { act, renderHook } from '@testing-library/react';
import { useMediaQuery } from '@/shared/hooks/useMediaQuery';

type ChangeListener = (event: MediaQueryListEvent) => void;

// controller kecil buat pegang hasil mock dan bantu trigger perubahan viewport
type MatchMediaController = {
  setMatches: (next: boolean) => void;
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
  getRegisteredListener: () => ChangeListener | undefined;
};

// mock matchMedia biar hook bisa dites tanpa browser viewport beneran
function mockMatchMedia(initialMatches: boolean): MatchMediaController {
  let matches = initialMatches;
  let changeListener: ChangeListener | undefined;

  const addEventListener = vi.fn((_type: string, listener: ChangeListener) => {
    // simpan listener yang didaftarkan hook
    changeListener = listener;
  });
  const removeEventListener = vi.fn((_type: string, listener: ChangeListener) => {
    // kosongin lagi saat hook cleanup
    if (changeListener === listener) {
      changeListener = undefined;
    }
  });

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn(() => ({
      matches,
      media: '(min-width: 768px)',
      onchange: null,
      addEventListener,
      removeEventListener,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  return {
    addEventListener,
    removeEventListener,
    getRegisteredListener() {
      return changeListener;
    },
    setMatches(next: boolean) {
      // ubah hasil query lalu tembak listener change seperti browser asli
      matches = next;

      if (changeListener) {
        // simpan ke konstanta lokal biar typescript tahu listener ini pasti ada di dalam callback act
        const listener = changeListener;

        act(() => {
          listener({ matches: next } as MediaQueryListEvent);
        });
      }
    },
  };
}

describe('useMediaQuery', () => {
  it('syncs the initial value from matchMedia on mount', () => {
    // nilai awal harus ngikut hasil query browser bukan default fallback
    mockMatchMedia(true);

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)', false));

    expect(result.current).toBe(true);
  });

  it('updates when the media query change event fires', () => {
    // hook harus reaktif saat viewport berubah
    const mediaQuery = mockMatchMedia(false);

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)', false));

    expect(result.current).toBe(false);

    mediaQuery.setMatches(true);

    expect(result.current).toBe(true);
  });

  it('removes the change listener on unmount', () => {
    // cleanup listener penting supaya tidak bocor antar mount
    const mediaQuery = mockMatchMedia(false);

    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)', false));

    expect(mediaQuery.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));

    const registeredListener = mediaQuery.getRegisteredListener();

    unmount();

    // listener yang sama harus dilepas lagi saat unmount
    expect(mediaQuery.removeEventListener).toHaveBeenCalledWith('change', registeredListener);
  });
});
