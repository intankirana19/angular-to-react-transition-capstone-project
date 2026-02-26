import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProductDetailPage from '@/features/products/pages/ProductDetailPage';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { AppError } from '@/shared/lib/appError';

type DeleteProductDialogPropsForTest = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
};

const { useGetProductByIdMock, navigateMock, DeleteProductDialogMock } = vi.hoisted(() => ({
  useGetProductByIdMock: vi.fn(),
  navigateMock: vi.fn(),
  DeleteProductDialogMock: vi.fn((_props: DeleteProductDialogPropsForTest) => null),
})); // vi.hoisted memastikan mock ini sudah tersedia saat vi.mock dijalankan

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
}); // tetap pakai router asli, tapi useNavigate dimock agar navigasi bisa diassert

vi.mock('@/features/products/api/hooks/useGetProductById', () => ({
  useGetProductById: useGetProductByIdMock,
})); // mock hook query supaya test fokus ke perilaku halaman

vi.mock('@/features/products/components/DeleteProductDialog', () => ({
  DeleteProductDialog: DeleteProductDialogMock,
})); // mock dialog agar test ini tetap ringan dan terisolasi

describe('ProductDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // reset state mock antar test
    useGetProductByIdMock.mockReturnValue({
      data: {
        id: 'p-1',
        name: 'Laptop',
        price: 2500,
        avatar: '',
        material: 'Aluminum',
        description: 'Test product',
        createdAt: '2024-01-01T00:00:00.000Z',
      },
    });
  });

  it('renders product detail content when query returns product', () => { // branch not-found sudah pindah ke service + errorboundary
    render(
      <MemoryRouter initialEntries={['/products/detail/p-404']}> {/* memoryrouter dipakai di unit test karena history disimpan di memory bukan browser nyata */}
        <Routes>
          <Route path="/products/detail/:productId" element={<ProductDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('Product details')).toBeInTheDocument();
  });

  it('navigates back, opens delete dialog, and wires edit/delete callbacks', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/products/detail/p-123']}>
        <Routes>
          <Route path="/products/detail/:productId" element={<ProductDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    const arrowLeftButton = document.querySelector('svg.lucide-arrow-left'); // fallback karena ArrowLeft belum punya role/label aksesibel
    expect(arrowLeftButton).not.toBeNull();
    if (!arrowLeftButton) {
      throw new Error('ArrowLeft icon not found');
    }
    await user.click(arrowLeftButton);
    expect(navigateMock).toHaveBeenCalledWith(-1);

    await user.click(screen.getByRole('button', { name: 'Edit product' }));
    expect(navigateMock).toHaveBeenCalledWith('/products/edit/p-123', { replace: true });

    await user.click(screen.getByRole('button', { name: 'Delete product' }));

    const firstCall = DeleteProductDialogMock.mock.calls.at(0); // props awal: dialog harus tertutup saat render pertama
    expect(firstCall).toBeDefined();
    if (!firstCall) {
      throw new Error('DeleteProductDialogMock was not called');
    }
    const [initialProps] = firstCall;
    expect(initialProps.open).toBe(false);

    const secondCall = DeleteProductDialogMock.mock.calls.at(-1); // ambil call terakhir karena klik delete memicu rerender
    expect(secondCall).toBeDefined();
    if (!secondCall) {
      throw new Error('DeleteProductDialogMock was not called after click');
    }
    const [openedProps] = secondCall;
    expect(openedProps.open).toBe(true);

    act(() => { // callback dipanggil langsung, jadi dibungkus act agar update state sinkron
      openedProps.onOpenChange(false);
    });
    const thirdCall = DeleteProductDialogMock.mock.calls.at(-1); // efek onOpenChange: state open harus kembali false
    expect(thirdCall).toBeDefined();
    if (!thirdCall) {
      throw new Error('DeleteProductDialogMock was not called after onOpenChange');
    }
    const [closedProps] = thirdCall;
    expect(closedProps.open).toBe(false);

    closedProps.onDeleted();
    expect(navigateMock).toHaveBeenCalledWith('/products');
  });

  it('renders placeholders for optional fields when product data is partial', () => {
    useGetProductByIdMock.mockReturnValue({
      data: {
        id: 'p-2',
        name: undefined,
        price: null,
        avatar: undefined,
        material: null,
        description: undefined,
        createdAt: null,
      },
    });

    render(
      <MemoryRouter initialEntries={['/products/detail/p-2']}>
        <Routes>
          <Route path="/products/detail/:productId" element={<ProductDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: '-' })).toBeInTheDocument(); // judul ikut fallback ke placeholder default
    expect(screen.getAllByText('-').length).toBeGreaterThanOrEqual(4);
    expect(screen.getByText('Product details')).toBeInTheDocument();
  });

  it('renders AppError from query via ErrorBoundary fallback', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {}); // react errorboundary log ke console.error jadi kita mute dulu biar output test tetap bersih
    useGetProductByIdMock.mockImplementation(() => {
      throw new AppError({
        status: 404,
        title: 'Product not found',
        message: 'The requested product does not exist or has been removed.',
      });
    });

    render( // pasang boundary di test agar alur throw AppError -> fallback UI tervalidasi end-to-end
      <ErrorBoundary fullScreen={false} reloadLabel="Retry" onRetry={vi.fn()}>
        <MemoryRouter initialEntries={['/products/detail/p-404']}> {/* memoryrouter bikin route param bisa dites tanpa nyentuh url browser */}
          <Routes>
            <Route path="/products/detail/:productId" element={<ProductDetailPage />} />
          </Routes>
        </MemoryRouter>
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Product not found')).toBeInTheDocument();
    expect(screen.getByText('The requested product does not exist or has been removed.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();

    consoleErrorSpy.mockRestore(); // restore spy supaya tidak bocor ke test lain
  });
});
