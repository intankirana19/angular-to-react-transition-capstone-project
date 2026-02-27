import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CreateProductPage from '@/features/products/pages/CreateProductPage';

type ProductFormPropsForTest = {
  mode?: 'create' | 'edit';
  onSuccess?: () => void;
};

const { ProductFormMock, navigateMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(), // spy untuk merekam pemanggilan navigate dari komponen halaman
  ProductFormMock: vi.fn((_props: ProductFormPropsForTest) => null), // mock ProductForm: return null agar test fokus ke wiring page-level
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock('@/features/products/components/ProductForm', () => ({
  ProductForm: ProductFormMock, // ProductForm asli dimock agar test tidak tergantung validasi internal form
}));

describe('CreateProductPage', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // reset seluruh call history mock agar tiap test independen
  });

  it('renders create page title and wires ProductForm in create mode', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <CreateProductPage />
      </MemoryRouter>
    ); // render halaman create dengan MemoryRouter agar useNavigate aktif seperti runtime normal

    expect(screen.getByText('New Product')).toBeInTheDocument(); // assert judul utama halaman create tampil
    expect(screen.getByText('Fill the form to add a product')).toBeInTheDocument(); // assert subtitle halaman create tampil

    const firstCall = ProductFormMock.mock.calls.at(0); // ambil panggilan pertama ProductForm untuk cek props dari page
    expect(firstCall).toBeDefined();
    if (!firstCall) {
      throw new Error('ProductFormMock was not called');
    }

    const [formProps] = firstCall as [ProductFormPropsForTest]; // cast tuple call agar TypeScript tahu struktur props mock
    expect(formProps.mode).toBe('create');
    expect(typeof formProps.onSuccess).toBe('function'); // callback onSuccess wajib ada untuk alur submit sukses

    formProps.onSuccess?.(); // panggil callback sukses manual untuk verifikasi redirect ke list products
    expect(navigateMock).toHaveBeenCalledWith('/products');

    await user.click(screen.getByRole('button', { name: 'Cancel' })); // pastikan tombol Cancel ter-render dan bisa diklik user
    expect(navigateMock).toHaveBeenCalled(); // detail tujuan route diverifikasi di test cancel khusus di bawah
  });

  it('navigates to /products when clicking Cancel and history length is 1', async () => {
    const user = userEvent.setup();

    const historyLengthSpy = vi.spyOn(window.history, 'length', 'get').mockReturnValue(1); // paksa branch fallback saat history tidak punya stack back

    render(
      <MemoryRouter>
        <CreateProductPage />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(navigateMock).toHaveBeenCalledWith('/products');

    historyLengthSpy.mockRestore(); // restore agar tidak mempengaruhi test lain
  });

  it('navigates back when clicking Cancel and history length is greater than 1', async () => {
    const user = userEvent.setup();

    const historyLengthSpy = vi.spyOn(window.history, 'length', 'get').mockReturnValue(2); // paksa branch go-back saat history punya stack

    render(
      <MemoryRouter>
        <CreateProductPage />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(navigateMock).toHaveBeenCalledWith(-1);

    historyLengthSpy.mockRestore(); // restore setelah assert (pengecekan apakah hasilnya sesuai expected) selesai
  });
});
