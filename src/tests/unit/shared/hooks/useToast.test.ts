import { act, renderHook } from '@testing-library/react';
import { useToast } from '@/shared/hooks/useToast';

describe('useToast', () => {
  beforeEach(() => {
    // store zustand global jadi perlu dibersihin dulu antar test
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toasts.forEach((toast) => {
        toast.onClose(toast.id);
      });
    });
  });

  it('adds a toast with generated id and close handler', () => {
    // addToast adalah kontrak dasar yang dipakai helper success/error/info/warning
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.addToast({
        type: 'success',
        title: 'Saved',
        message: 'Product saved successfully',
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]).toMatchObject({
      type: 'success',
      title: 'Saved',
      message: 'Product saved successfully',
    });
    expect(result.current.toasts[0].id).toMatch(/^toast-/);
    expect(result.current.toasts[0].onClose).toEqual(expect.any(Function));
  });

  it('helper methods create the correct toast type', () => {
    // helper shortcut harus tetap manggil addToast dengan tipe yang benar
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success('Success title', 'done');
      result.current.error('Error title', 'failed');
      result.current.info('Info title', 'heads up');
      result.current.warning('Warning title', 'careful');
    });

    expect(result.current.toasts.map((toast) => toast.type)).toEqual([
      'success',
      'error',
      'info',
      'warning',
    ]);
  });

  it('removes a toast when its close handler is called', () => {
    // flow remove penting karena toast ui pakai onClose dari store ini
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.addToast({
        type: 'info',
        title: 'Info',
        message: 'hello',
      });
    });

    const addedToast = result.current.toasts[0];

    act(() => {
      addedToast.onClose(addedToast.id);
    });

    expect(result.current.toasts).toHaveLength(0);
  });
});
