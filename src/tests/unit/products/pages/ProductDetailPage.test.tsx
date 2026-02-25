import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProductDetailPage from '@/features/products/pages/ProductDetailPage';

const { useGetProductByIdMock } = vi.hoisted(() => ({
  useGetProductByIdMock: vi.fn(),
}));
const navigateMock = vi.fn(); // spy navigate untuk verifikasi aksi pada ErrorState

// blok mock router: module asli dipakai, hanya useNavigate yang dioverride
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

// hook dimock supaya skenario entity-not-found bisa dipaksa (data undefined)
vi.mock('@/features/products/api/hooks/useGetProductById', () => ({
  useGetProductById: useGetProductByIdMock,
}));

// dialog delete dimock supaya test error path tidak ketarik dependency Radix dialog
vi.mock('@/features/products/components/DeleteProductDialog', () => ({
  DeleteProductDialog: () => null,
}));

describe('ProductDetailPage error state', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // reset state mock antar test
    useGetProductByIdMock.mockReturnValue({ data: undefined });
  });

  it('renders entity-not-found ErrorState and navigates back to products', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/products/detail/p-404']}>
        <Routes>
          <Route path="/products/detail/:productId" element={<ProductDetailPage />} />
        </Routes>
      </MemoryRouter>
    ); // id valid di route tapi data tidak ditemukan

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Product not found')).toBeInTheDocument();
    expect(
      screen.getByText('The product ID exists in route format, but no product data was found.')
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Back to Products' })); // saat user click button 'Back to Products' harus kembali ke list

    expect(navigateMock).toHaveBeenCalledWith('/products', { replace: true });
  });
});
