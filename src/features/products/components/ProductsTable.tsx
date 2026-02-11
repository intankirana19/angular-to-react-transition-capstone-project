import { useMemo } from 'react';
import { DataTable, type ColumnDef } from '@/shared/components/data-table';
import { Avatar } from '@/shared/ui/Avatar';
import { DEFAULT_PLACEHOLDER, formatCurrency, formatDate } from '@/shared/lib/formatters';
import { type Product } from '../types';

interface ProductsTableProps {
  products: Product[];
  onRowClick?: (product: Product) => void;
  onEdit?: (product: Product) => void;
}

// refer ke TeamsTable dr skafold
export function ProductsTable({ products, onRowClick, onEdit }: ProductsTableProps) {
  const columns = useMemo<ColumnDef<Product>[]>( // memoisasi biar columns disimpan sekali aja jd referencenya stabil utk DataTable
    () => [
      {
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
        header: 'Price',
        accessorKey: 'price',
        cell: ({ row }) => formatCurrency(row.original.price),
      },
      {
        header: 'Created',
        accessorKey: 'createdAt',
        cell: ({ row }) => formatDate(row.original.createdAt),
      },
      {
        header: 'Actions',
        accessorKey: 'id',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation(); // biar row click gak ikut.
              onEdit?.(row.original);
            }}
            className="text-ait-body-sm-semibold text-ait-primary-600 hover:text-ait-primary-700 transition-colors"
          >
            Edit
          </button>
        ),
        enableSorting: false,
      },
    ],
    [onEdit]
  );

  return (
    <DataTable
      data={products}
      columns={columns}
      enablePagination
      pageSize={10}
      enableSorting
      enableFiltering
      searchPlaceholder="Search products..."
      onRowClick={(row) => onRowClick?.(row.original)}
    />
  );
}
