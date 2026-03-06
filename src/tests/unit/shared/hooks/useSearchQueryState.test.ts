import { act, renderHook } from '@testing-library/react';
import { useSearchQueryState } from '@/shared/hooks/useSearchQueryState';

describe('useSearchQueryState', () => {
  it('returns empty query part when trimmed input is below minLength', () => {
    const { result } = renderHook(() =>
      useSearchQueryState({
        queryKey: 'search',
        minLength: 3,
      })
    );

    expect(result.current.searchQuery).toBe('');
    expect(result.current.trimmedSearch).toBe('');
    expect(result.current.hasSearch).toBe(false);
    expect(result.current.queryPart).toEqual({});

    act(() => {
      result.current.setSearchQuery('ab');
    });

    expect(result.current.trimmedSearch).toBe('ab');
    expect(result.current.hasSearch).toBe(false);
    expect(result.current.queryPart).toEqual({});
  });

  it('builds query part with trimmed text when input reaches minLength', () => {
    const { result } = renderHook(() =>
      useSearchQueryState({
        queryKey: 'search',
        minLength: 3,
      })
    );

    act(() => {
      result.current.setSearchQuery('   chair   ');
    });

    expect(result.current.searchQuery).toBe('   chair   ');
    expect(result.current.trimmedSearch).toBe('chair');
    expect(result.current.hasSearch).toBe(true);
    expect(result.current.queryPart).toEqual({ search: 'chair' });
  });

  it('supports dynamic queryKey and respects initialValue', () => {
    const { result } = renderHook(() =>
      useSearchQueryState({
        queryKey: 'keyword',
        initialValue: '  desk  ',
        minLength: 1,
      })
    );

    expect(result.current.searchQuery).toBe('  desk  ');
    expect(result.current.trimmedSearch).toBe('desk');
    expect(result.current.hasSearch).toBe(true);
    expect(result.current.queryPart).toEqual({ keyword: 'desk' });
  });

  it('clearSearch resets query state back to default', () => {
    const { result } = renderHook(() =>
      useSearchQueryState({
        queryKey: 'search',
        minLength: 2,
      })
    );

    act(() => {
      result.current.setSearchQuery('table');
    });
    expect(result.current.hasSearch).toBe(true);
    expect(result.current.queryPart).toEqual({ search: 'table' });

    act(() => {
      result.current.clearSearch();
    });

    expect(result.current.searchQuery).toBe('');
    expect(result.current.trimmedSearch).toBe('');
    expect(result.current.hasSearch).toBe(false);
    expect(result.current.queryPart).toEqual({});
  });
});
