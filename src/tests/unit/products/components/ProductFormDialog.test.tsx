import { render, screen } from '@testing-library/react';
import { ProductFormDialog } from '@/features/products/components/ProductFormDialog';
import { type ProductInputValues } from '@/features/products/types';

// penambahan mock shared dialog untuk solve issue isolasi dari Radix Dialog agar test stabil dan fokus ke logic ProductFormDialog.
vi.mock('@/shared/ui/Dialog', () => ({
  Dialog: (props: { open?: boolean; children?: React.ReactNode }) =>
    props.open ? <div data-testid="dialog-root">{props.children}</div> : null,
  DialogContent: (props: { children?: React.ReactNode }) => <div>{props.children}</div>,
  DialogHeader: (props: { children?: React.ReactNode }) => <div>{props.children}</div>,
  DialogTitle: (props: { children?: React.ReactNode }) => <h2>{props.children}</h2>,
  DialogDescription: (props: { children?: React.ReactNode }) => <p>{props.children}</p>,
  DialogBody: (props: { children?: React.ReactNode }) => <div>{props.children}</div>,
}));

const productFormSpy = vi.fn(); // spy ini buat nyatet ProductForm dipanggil pakai props apa aja

// ProductForm asli kita ganti dummy biar test fokus ke logic dialog
vi.mock('@/features/products/components/ProductForm', () => ({
  ProductForm: (props: {
    productId?: string;
    initialValues?: Partial<ProductInputValues>;
    mode?: 'create' | 'edit';
    onSuccess?: () => void | Promise<void>;
  }) => {
    productFormSpy(props); // simpan props buat verifikasi di test
    return <div data-testid="product-form-mock" />; // dummy marker biar gampang dicek ada/tidak
  },
}));

describe('ProductFormDialog', () => {
  it('renders create mode title and form', () => {
    render(<ProductFormDialog open onOpenChange={vi.fn()} mode="create" />); // misal dialog dibuka dalam mode create

    expect(screen.getByText('Add Product')).toBeInTheDocument();
    expect(screen.getByText('Fill the form to add a new product.')).toBeInTheDocument();
    expect(screen.getByTestId('product-form-mock')).toBeInTheDocument();
  });

  it('shows fallback message when edit mode has no product', () => {
    render(<ProductFormDialog open onOpenChange={vi.fn()} mode="edit" />); // misal mode edit tapi productnya gak ada

    expect(screen.getByText('Edit Product')).toBeInTheDocument();
    expect(screen.getByText('Product not found.')).toBeInTheDocument();
    expect(screen.queryByTestId('product-form-mock')).not.toBeInTheDocument();
  });

  it('passes mapped initial values to form in edit mode', () => {
    const product = {
      id: 'p-1',
      name: 'Chair',
      price: 50,
      avatar: 'https://img.test/chair.png',
      material: 'Wood',
      description: 'Simple chair',
      createdAt: '2026-02-01T00:00:00.000Z',
    };

    render(<ProductFormDialog open onOpenChange={vi.fn()} mode="edit" product={product} />); // misal mode edit dengan data product lengkap

    expect(productFormSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        productId: 'p-1',
        mode: 'edit',
        initialValues: {
          name: 'Chair',
          price: 50,
          avatar: 'https://img.test/chair.png',
          material: 'Wood',
          description: 'Simple chair',
        },
      })
    );
  });

  it('maps missing product fields to safe defaults', () => {
    const product = {
      id: 'p-2',
      name: undefined,
      price: undefined,
      avatar: undefined,
      material: undefined,
      description: undefined,
      createdAt: '2026-02-05T00:00:00.000Z',
    };

    render(<ProductFormDialog open onOpenChange={vi.fn()} mode="edit" product={product} />);

    expect(productFormSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        productId: 'p-2',
        initialValues: {
          name: '',
          price: 0,
          avatar: '',
          material: '',
          description: '',
        },
      })
    );
  });

  it('closes dialog when ProductForm calls onSuccess', async () => {
    const onOpenChange = vi.fn();
    const product = {
      id: 'p-3',
      name: 'Sofa',
      price: 300,
      avatar: '',
      material: 'Fabric',
      description: '',
      createdAt: '2026-02-07T00:00:00.000Z',
    };

    render(<ProductFormDialog open onOpenChange={onOpenChange} mode="edit" product={product} />);

    const formProps = productFormSpy.mock.calls.at(-1)?.[0] as
      | { onSuccess?: () => void | Promise<void> }
      | undefined; // ambil props terakhir yang dikirim ke productform mock

    expect(formProps?.onSuccess).toBeTypeOf('function');

    await formProps?.onSuccess?.();

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
