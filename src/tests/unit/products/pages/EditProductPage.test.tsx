import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import EditProductPage from '@/features/products/pages/EditProductPage';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { AppError } from '@/shared/lib/appError';

// tipe props lokal untuk menjaga akses mock.calls tetap aman di TypeScript strict mode
type ProductFormPropsForTest = {
  productId?: string;
  mode?: 'create' | 'edit';
  initialValues?: {
    name?: string;
    price?: number;
    avatar?: string;
    material?: string;
    description?: string;
  };
  onSuccess?: () => void;
};

const { useGetProductByIdMock, ProductFormMock, navigateMock } = vi.hoisted(() => ({
  useGetProductByIdMock: vi.fn(),
  ProductFormMock: vi.fn((_props: ProductFormPropsForTest) => null),
  navigateMock: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

// hook dimock biar test fokus ke render edit page tanpa query real
vi.mock('@/features/products/api/hooks/useGetProductById', () => ({
  useGetProductById: useGetProductByIdMock,
}));

// ProductForm dimock supaya test page ini tetap fokus ke layout + wiring
vi.mock('@/features/products/components/ProductForm', () => ({
  ProductForm: ProductFormMock,
}));

describe('EditProductPage', () => {
  const getFormProps = (): ProductFormPropsForTest => {
    // ambil props panggilan pertama ProductForm dengan guard supaya tidak "possibly undefined"
    const firstCall = ProductFormMock.mock.calls.at(0);
    expect(firstCall).toBeDefined();
    if (!firstCall) {
      throw new Error('ProductFormMock was not called');
    }
    const [formProps] = firstCall;
    return formProps;
  };

  beforeEach(() => {
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
      <MemoryRouter initialEntries={['/products/edit/p-404']}> {/* memoryrouter dipakai di unit test karena history disimpan di memory bukan browser nyata */}
        <Routes>
          <Route path="/products/edit/:productId" element={<EditProductPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Edit Product')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();

    const formProps = getFormProps(); // verifikasi wiring props ke ProductForm saat data produk tersedia
    expect(formProps).toMatchObject({
      productId: 'p-404',
      mode: 'edit',
      initialValues: {
        name: 'Laptop',
        price: 2500,
        avatar: '',
        material: 'Aluminum',
        description: 'Test product',
      },
    });
  });

  it('navigates back to detail page when clicking Cancel', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/products/edit/p-123']}>
        <Routes>
          <Route path="/products/edit/:productId" element={<EditProductPage />} />
        </Routes>
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: 'Cancel' })); // aksi cancel harus kembali ke halaman detail produk

    expect(navigateMock).toHaveBeenCalledWith('/products/detail/p-123', { replace: true });
  });

  it('uses safe defaults in initialValues and navigates on ProductForm success', () => {
    // simulasi payload produk yang field opsionalnya kosong/null untuk ngetes fallback default di page
    useGetProductByIdMock.mockReturnValue({
      data: {
        id: 'p-2',
        name: undefined,
        price: null,
        avatar: undefined,
        material: null,
        description: undefined,
      },
    });

    render(
      <MemoryRouter initialEntries={['/products/edit/p-2']}>
        <Routes>
          <Route path="/products/edit/:productId" element={<EditProductPage />} />
        </Routes>
      </MemoryRouter>
    );

    const formProps = getFormProps(); // ambil props yang dikirim page ke ProductForm
    expect(formProps.initialValues).toEqual({
      name: '',
      price: 0,
      avatar: '',
      material: '',
      description: '',
    });

    const onSuccess = formProps.onSuccess as (() => void) | undefined;
    onSuccess?.(); // callback sukses form harus mengarahkan user balik ke detail page
    expect(navigateMock).toHaveBeenCalledWith('/products/detail/p-2', { replace: true });
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
        <MemoryRouter initialEntries={['/products/edit/p-404']}> {/* memoryrouter bikin route param bisa dites tanpa nyentuh url browser */}
          <Routes>
            <Route path="/products/edit/:productId" element={<EditProductPage />} />
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
