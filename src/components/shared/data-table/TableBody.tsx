import { flexRender, type Row, type Table } from '@tanstack/react-table';
import { cn } from '@/lib/cn';

interface TableBodyProps<TData> {
  table: Table<TData>;
  onRowClick?: (row: Row<TData>) => void;
}

export function TableBody<TData>({ table, onRowClick }: TableBodyProps<TData>) {
  const rows = table.getRowModel().rows;

  if (rows.length === 0) {
    return (
      <tbody>
        <tr>
          <td
            colSpan={table.getAllColumns().length}
            className="px-4 py-12 text-center text-neutral-500"
          >
            No data available
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="bg-white divide-y divide-neutral-200">
      {rows.map((row) => (
        <tr
          key={row.id}
          onClick={() => onRowClick?.(row)}
          className={cn('hover:bg-neutral-50 transition-colors', onRowClick && 'cursor-pointer')}
        >
          {row.getVisibleCells().map((cell) => (
            <td key={cell.id} className="px-4 py-4 whitespace-nowrap text-sm text-neutral-900">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
