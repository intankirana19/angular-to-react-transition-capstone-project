import { useMemo } from 'react';
import { DataTable, type ColumnDef } from '@/shared/components/data-table';
import { Avatar } from '@/shared/ui/Avatar';
import { DEFAULT_PLACEHOLDER, formatCurrency, formatDate } from '@/shared/lib/formatters';
import { type Product } from '../types';

interface ProductsTableProps {
  products: Product[];
  onRowClick?: (product: Product) => void;
}

// refer ke TeamsTable dr skafold
export function ProductsTable({ products, onRowClick }: ProductsTableProps) {
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
    ],
    []
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
