import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import EditProductPage from '@/features/products/pages/EditProductPage';

const { useGetProductByIdMock } = vi.hoisted(() => ({
  useGetProductByIdMock: vi.fn(),
}));

// hook dimock biar test fokus ke render edit page (tanpa query real)
vi.mock('@/features/products/api/hooks/useGetProductById', () => ({
  useGetProductById: useGetProductByIdMock,
}));

// ProductForm dimock supaya test page ini tetap fokus ke layout + wiring
vi.mock('@/features/products/components/ProductForm', () => ({
  ProductForm: () => null,
}));

describe('EditProductPage', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // reset call history dan implementasi mock
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

  it('renders edit form page content when query returns product', () => { // error case page ini sekarang ditangani service + boundary
    render(
      <MemoryRouter initialEntries={['/products/edit/p-404']}>
        <Routes>
          <Route path="/products/edit/:productId" element={<EditProductPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Edit Product')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });
});
