import { useMemo } from 'react';
import { DataTable, type ColumnDef } from '@/shared/components/data-table';
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
        header: 'ID',
        accessorKey: 'id',
        cell: ({ row }) => row.original.id ?? DEFAULT_PLACEHOLDER,
      },
      {
        header: 'Name',
        accessorKey: 'name',
        cell: ({ row }) => row.original.name ?? DEFAULT_PLACEHOLDER,
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
        header: 'Updated',
        accessorKey: 'updatedAt',
        cell: ({ row }) => formatDate(row.original.updatedAt),
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
