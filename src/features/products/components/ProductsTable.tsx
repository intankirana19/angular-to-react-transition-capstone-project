import { useMemo } from 'react';
import { DataTable, type ColumnDef } from '@/shared/components/data-table';
import { Avatar } from '@/shared/ui/Avatar';
import { DEFAULT_PLACEHOLDER, formatCurrency, formatDate } from '@/shared/lib/formatters';
import { Edit, Trash2 } from 'lucide-react';
import { type Product } from '../types';

interface ProductsTableProps {
  products: Product[]; // data row yang mau ditampilin
  onRowClick?: (product: Product) => void; // callback kalau row dipilih
  onEdit?: (product: Product) => void; // callback tombol edit
  onDelete?: (product: Product) => void; // callback tombol delete
}

// tabel desktop pakai datatable shared
export function ProductsTable({ products, onRowClick, onEdit, onDelete }: ProductsTableProps) {
  // memo kolom biar referensi stabil dan render lebih ringan
  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        // sorting diset dari query jadi di kolom dimatikan
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
        // sorting lokal dimatikan karena source dari service
        header: 'Price',
        accessorKey: 'price',
        cell: ({ row }) => formatCurrency(row.original.price),
        enableSorting: false,
      },
      {
        // sorting lokal dimatikan karena source dari service
        header: 'Material',
        accessorKey: 'material',
        cell: ({ row }) => row.original.material?.trim() || DEFAULT_PLACEHOLDER,
        enableSorting: false,
      },
      {
        // sorting lokal dimatikan karena source dari service
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
                e.stopPropagation(); // cegah row click saat klik action
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
                e.stopPropagation(); // cegah row click saat klik action
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
    <>
      {/* mode mobile pakai card biar lebih padat dan gampang dibaca */}
      <div className="space-y-3 md:hidden">
        {products.map((product) => {
          const name = product.name ?? DEFAULT_PLACEHOLDER;
          const material = product.material?.trim() || DEFAULT_PLACEHOLDER;
          return (
            <article
              key={product.id}
              className="rounded-lg border border-neutral-200 bg-white p-3 shadow-sm"
              role="button"
              tabIndex={0}
              onClick={() => onRowClick?.(product)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onRowClick?.(product);
                }
              }}
            >
              <div className="flex items-center gap-3">
                <Avatar
                  src={product.avatar}
                  alt={`${name} image`}
                  fallbackText={name}
                  placeholder={!product.avatar}
                  placeholderIcon="image"
                  className="rounded-md"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-neutral-900">{name}</h3>
                  <p className="text-xs text-neutral-600">{formatCurrency(product.price)}</p>
                  <p className="truncate text-xs text-neutral-600">{material}</p>
                  <p className="text-xs text-neutral-500">{formatDate(product.createdAt)}</p>
                </div>
                <div className="flex items-center justify-center gap-1 self-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(); // biar card click ga ikut kepanggil
                      onEdit?.(product);
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
                      e.stopPropagation(); // biar card click ga ikut kepanggil
                      onDelete?.(product);
                    }}
                    className="p-2 text-neutral-500 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-all duration-200 hover:shadow-sm"
                    title="Delete product"
                    aria-label="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* mode desktop balik pakai datatable shared */}
      <div className="hidden md:block">
        <DataTable
          data={products}
          columns={columns} // definisi kolom tabel
          enablePagination={false} // pagination dihandle infinite scroll
          // enablePagination // aktifin ini kalau mau pakai pagination native
          // pageSize={10}
          enableSorting={false} // source sorting ada di query service
          enableFiltering={false} // search filter dikontrol dari page
          onRowClick={(row) => onRowClick?.(row.original)}
        />
      </div>
    </>
  );
}
