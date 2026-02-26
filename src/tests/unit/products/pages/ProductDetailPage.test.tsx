import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProductDetailPage from '@/features/products/pages/ProductDetailPage';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { AppError } from '@/shared/lib/appError';

const { useGetProductByIdMock } = vi.hoisted(() => ({
  useGetProductByIdMock: vi.fn(),
}));

// hook dimock biar test fokus ke render halaman detail tanpa query real
vi.mock('@/features/products/api/hooks/useGetProductById', () => ({
  useGetProductById: useGetProductByIdMock,
}));

// dialog delete dimock supaya test page ini tetap ringan dan terisolasi
vi.mock('@/features/products/components/DeleteProductDialog', () => ({
  DeleteProductDialog: () => null,
}));

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

  it('renders AppError from query via ErrorBoundary fallback', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {}); // react errorboundary log ke console.error jadi kita mute dulu biar output test tetap bersih
    useGetProductByIdMock.mockImplementation(() => {
      throw new AppError({
        status: 404,
        title: 'Product not found',
        message: 'The requested product does not exist or has been removed.',
      });
    });

    render(
      // wrapper boundary dipasang langsung di test supaya alur throw ke fallback ui bisa diverifikasi end-to-end
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
