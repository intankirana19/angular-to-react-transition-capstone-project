import { act, renderHook } from '@testing-library/react';
import { useDebounce } from '@/shared/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    // fake timer dipakai biar debounce bisa dites tanpa nunggu waktu nyata
    vi.useFakeTimers();
  });

  afterEach(() => {
    // timer asli dibalikin lagi supaya test lain ga ikut pakai clock virtual
    vi.useRealTimers();
  });

  it('keeps the previous value until the delay has passed', () => {
    // kontrak debounce: update tidak langsung keluar di tick pertama
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'chair', delay: 300 } }
    );

    expect(result.current).toBe('chair');

    rerender({ value: 'table', delay: 300 });

    expect(result.current).toBe('chair');

    act(() => {
      vi.advanceTimersByTime(299);
    });

    expect(result.current).toBe('chair');

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(result.current).toBe('table');
  });

  it('only applies the latest value when updates happen quickly', () => {
    // debounce harus membatalkan timer lama dan commit value terakhir saja
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'a', delay: 200 } }
    );

    rerender({ value: 'ab', delay: 200 });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: 'abc', delay: 200 });

    act(() => {
      vi.advanceTimersByTime(199);
    });

    expect(result.current).toBe('a');

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(result.current).toBe('abc');
  });
});
