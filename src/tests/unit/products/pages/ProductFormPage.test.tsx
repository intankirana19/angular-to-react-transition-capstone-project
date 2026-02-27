import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductFormPage from '@/features/products/pages/ProductFormPage';

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

const { useParamsMock, useGetProductByIdMock, navigateMock, ProductFormMock } = vi.hoisted(() => ({
  useParamsMock: vi.fn<() => { productId?: string }>(),
  useGetProductByIdMock: vi.fn<(productId?: string) => { data?: Partial<{ name: string | null; price: number | null; avatar: string | null; material: string | null; description: string | null }> }>(),
  navigateMock: vi.fn(),
  ProductFormMock: vi.fn((_props: ProductFormPropsForTest) => null),
}));

// react-router-dom dimock agar route param + navigate bisa dikontrol penuh di unit test page ini
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useParams: () => useParamsMock(),
  };
});

// hook query dimock agar test fokus ke wiring ProductFormPage tanpa request data real
vi.mock('@/features/products/api/hooks/useGetProductById', () => ({
  useGetProductById: (productId?: string) => useGetProductByIdMock(productId),
}));

// productform dimock supaya verifikasi tetap di level page contract (props + callback)
vi.mock('@/features/products/components/ProductForm', () => ({
  ProductForm: ProductFormMock,
}));

describe('ProductFormPage', () => {
  const getFormProps = (): ProductFormPropsForTest => {
    const firstCall = ProductFormMock.mock.calls.at(0); // helper ini dipakai untuk ambil props productform secara aman dari call pertama mock
    expect(firstCall).toBeDefined();
    if (!firstCall) {
      throw new Error('ProductFormMock was not called');
    }

    const [formProps] = firstCall;
    return formProps;
  };

  beforeEach(() => {
    vi.clearAllMocks(); // reset call history + implementation mock supaya antar test tidak saling bocor state

    useParamsMock.mockReturnValue({}); // default state mode create (tanpa productid) dan data query kosong
    useGetProductByIdMock.mockReturnValue({ data: undefined }); // default state query produk kosong
  });

  it('renders create mode title and wires ProductForm in create mode', () => {
    render(<ProductFormPage />); // render halaman tanpa productid untuk mode create

    expect(screen.getByRole('heading', { name: 'New Product' })).toBeInTheDocument();
    expect(screen.getByText('Fill the form to add a product')).toBeInTheDocument();
    expect(useGetProductByIdMock).toHaveBeenCalledWith(undefined);

    const formProps = getFormProps();
    expect(formProps).toMatchObject({
      productId: undefined,
      mode: 'create',
      initialValues: undefined,
    });

    formProps.onSuccess?.(); // callback sukses harus mengarahkan user kembali ke list products
    expect(navigateMock).toHaveBeenCalledWith('/products');
  });

  it('renders edit mode title and maps product fields with safe defaults', () => {
    useParamsMock.mockReturnValue({ productId: 'p-9' }); // setup mode edit dengan productid agar cabang isedit=true ikut teruji
    useGetProductByIdMock.mockReturnValue({
      data: {
        name: null,
        price: null,
        avatar: null,
        material: null,
        description: null,
      },
    });

    render(<ProductFormPage />);

    expect(screen.getByRole('heading', { name: 'Edit Product' })).toBeInTheDocument();
    expect(screen.getByText('Update product details')).toBeInTheDocument();
    expect(useGetProductByIdMock).toHaveBeenCalledWith('p-9');

    const formProps = getFormProps();
    expect(formProps).toMatchObject({
      productId: 'p-9',
      mode: 'edit',
      initialValues: {
        name: '',
        price: 0,
        avatar: '',
        material: '',
        description: '',
      },
    });
  });

  it('navigates back when clicking Cancel and history length is greater than 1', async () => {
    const user = userEvent.setup();

    const historyLengthSpy = vi.spyOn(window.history, 'length', 'get').mockReturnValue(2); // spy history.length untuk memaksa branch back-navigation

    render(<ProductFormPage />);

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(navigateMock).toHaveBeenCalledWith(-1);

    historyLengthSpy.mockRestore(); // restore spy supaya tidak memengaruhi test lain
  });

  it('navigates to /products when clicking Cancel and history length is 1', async () => {
    const user = userEvent.setup();

    const historyLengthSpy = vi.spyOn(window.history, 'length', 'get').mockReturnValue(1); // spy history.length untuk memaksa branch fallback ke /products

    render(<ProductFormPage />);

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(navigateMock).toHaveBeenCalledWith('/products');

    historyLengthSpy.mockRestore(); // restore spy setelah assert selesai
  });
});
