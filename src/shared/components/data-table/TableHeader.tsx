import { flexRender, type Header, type Table } from '@tanstack/react-table';
import { cn } from '@/shared/lib/cn';
import { ChevronsUpDown, ChevronUp, ChevronDown } from 'lucide-react';

interface TableHeaderProps<TData> {
  table: Table<TData>;
}

export function TableHeader<TData>({ table }: TableHeaderProps<TData>) {
  return (
    <thead className="bg-neutral-100/90 border-b border-neutral-200">
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              className={cn(
                'px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-neutral-600',
                header.column.getCanSort() && 'cursor-pointer select-none hover:text-neutral-800'
              )}
              // Klik header akan toggle asc/desc/none via handler dari TanStack Table
              onClick={header.column.getToggleSortingHandler()}
            >
              {header.isPlaceholder ? null : (
                <div className="flex items-center gap-2">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getCanSort() && <SortIndicator header={header} />}
                </div>
              )}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
}

function SortIndicator<TData>({ header }: { header: Header<TData, unknown> }) {
  // Icon indikator mengikuti state sorting aktif di kolom tersebut
  const sortDirection = header.column.getIsSorted();

  if (!sortDirection) {
    return <ChevronsUpDown className="w-4 h-4 text-neutral-500" />;
  }

  if (sortDirection === 'asc') {
    return <ChevronUp className="w-4 h-4 text-neutral-700" />;
  }

  return <ChevronDown className="w-4 h-4 text-neutral-700" />;
}
