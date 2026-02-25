import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductEntityNotFoundPage from '@/features/products/pages/ProductEntityNotFoundPage';

const navigateMock = vi.fn(); // spy navigate supaya verifikasi routing tanpa router real

// mock partial react-router-dom: keep module asli, override useNavigate saja
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe('ProductEntityNotFoundPage', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // reset call history antar test biar assertion tidak bocor
  });

  it('renders not found state and navigates back to products', async () => {
    const user = userEvent.setup();

    render(<ProductEntityNotFoundPage />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Product not found')).toBeInTheDocument();
    expect(
      screen.getByText('The product ID exists in route format, but no product data was found.')
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Back to Products' })); // saat klik Back to Products harus navigate ke list + replace history

    expect(navigateMock).toHaveBeenCalledWith('/products', { replace: true });
  });
});
