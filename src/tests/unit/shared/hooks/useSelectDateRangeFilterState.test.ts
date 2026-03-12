import { act, renderHook } from '@testing-library/react';
import { useSelectDateRangeFilterState } from '@/shared/hooks/useSelectDateRangeFilterState';

describe('useSelectDateRangeFilterState', () => {
  it('starts with no active filter when using the all option', () => {
    // state awal harus bersih supaya page ga kirim query palsu
    const { result } = renderHook(() =>
      useSelectDateRangeFilterState({
        allValue: 'all',
        selectQueryKey: 'material',
        fromQueryKey: 'fromDate',
        toQueryKey: 'toDate',
      })
    );

    expect(result.current.selectFilter).toBe('all');
    expect(result.current.dateRange).toBeUndefined();
    expect(result.current.hasSelectFilter).toBe(false);
    expect(result.current.hasDateFilter).toBe(false);
    expect(result.current.hasAnyFilter).toBe(false);
    expect(result.current.activeStructuredFilterCount).toBe(0);
    expect(result.current.queryPart).toEqual({});
  });

  it('builds query payload and filter count from select plus date range', () => {
    // saat filter aktif semua key query harus kebentuk lengkap
    const { result } = renderHook(() =>
      useSelectDateRangeFilterState({
        allValue: 'all',
        selectQueryKey: 'material',
        fromQueryKey: 'fromDate',
        toQueryKey: 'toDate',
      })
    );

    act(() => {
      result.current.setSelectFilter('wood');
      result.current.setDateRange({
        from: new Date('2026-03-01T00:00:00.000Z'),
        to: new Date('2026-03-05T00:00:00.000Z'),
      });
    });

    expect(result.current.hasSelectFilter).toBe(true);
    expect(result.current.hasDateFilter).toBe(true);
    expect(result.current.hasAnyFilter).toBe(true);
    expect(result.current.activeStructuredFilterCount).toBe(2);
    expect(result.current.queryPart).toEqual({
      material: 'wood',
      fromDate: '2026-03-01T00:00:00.000Z',
      toDate: '2026-03-05T00:00:00.000Z',
    });
  });

  it('clearFilters resets select and date range back to default state', () => {
    // reset harus balikin semua flag dan payload ke kondisi kosong
    const { result } = renderHook(() =>
      useSelectDateRangeFilterState({
        allValue: 'all',
        selectQueryKey: 'material',
        fromQueryKey: 'fromDate',
        toQueryKey: 'toDate',
        initialSelectValue: 'metal',
      })
    );

    act(() => {
      result.current.setDateRange({
        from: new Date('2026-03-10T00:00:00.000Z'),
        to: undefined,
      });
    });

    expect(result.current.hasAnyFilter).toBe(true);

    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.selectFilter).toBe('all');
    expect(result.current.dateRange).toBeUndefined();
    expect(result.current.hasSelectFilter).toBe(false);
    expect(result.current.hasDateFilter).toBe(false);
    expect(result.current.hasAnyFilter).toBe(false);
    expect(result.current.activeStructuredFilterCount).toBe(0);
    expect(result.current.queryPart).toEqual({});
  });
});
