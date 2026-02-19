import { flexRender, type Row, type Table } from '@tanstack/react-table';
import { cn } from '@/shared/lib/cn';

interface TableBodyProps<TData> {
  table: Table<TData>;
  onRowClick?: (row: Row<TData>) => void;
  getRowClickLabel?: (row: Row<TData>) => string;
}

export function TableBody<TData>({ table, onRowClick, getRowClickLabel }: TableBodyProps<TData>) {
  const rows = table.getRowModel().rows;

  if (rows.length === 0) {
    return (
      <tbody>
        <tr>
          <td
            colSpan={table.getAllColumns().length}
            className="px-4 py-12 text-center text-neutral-700"
          >
            No data available
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="bg-neutral-100 divide-y divide-neutral-300">
      {rows.map((row) => (
        <tr
          key={row.id}
          onClick={() => onRowClick?.(row)}
          aria-label={onRowClick ? getRowClickLabel?.(row) : undefined}
          title={onRowClick ? getRowClickLabel?.(row) : undefined}
          className={cn('transition-colors hover:bg-neutral-200/70', onRowClick && 'cursor-pointer')}
        >
          {row.getVisibleCells().map((cell) => (
            <td key={cell.id} className="px-4 py-4 whitespace-nowrap text-sm text-neutral-800">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
