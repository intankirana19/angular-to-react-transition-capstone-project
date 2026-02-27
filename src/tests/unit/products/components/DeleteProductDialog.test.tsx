import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeleteProductDialog } from '@/features/products/components/DeleteProductDialog';
import { type Product } from '@/features/products/types';

interface DeleteProductMutationMock {
  isPending: boolean;
  mutateAsync: (id: string) => Promise<void>;
}

// vi.hoisted dipakai supaya referensi spy sudah ada sebelum blok vi.mock dievaluasi oleh Vitest.
const { mutateAsyncMock, addToastMock, getErrorMessageMock, useDeleteProductMock } = vi.hoisted(() => ({
  mutateAsyncMock: vi.fn<(id: string) => Promise<void>>(),
  addToastMock: vi.fn(),
  getErrorMessageMock: vi.fn<(error: unknown, fallbackMessage: string) => string>(),
  useDeleteProductMock: vi.fn<() => DeleteProductMutationMock>(),
}));

// Mock Dialog shared supaya test fokus ke perilaku DeleteProductDialog, bukan detail implementasi Radix Dialog.
vi.mock('@/shared/ui/Dialog', () => ({
  Dialog: (props: {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: React.ReactNode;
  }) =>
    props.open ? (
      <div data-testid="dialog-root">
        {props.children}
        <button type="button" onClick={() => props.onOpenChange?.(false)} aria-label="mock-close-dialog" /> {/* Tombol mock ini dipakai untuk menguji callback onOpenChange(false) dari level root dialog. */}
        <button type="button" onClick={() => props.onOpenChange?.(true)} aria-label="mock-open-dialog" /> {/* Tombol mock ini dipakai untuk menguji callback onOpenChange(true) dari level root dialog. */}
      </div>
    ) : null,
  DialogContent: (props: { children?: React.ReactNode }) => <div>{props.children}</div>,
  DialogHeader: (props: { children?: React.ReactNode }) => <div>{props.children}</div>,
  DialogTitle: (props: { children?: React.ReactNode }) => <h2>{props.children}</h2>,
  DialogDescription: (props: { children?: React.ReactNode }) => <p>{props.children}</p>,
  DialogFooter: (props: { children?: React.ReactNode }) => <div>{props.children}</div>,
}));

// Hook delete dimock agar kita bisa kontrol skenario sukses/gagal tanpa network/API real.
vi.mock('@/features/products/api/hooks/useDeleteProduct', () => ({
  useDeleteProduct: () => useDeleteProductMock(),
}));

// Hook toast dimock supaya payload notifikasi bisa diverifikasi langsung dari unit test.
vi.mock('@/shared/hooks/useToast', () => ({
  useToast: () => ({ addToast: addToastMock }),
}));

// Utility error message dimock agar jalur catch bisa dites deterministik tanpa tergantung formatter asli.
vi.mock('@/shared/lib/error', () => ({
  getErrorMessage: (error: unknown, fallbackMessage: string) => getErrorMessageMock(error, fallbackMessage),
}));

// Button shared dimock agar handler onClick tetap bisa dipicu di test guard meski state disabled aktif.
vi.mock('@/shared/ui/Button', () => ({
  Button: ({
    children,
    disabled,
    onClick,
    ...rest
  }: {
    children?: React.ReactNode;
    disabled?: boolean;
    onClick?: () => void;
    [key: string]: unknown;
  }) => (
    <button
      {...rest}
      type="button"
      onClick={onClick}
      data-disabled={disabled ? 'true' : 'false'} // Atribut ini dipakai untuk assert state disabled di test.
    >
      {children}
    </button>
  ),
}));

const sampleProduct: Product = {
  id: 'prod-1',
  name: 'Dining Chair',
  price: 150,
  avatar: '',
  material: 'Wood',
  description: 'Simple wooden chair',
  createdAt: '2026-01-01T00:00:00.000Z',
};

describe('DeleteProductDialog', () => {
  beforeEach(() => {
    // Reset semua call history + implementation supaya tiap test benar-benar independen.
    vi.clearAllMocks();

    // Baseline default: mutation tidak pending dan mutate berhasil resolve.
    useDeleteProductMock.mockReturnValue({
      isPending: false,
      mutateAsync: mutateAsyncMock.mockResolvedValue(undefined),
    });

    // Default formatter error mengembalikan fallback agar mudah diverifikasi saat butuh.
    getErrorMessageMock.mockImplementation((_error, fallbackMessage) => fallbackMessage);
  });

  it('renders fallback description and disables delete action when product is null', () => {
    render(<DeleteProductDialog open onOpenChange={vi.fn()} product={null} />); // Dialog dibuka tanpa target produk.

    expect(screen.getByRole('heading', { name: 'Delete Product' })).toBeInTheDocument();
    expect(screen.getByText('Select a product to delete.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete Product' })).toHaveAttribute('data-disabled', 'true');
  });

  it('does not mutate when user clicks delete while product is null', () => {
    render(<DeleteProductDialog open onOpenChange={vi.fn()} product={null} />);

    // fireEvent dipakai di sini untuk menembak onClick secara langsung agar cabang guard (!product) di handleConfirm ikut ter-cover.
    fireEvent.click(screen.getByRole('button', { name: 'Delete Product' }));

    expect(mutateAsyncMock).not.toHaveBeenCalled();
    expect(addToastMock).not.toHaveBeenCalled();
  });

  it('calls onOpenChange(false) when cancel is clicked in normal state', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(<DeleteProductDialog open onOpenChange={onOpenChange} product={sampleProduct} />);

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('blocks closing when root dialog asks to close during pending deletion', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    useDeleteProductMock.mockReturnValue({
      isPending: true,
      mutateAsync: mutateAsyncMock,
    });

    render(<DeleteProductDialog open onOpenChange={onOpenChange} product={sampleProduct} />);

    await user.click(screen.getByRole('button', { name: 'mock-close-dialog' })); // Simulasi callback root dialog untuk close.

    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveAttribute('data-disabled', 'true');
    expect(screen.getByRole('button', { name: 'Deleting...' })).toHaveAttribute('data-disabled', 'true');
  });

  it('allows opening callback when root dialog asks to open during pending deletion', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    useDeleteProductMock.mockReturnValue({
      isPending: true,
      mutateAsync: mutateAsyncMock,
    });

    render(<DeleteProductDialog open onOpenChange={onOpenChange} product={sampleProduct} />);

    await user.click(screen.getByRole('button', { name: 'mock-open-dialog' })); // Cabang ini memastikan hanya close(false) yang diblok saat pending.

    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('deletes product successfully, shows success toast, calls onDeleted, and closes dialog', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onDeleted = vi.fn();

    mutateAsyncMock.mockResolvedValue(undefined);

    render(
      <DeleteProductDialog
        open
        onOpenChange={onOpenChange}
        product={sampleProduct}
        onDeleted={onDeleted}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Delete Product' }));

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledWith('prod-1');
    });

    expect(addToastMock).toHaveBeenCalledWith({
      type: 'success',
      title: 'Product Deleted Successfully',
      message: '"Dining Chair" was deleted successfully.',
      duration: 6000,
    });
    expect(onDeleted).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('uses product name fallback in success toast when product name is missing', async () => {
    const user = userEvent.setup();

    mutateAsyncMock.mockResolvedValue(undefined);

    render(
      <DeleteProductDialog
        open
        onOpenChange={vi.fn()}
        product={{ ...sampleProduct, id: 'prod-2', name: undefined }}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Delete Product' }));

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledWith('prod-2');
    });

    expect(addToastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        message: '"Product" was deleted successfully.',
      })
    );
    expect(screen.getByText('Are you sure you want to delete "this product"? This action cannot be undone.')).toBeInTheDocument();
  });

  it('shows error toast when deletion fails and keeps dialog open', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onDeleted = vi.fn();
    const deleteError = new Error('Delete failed');

    mutateAsyncMock.mockRejectedValue(deleteError);
    getErrorMessageMock.mockReturnValue('Please try again in a few moments.');

    render(
      <DeleteProductDialog
        open
        onOpenChange={onOpenChange}
        product={sampleProduct}
        onDeleted={onDeleted}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Delete Product' }));

    await waitFor(() => {
      expect(getErrorMessageMock).toHaveBeenCalledWith(deleteError, 'Please try again in a few moments.');
    });

    expect(addToastMock).toHaveBeenCalledWith({
      type: 'error',
      title: 'Failed to delete product',
      message: 'Please try again in a few moments.',
      duration: 7000,
    });
    expect(onDeleted).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });
});
