import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ProductsRoutes from '@/features/products/ProductsRoutes';

const navigateMock = vi.fn(); // spy navigate untuk verifikasi aksi pada ErrorState wildcard

// blok mock router: module asli tetap dipakai, tapi useNavigate dioverride agar bisa diverifikasi di test
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

// mock pages lain agar test fokus murni ke fallback wildcard route
vi.mock('@/features/products/pages/ProductsListPage', () => ({ default: () => null }));
vi.mock('@/features/products/pages/CreateProductPage', () => ({ default: () => null }));
vi.mock('@/features/products/pages/ProductDetailPage', () => ({ default: () => null }));
vi.mock('@/features/products/pages/EditProductPage', () => ({ default: () => null }));

describe('ProductsRoutes error state', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // reset history call antar test
  });

  it('renders wildcard route ErrorState and navigates back to products', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/products/unknown-path']}> {/* memoryrouter cocok buat test routing karena riwayat route jalan di memory */}
        <ProductsRoutes />
      </MemoryRouter>
    ); // route invalid harus jatuh ke ErrorState wildcard

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Product page not found')).toBeInTheDocument();
    expect(screen.getByText('The product route you tried to open does not exist.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Back to Products' })); // CTA fallback harus balikin ke list

    expect(navigateMock).toHaveBeenCalledWith('/products', { replace: true });
  });
});
