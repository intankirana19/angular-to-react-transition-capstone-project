import { useMemo } from 'react';
import { DataTable, type ColumnDef } from '@/shared/components/data-table';
import { Avatar } from '@/shared/ui/Avatar';
import { DEFAULT_PLACEHOLDER, formatCurrency, formatDate } from '@/shared/lib/formatters';
import { Edit, Trash2 } from 'lucide-react';
import { type Product } from '../types';

interface ProductsTableProps {
  products: Product[]; // data rows yg ditampilkan di table.
  onRowClick?: (product: Product) => void; // callback saat row diklik.
  onEdit?: (product: Product) => void; // callback edit action per row.
  onDelete?: (product: Product) => void; // callback delete action per row.
}

// refer ke TeamsTable dr skafold
export function ProductsTable({ products, onRowClick, onEdit, onDelete }: ProductsTableProps) {
  const columns = useMemo<ColumnDef<Product>[]>( // memo columns supaya referensi stabil dan menghindari rerender table berlebih.
    () => [
      {
        // Sorting di-handle lewat query/service agar konsisten dengan infinite scroll.
        header: 'Product',
        accessorKey: 'name',
        cell: ({ row }) => {
          const name = row.original.name ?? DEFAULT_PLACEHOLDER;
          const avatar = row.original.avatar;
          return (
            <div className="flex items-center gap-3">
              <Avatar
                src={avatar}
                alt={`${name} image`}
                fallbackText={name}
                placeholder={!avatar}
                placeholderIcon="image"
                className="rounded-md"
              />
              <div className="font-medium text-neutral-900">{name}</div>
            </div>
          );
        },
        enableSorting: false,
      },
      {
        // Sorting kolom dimatikan di table (external sorting).
        header: 'Price',
        accessorKey: 'price',
        cell: ({ row }) => formatCurrency(row.original.price),
        enableSorting: false,
      },
      {
        // Sorting kolom dimatikan di table (external sorting).
        header: 'Material',
        accessorKey: 'material',
        cell: ({ row }) => row.original.material?.trim() || DEFAULT_PLACEHOLDER,
        enableSorting: false,
      },
      {
        // Sorting kolom dimatikan di table (external sorting).
        header: 'Created',
        accessorKey: 'createdAt',
        cell: ({ row }) => formatDate(row.original.createdAt),
        enableSorting: false,
      },
      {
        header: 'Actions',
        accessorKey: 'id',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // biar row click gak ikut
                onEdit?.(row.original);
              }}
              className="p-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 hover:shadow-sm"
              title="Edit product"
              aria-label="Edit product"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // supaya ga trigger row navigation saat klik delete
                onDelete?.(row.original);
              }}
              className="p-2 text-neutral-500 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-all duration-200 hover:shadow-sm"
              title="Delete product"
              aria-label="Delete product"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    [onDelete, onEdit]
  );

  return (
    <DataTable
      data={products}
      columns={columns} // definisi kolom table.
      enablePagination={false} // paging dihandle infinite scroll di page.
      // enablePagination // uncomment kalau mau pakai pagination
      // pageSize={10}
      enableSorting={false} // sorting source of truth ada di query/service, bukan sort lokal table.
      enableFiltering={false} // search/filter eksternal dari toolbar page.
      onRowClick={(row) => onRowClick?.(row.original)}
    />
  );
}


