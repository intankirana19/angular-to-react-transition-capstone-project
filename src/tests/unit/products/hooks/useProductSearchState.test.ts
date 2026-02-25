import { act, renderHook } from '@testing-library/react';
import { useProductSearchState } from '@/features/products/hooks/useProductSearchState';

describe('useProductSearchState', () => {
  it('builds trimmed search query payload and clears state', () => {
    const { result } = renderHook(() => useProductSearchState()); // awal hook harus kosong dulu

    expect(result.current.searchQuery).toBe('');
    expect(result.current.hasSearch).toBe(false);
    expect(result.current.querySearch).toEqual({});

    act(() => {
      result.current.setSearchQuery('  chair  ');
    }); // misal user ngetik keyword pakai spasi di depan belakang

    expect(result.current.searchQuery).toBe('  chair  ');
    expect(result.current.hasSearch).toBe(true);
    expect(result.current.querySearch).toEqual({ search: 'chair' });

    act(() => {
      result.current.clearSearch();
    }); // misal user klik clear search

    expect(result.current.searchQuery).toBe('');
    expect(result.current.hasSearch).toBe(false);
    expect(result.current.querySearch).toEqual({});
  });

  it('does not create query payload when input is only whitespace', () => {
    const { result } = renderHook(() => useProductSearchState());

    act(() => {
      result.current.setSearchQuery('   ');
    }); // misal user isi cuma spasi

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

    act(() => {
      result.current.setSearchQuery('sofa');
    }); // misal user ganti keyword ke yang baru

    expect(result.current.hasSearch).toBe(true);
    expect(result.current.querySearch).toEqual({ search: 'sofa' });
  });
});
