import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // buat simulasi interaksi user sungguhan (klik, ketik), bukan sekadar trigger event manual
import { ProductForm } from '@/features/products/components/ProductForm';
import { type ProductInputValues } from '@/features/products/types';

// vi.mock dijalanin lebih dulu, jadi mock function-nya disiapin dari awal pakai vi.hoisted
const { useProductFormSubmissionMock } = vi.hoisted(() => ({
  useProductFormSubmissionMock: vi.fn(),
}));
const submitProductMock = vi.fn<(data: unknown) => Promise<void>>(); // spy payload submit form

// hook asli dimock supaya test fokus ke perilaku UI form, bukan logic mutation/network di hook
vi.mock('@/features/products/hooks/useProductFormSubmission', () => ({
  useProductFormSubmission: useProductFormSubmissionMock,
}));

describe('ProductForm', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // reset call/mock implementation tiap test
    useProductFormSubmissionMock.mockReturnValue({
      isMutationPending: false, // default: belum loading
      submitError: null, // default: belum ada error submit
      submitProduct: submitProductMock, // pakai spy submit untuk assertion payload
    });
  });

  it('shows validation error and blocks submit when name is empty', async () => {
    submitProductMock.mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<ProductForm mode="create" />); // misal form create lagi kosong

    await user.click(screen.getByRole('button', { name: 'Save' })); // user submit tanpa isi field wajib

    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(submitProductMock).not.toHaveBeenCalled(); // submit handler harusnya belum kepanggil
  });

  it('submits valid values', async () => {
    submitProductMock.mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<ProductForm mode="create" />); // misal render form dengan default value

    await user.type(screen.getByLabelText('Name'), 'Desk');
    await user.clear(screen.getByLabelText('Price'));
    await user.type(screen.getByLabelText('Price'), '120');
    await user.type(screen.getByLabelText('Avatar URL'), 'https://img.test/desk.png');
    await user.type(screen.getByLabelText('Material'), 'Wood');
    await user.type(screen.getByLabelText('Description'), 'Solid wood desk'); // dulu sempat fail karena label Description belum nyambung ke textarea

    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(submitProductMock).toHaveBeenCalledTimes(1); // submit harus kepanggil sekali
    });

    const [submittedPayload] = submitProductMock.mock.calls[0];
    expect(submittedPayload).toEqual({
      name: 'Desk',
      price: 120,
      avatar: 'https://img.test/desk.png',
      material: 'Wood',
      description: 'Solid wood desk',
    });
  });

  it('shows submit error from submission hook', () => {
    useProductFormSubmissionMock.mockReturnValue({
      isMutationPending: false,
      submitError: 'Failed to save product',
      submitProduct: submitProductMock,
    });

    render(<ProductForm mode="create" />);

    expect(screen.getByRole('alert')).toHaveTextContent('Failed to save product'); // error submit muncul
  });

  it('disables form controls while mutation is pending', () => {
    useProductFormSubmissionMock.mockReturnValue({
      isMutationPending: true,
      submitError: null,
      submitProduct: submitProductMock,
    });

    render(<ProductForm mode="create" />);

    expect(screen.getByLabelText('Name')).toBeDisabled();
    expect(screen.getByLabelText('Price')).toBeDisabled();
    expect(screen.getByLabelText('Avatar URL')).toBeDisabled();
    expect(screen.getByLabelText('Material')).toBeDisabled();
    expect(screen.getByLabelText('Description')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled();
  });

  it('resets values when initialValues changes (edit mode)', async () => {
    const user = userEvent.setup();
    const initialValues: Partial<ProductInputValues> = {
      name: 'Chair',
      price: 55,
      avatar: 'https://img.test/chair.png',
      material: 'Metal',
      description: 'First description',
    };

    const { rerender } = render(
      <ProductForm mode="edit" productId="p-1" initialValues={initialValues} />
    );

    expect(screen.getByLabelText('Name')).toHaveValue('Chair');
    expect(screen.getByLabelText('Price')).toHaveValue(55);
    expect(screen.getByLabelText('Avatar URL')).toHaveValue('https://img.test/chair.png');
    expect(screen.getByLabelText('Material')).toHaveValue('Metal');
    expect(screen.getByLabelText('Description')).toHaveValue('First description');

    await user.clear(screen.getByLabelText('Name'));
    await user.type(screen.getByLabelText('Name'), 'Temp Name');
    expect(screen.getByLabelText('Name')).toHaveValue('Temp Name');

    rerender(
      <ProductForm
        mode="edit"
        productId="p-2"
        initialValues={{
          name: 'Lamp',
          price: 20,
          avatar: '',
          material: 'Plastic',
          description: 'Second description',
        }}
      />
    );

    expect(screen.getByLabelText('Name')).toHaveValue('Lamp');
    expect(screen.getByLabelText('Price')).toHaveValue(20);
    expect(screen.getByLabelText('Material')).toHaveValue('Plastic');
    expect(screen.getByLabelText('Description')).toHaveValue('Second description');
  });

  it('shows price validation error for negative number', async () => {
    const user = userEvent.setup();
    render(<ProductForm mode="create" />);

    await user.type(screen.getByLabelText('Name'), 'Desk');
    await user.clear(screen.getByLabelText('Price'));
    await user.type(screen.getByLabelText('Price'), '-1');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByText('Price must be a valid number')).toBeInTheDocument();
    expect(submitProductMock).not.toHaveBeenCalled(); // submit keblok karena validasi price gagal
  });

  it('shows avatar URL format validation error for invalid URL', async () => {
    const user = userEvent.setup();
    render(<ProductForm mode="create" />);

    await user.type(screen.getByLabelText('Name'), 'Desk');
    await user.clear(screen.getByLabelText('Price'));
    await user.type(screen.getByLabelText('Price'), '120');
    await user.type(screen.getByLabelText('Avatar URL'), 'not-a-url');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByText('Avatar URL must be a valid http(s) URL')).toBeInTheDocument();
    expect(submitProductMock).not.toHaveBeenCalled();
  });
});
