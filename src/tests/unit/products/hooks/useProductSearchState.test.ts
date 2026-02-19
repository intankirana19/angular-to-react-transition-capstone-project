import { act, renderHook } from '@testing-library/react';
import { useProductSearchState } from '@/features/products/hooks/useProductSearchState';

describe('useProductSearchState', () => {
  it('builds trimmed search query payload and clears state', () => {
    // awal hook harus kosong dulu
    const { result } = renderHook(() => useProductSearchState());

    expect(result.current.searchQuery).toBe('');
    expect(result.current.hasSearch).toBe(false);
    expect(result.current.querySearch).toEqual({});

    // misal user ngetik keyword pakai spasi di depan belakang
    act(() => {
      result.current.setSearchQuery('  chair  ');
    });

    // value mentah tetap tapi payload query harus udah di-trim
    expect(result.current.searchQuery).toBe('  chair  ');
    expect(result.current.hasSearch).toBe(true);
    expect(result.current.querySearch).toEqual({ search: 'chair' });

    // misal user klik clear search
    act(() => {
      result.current.clearSearch();
    });

    // state dan query harus balik kosong lagi
    expect(result.current.searchQuery).toBe('');
    expect(result.current.hasSearch).toBe(false);
    expect(result.current.querySearch).toEqual({});
  });

  it('does not create query payload when input is only whitespace', () => {
    const { result } = renderHook(() => useProductSearchState());

    // misal user isi cuma spasi
    act(() => {
      result.current.setSearchQuery('   ');
    });

    // harus dianggap kosong setelah trim
    expect(result.current.searchQuery).toBe('   ');
    expect(result.current.hasSearch).toBe(false);
    expect(result.current.querySearch).toEqual({});
  });

  it('updates payload when keyword changes', () => {
    const { result } = renderHook(() => useProductSearchState());

    act(() => {
      result.current.setSearchQuery('table');
    });
    expect(result.current.querySearch).toEqual({ search: 'table' });

    // misal user ganti keyword ke yang baru
    act(() => {
      result.current.setSearchQuery('sofa');
    });

    // payload harus selalu ikut keyword terbaru
    expect(result.current.hasSearch).toBe(true);
    expect(result.current.querySearch).toEqual({ search: 'sofa' });
  });
});
