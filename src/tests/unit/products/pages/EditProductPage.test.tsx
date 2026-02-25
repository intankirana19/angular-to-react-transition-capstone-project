import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import EditProductPage from '@/features/products/pages/EditProductPage';

const { useGetProductByIdMock } = vi.hoisted(() => ({
  useGetProductByIdMock: vi.fn(),
}));
const navigateMock = vi.fn(); // spy navigate untuk verifikasi aksi pada ErrorState

// blok mock router: module asli tetap dipakai, hanya useNavigate dioverride
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

// hook dimock supaya edit page masuk ke branch entity-not-found
vi.mock('@/features/products/api/hooks/useGetProductById', () => ({
  useGetProductById: useGetProductByIdMock,
}));

// ProductForm dimock supaya test tetap fokus ke error-state branch saja
vi.mock('@/features/products/components/ProductForm', () => ({
  ProductForm: () => null,
}));

describe('EditProductPage error state', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // reset call history dan implementasi mock
    useGetProductByIdMock.mockReturnValue({ data: undefined });
  });

  it('renders entity-not-found ErrorState and navigates back to products', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/products/edit/p-404']}>
        <Routes>
          <Route path="/products/edit/:productId" element={<EditProductPage />} />
        </Routes>
      </MemoryRouter>
    ); // id route valid, tapi data product tidak ada

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Product not found')).toBeInTheDocument();
    expect(
      screen.getByText('The product ID exists in route format, but no product data was found.')
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Back to Products' })); // user diarahkan kembali ke list

    expect(navigateMock).toHaveBeenCalledWith('/products', { replace: true });
  });
});
