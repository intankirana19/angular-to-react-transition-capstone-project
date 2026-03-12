import { act, renderHook } from '@testing-library/react';
import { useSortQueryState } from '@/shared/hooks/useSortQueryState';

describe('useSortQueryState', () => {
  const sortOptions = [
    { value: 'newest', label: 'Newest', sortBy: 'createdAt', sortOrder: 'desc' },
    { value: 'oldest', label: 'Oldest', sortBy: 'createdAt', sortOrder: 'asc' },
    { value: 'price-high', label: 'Highest Price', sortBy: 'price', sortOrder: 'desc' },
  ] as const;

  it('returns default sort state and query part', () => {
    // state awal harus langsung ngikut opsi default
    const { result } = renderHook(() =>
      useSortQueryState({
        options: [...sortOptions],
        defaultValue: 'newest',
      })
    );

    expect(result.current.sortValue).toBe('newest');
    expect(result.current.sortOptions).toEqual(sortOptions);
    expect(result.current.queryPart).toEqual({
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  });

  it('updates query part when user picks a valid sort option', () => {
    // ganti opsi valid harus ikut ngubah payload query
    const { result } = renderHook(() =>
      useSortQueryState({
        options: [...sortOptions],
        defaultValue: 'newest',
      })
    );

    act(() => {
      result.current.onSortValueChange('price-high');
    });

    expect(result.current.sortValue).toBe('price-high');
    expect(result.current.queryPart).toEqual({
      sortBy: 'price',
      sortOrder: 'desc',
    });
  });

  it('ignores invalid sort values and keeps the previous state', () => {
    // guard ini penting biar ui ga bisa nyuntik value di luar opsi resmi
    const { result } = renderHook(() =>
      useSortQueryState({
        options: [...sortOptions],
        defaultValue: 'oldest',
      })
    );

    act(() => {
      result.current.onSortValueChange('unknown-sort');
    });

    expect(result.current.sortValue).toBe('oldest');
    expect(result.current.queryPart).toEqual({
      sortBy: 'createdAt',
      sortOrder: 'asc',
    });
  });
});
