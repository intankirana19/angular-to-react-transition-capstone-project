import { act, renderHook } from '@testing-library/react';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';

function createScrollContainer({
  id,
  clientHeight,
  scrollTop,
  scrollHeight,
}: {
  id: string;
  clientHeight: number;
  scrollTop: number;
  scrollHeight: number;
}) {
  const element = document.createElement('div');
  element.id = id;

  // ukuran container dibuat manual karena jsdom tidak hitung layout browser sungguhan
  Object.defineProperty(element, 'clientHeight', { configurable: true, value: clientHeight });
  Object.defineProperty(element, 'scrollTop', {
    configurable: true,
    get: () => scrollTop,
    set: (value: number) => {
      scrollTop = value;
    },
  });
  Object.defineProperty(element, 'scrollHeight', { configurable: true, value: scrollHeight });

  document.body.appendChild(element);

  return element;
}

describe('useInfiniteScroll', () => {
  beforeEach(() => {
    // fake timer dipakai karena hook ini debounce event scroll
    vi.useFakeTimers();
  });

  afterEach(() => {
    // timer asli dibalikin lagi dan dom test dibersihin
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it('loads immediately on mount when the custom container is already near bottom', async () => {
    // implementasi sekarang bisa ngecek near-bottom saat mount dan lagi setelah debounce tick awal
    createScrollContainer({
      id: 'app-main-scroll',
      clientHeight: 500,
      scrollTop: 350,
      scrollHeight: 1000,
    });

    const onLoadMore = vi.fn();

    renderHook(() =>
      useInfiniteScroll({
        hasMore: true,
        onLoadMore,
        scrollContainerId: 'app-main-scroll',
        threshold: 200,
        debounceMs: 300,
      })
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });

    expect(onLoadMore).toHaveBeenCalledTimes(2);
  });

  it('loads more after a debounced scroll event reaches the threshold', async () => {
    // perubahan posisi scroll baru diproses setelah debounce selesai
    const container = createScrollContainer({
      id: 'app-main-scroll',
      clientHeight: 500,
      scrollTop: 100,
      scrollHeight: 1200,
    });

    const onLoadMore = vi.fn();

    renderHook(() =>
      useInfiniteScroll({
        hasMore: true,
        onLoadMore,
        scrollContainerId: 'app-main-scroll',
        threshold: 100,
        debounceMs: 300,
      })
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });

    expect(onLoadMore).not.toHaveBeenCalled();

    act(() => {
      // geser mendekati bawah setelah mount awal selesai
      container.scrollTop = 600;
      container.dispatchEvent(new Event('scroll'));
    });

    expect(onLoadMore).not.toHaveBeenCalled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(299);
    });

    expect(onLoadMore).not.toHaveBeenCalled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });

    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it('does not load when disabled or when there is no more data', () => {
    // guard enabled dan hasMore harus benar-benar nahan callback load
    createScrollContainer({
      id: 'app-main-scroll',
      clientHeight: 500,
      scrollTop: 450,
      scrollHeight: 1000,
    });

    const onLoadMore = vi.fn();

    renderHook(() =>
      useInfiniteScroll({
        enabled: false,
        hasMore: false,
        onLoadMore,
        scrollContainerId: 'app-main-scroll',
        threshold: 100,
        debounceMs: 300,
      })
    );

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(onLoadMore).not.toHaveBeenCalled();
  });
});
