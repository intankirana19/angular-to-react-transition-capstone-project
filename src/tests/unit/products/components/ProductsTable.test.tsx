import { fireEvent, render, screen } from '@testing-library/react';
import { ProductsTable } from '@/features/products/components/ProductsTable';
import { type Product } from '@/features/products/types';

const { dataTableMock } = vi.hoisted(() => ({
  dataTableMock: vi.fn(),
}));

vi.mock('@/shared/components/data-table', () => ({
  DataTable: (props: {
    data: Product[];
    columns: Array<{
      header: string;
      accessorKey: string;
      cell: (args: { row: { original: Product } }) => React.ReactNode;
    }>;
    onRowClick?: (row: { original: Product }) => void;
  }) => {
    const { data, columns, onRowClick } = props;
    dataTableMock(props);
    return <div data-testid="datatable-mock">{`${data.length}-${columns.length}-${Boolean(onRowClick)}`}</div>;
  },
}));

describe('ProductsTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders cards and handles all mobile actions', () => {
    // data ini sengaja campur nilai lengkap dan kosong biar semua fallback ikut kena
    const products: Product[] = [
      {
        id: 'p-1',
        name: 'chair',
        price: 100,
        avatar: 'https://img.test/chair.png',
        material: 'wood',
        createdAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'p-2',
        name: undefined,
        price: undefined,
        avatar: '',
        material: '   ',
        createdAt: '',
      },
    ];

    const onRowClick = vi.fn();
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <ProductsTable products={products} onRowClick={onRowClick} onEdit={onEdit} onDelete={onDelete} />
    );

    // setiap card punya role button jadi bisa diakses keyboard
    const cards = screen.getAllByRole('button', { name: 'View product detail' });
    expect(cards).toHaveLength(2);

    // klik card harus nembak callback detail
    fireEvent.click(cards[0]);
    expect(onRowClick).toHaveBeenCalledWith(products[0]);

    // enter juga harus nembak callback detail
    fireEvent.keyDown(cards[0], { key: 'Enter' });
    expect(onRowClick).toHaveBeenCalledWith(products[0]);

    // spasi juga harus nembak callback detail
    fireEvent.keyDown(cards[0], { key: ' ' });
    expect(onRowClick).toHaveBeenCalledWith(products[0]);

    // selain enter dan spasi tidak boleh nembak callback
    const callCountBeforeEscape = onRowClick.mock.calls.length;
    fireEvent.keyDown(cards[0], { key: 'Escape' });
    expect(onRowClick).toHaveBeenCalledTimes(callCountBeforeEscape);

    // tombol edit delete mobile harus jalan tanpa ikut row click
    const editButtons = screen.getAllByRole('button', { name: 'Edit product' });
    const deleteButtons = screen.getAllByRole('button', { name: 'Delete product' });

    fireEvent.click(editButtons[0]);
    fireEvent.click(deleteButtons[0]);

    expect(onEdit).toHaveBeenCalledWith(products[0]);
    expect(onDelete).toHaveBeenCalledWith(products[0]);

    expect(screen.getAllByText('-').length).toBeGreaterThan(0); // data kosong harus pakai placeholder
  });

  it('wires desktop datatable props and executes desktop column cells', () => {
    // satu product cukup buat ngejalanin cell render desktop
    const product: Product = {
      id: 'p-3',
      name: 'desk',
      price: 250,
      avatar: 'https://img.test/desk.png',
      material: 'metal',
      createdAt: '2026-02-01T00:00:00.000Z',
    };

    const onRowClick = vi.fn();
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(<ProductsTable products={[product]} onRowClick={onRowClick} onEdit={onEdit} onDelete={onDelete} />);

    expect(screen.getByTestId('datatable-mock')).toBeInTheDocument(); // tes dulu apakah datatable mock kepanggil

    const dataTableProps = dataTableMock.mock.calls[0]?.[0] as {
      data: Product[];
      columns: Array<{
        header: string;
        accessorKey: string;
        cell: (args: { row: { original: Product } }) => React.ReactNode;
      }>;
      onRowClick?: (row: { original: Product }) => void;
      getRowClickLabel?: () => string;
      enablePagination?: boolean;
      enableSorting?: boolean;
      enableFiltering?: boolean;
    };

    // validasi wiring props desktop
    expect(dataTableProps.data).toEqual([product]);
    expect(dataTableProps.enablePagination).toBe(false);
    expect(dataTableProps.enableSorting).toBe(false);
    expect(dataTableProps.enableFiltering).toBe(false);
    expect(dataTableProps.getRowClickLabel?.()).toBe('View product detail');

    // callback row dari datatable harus dipetakan ke product asli
    dataTableProps.onRowClick?.({ original: product });
    expect(onRowClick).toHaveBeenCalledWith(product);

    // semua cell desktop kita eksekusi manual supaya logic formatter dan action ikut dites
    const productCell = dataTableProps.columns[0].cell({ row: { original: product } });
    const priceCell = dataTableProps.columns[1].cell({ row: { original: product } });
    const materialCell = dataTableProps.columns[2].cell({ row: { original: product } });
    const createdCell = dataTableProps.columns[3].cell({ row: { original: product } });
    const actionCell = dataTableProps.columns[4].cell({ row: { original: product } });

    render(
      <div>
        {productCell}
        <span>{priceCell}</span>
        <span>{materialCell}</span>
        <span>{createdCell}</span>
        {actionCell}
      </div>
    );

    expect(screen.getAllByText('desk').length).toBeGreaterThan(0);
    expect(screen.getAllByText('metal').length).toBeGreaterThan(0);

    const editButtons = screen.getAllByRole('button', { name: 'Edit product' });
    const deleteButtons = screen.getAllByRole('button', { name: 'Delete product' });
    fireEvent.click(editButtons.at(-1) as HTMLButtonElement);
    fireEvent.click(deleteButtons.at(-1) as HTMLButtonElement);

    expect(onEdit).toHaveBeenCalledWith(product);
    expect(onDelete).toHaveBeenCalledWith(product);
  });

  it('handles optional callbacks when desktop events are triggered', () => { // test ini buat jalur optional chaining saat callback tidak dikirim
    const product: Product = {
      id: 'p-4',
      name: undefined,
      price: undefined,
      avatar: '',
      material: '',
      createdAt: undefined,
    };

    render(<ProductsTable products={[product]} />);

    const dataTableProps = dataTableMock.mock.calls[0]?.[0] as {
      columns: Array<{
        cell: (args: { row: { original: Product } }) => React.ReactNode;
      }>;
      onRowClick?: (row: { original: Product }) => void;
    };

    expect(() => {
      dataTableProps.onRowClick?.({ original: product });
    }).not.toThrow();

    const actionCell = dataTableProps.columns[4].cell({ row: { original: product } });
    const productCell = dataTableProps.columns[0].cell({ row: { original: product } });  // ini tes fallback desktop buat name dan material saat data kosong
    const materialCell = dataTableProps.columns[2].cell({ row: { original: product } });

    render(
      <div>
        {productCell}
        <span>{materialCell}</span>
        {actionCell}
      </div>
    );

    expect(screen.getAllByText('-').length).toBeGreaterThan(0);

    const editButton = screen.getAllByRole('button', { name: 'Edit product' }).at(-1) as HTMLButtonElement;
    const deleteButton = screen.getAllByRole('button', { name: 'Delete product' }).at(-1) as HTMLButtonElement;

    expect(() => {
      fireEvent.click(editButton);
      fireEvent.click(deleteButton);
    }).not.toThrow();
  });
});
