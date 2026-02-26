import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProductDetailPage from '@/features/products/pages/ProductDetailPage';

const { useGetProductByIdMock } = vi.hoisted(() => ({
  useGetProductByIdMock: vi.fn(),
}));

// hook dimock biar test fokus ke render halaman detail (tanpa query real)
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

  it('renders product detail content when query returns product', () => { // branch not-found sudah pindah ke service + ErrorBoundary
    render(
      <MemoryRouter initialEntries={['/products/detail/p-404']}>
        <Routes>
          <Route path="/products/detail/:productId" element={<ProductDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('Product details')).toBeInTheDocument();
  });
});
