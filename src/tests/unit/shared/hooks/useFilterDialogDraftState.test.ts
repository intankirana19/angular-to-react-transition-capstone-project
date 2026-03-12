import { act, renderHook } from '@testing-library/react';
import { useFilterDialogDraftState } from '@/shared/hooks/useFilterDialogDraftState';

describe('useFilterDialogDraftState', () => {
  it('syncs draft values from base state when dialog opens', () => {
    // buka dialog harus narik snapshot filter aktif ke draft
    const baseDateRange = {
      from: new Date('2026-03-01T00:00:00.000Z'),
      to: new Date('2026-03-05T00:00:00.000Z'),
    };

    const { result } = renderHook(() =>
      useFilterDialogDraftState({
        allValue: 'all',
        baseSelectValue: 'wood',
        baseDateRange,
        onApplySelectValue: vi.fn(),
        onApplyDateRange: vi.fn(),
      })
    );

    act(() => {
      result.current.onDialogOpenChange(true);
    });

    expect(result.current.isDialogOpen).toBe(true);
    expect(result.current.draftSelectValue).toBe('wood');
    expect(result.current.draftDateRange).toEqual(baseDateRange);
    expect(result.current.draftDateRange).not.toBe(baseDateRange);
    expect(result.current.draftDateRange?.from).not.toBe(baseDateRange.from);
    expect(result.current.draftDateRange?.to).not.toBe(baseDateRange.to);
  });

  it('applies current draft values and closes the dialog', () => {
    // apply harus commit draft terakhir ke callback page
    const onApplySelectValue = vi.fn();
    const onApplyDateRange = vi.fn();

    const { result } = renderHook(() =>
      useFilterDialogDraftState({
        allValue: 'all',
        baseSelectValue: 'all',
        baseDateRange: undefined,
        onApplySelectValue,
        onApplyDateRange,
      })
    );

    act(() => {
      result.current.onDialogOpenChange(true);
      result.current.setDraftSelectValue('metal');
      result.current.setDraftDateRange({
        from: new Date('2026-03-10T00:00:00.000Z'),
        to: new Date('2026-03-12T00:00:00.000Z'),
      });
    });

    const currentDraftRange = result.current.draftDateRange;

    act(() => {
      result.current.applyDraft();
    });

    expect(onApplySelectValue).toHaveBeenCalledWith('metal');
    expect(onApplyDateRange).toHaveBeenCalledTimes(1);
    expect(onApplyDateRange.mock.calls[0][0]).toEqual(currentDraftRange);
    expect(onApplyDateRange.mock.calls[0][0]).not.toBe(currentDraftRange);
    expect(result.current.isDialogOpen).toBe(false);
  });

  it('clears draft state without touching applied callbacks', () => {
    // clear cuma reset state draft karena apply belum dikonfirmasi user
    const onApplySelectValue = vi.fn();
    const onApplyDateRange = vi.fn();

    const { result } = renderHook(() =>
      useFilterDialogDraftState({
        allValue: 'all',
        baseSelectValue: 'wood',
        baseDateRange: {
          from: new Date('2026-03-01T00:00:00.000Z'),
          to: new Date('2026-03-02T00:00:00.000Z'),
        },
        onApplySelectValue,
        onApplyDateRange,
      })
    );

    act(() => {
      result.current.onDialogOpenChange(true);
      result.current.clearDraft();
    });

    expect(result.current.draftSelectValue).toBe('all');
    expect(result.current.draftDateRange).toBeUndefined();
    expect(onApplySelectValue).not.toHaveBeenCalled();
    expect(onApplyDateRange).not.toHaveBeenCalled();
  });
});
