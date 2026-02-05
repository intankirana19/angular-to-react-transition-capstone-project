import { type ColumnDef } from '@tanstack/react-table';
import { DataTable, TableRowActions } from '@/shared/components/data-table';
import { Avatar } from '@/shared/ui/Avatar';
import { Badge } from '@/shared/ui/Badge';
import { Checkbox } from '@/shared/ui/Checkbox';
import { ArrowUpDown, SlidersVertical } from 'lucide-react';
import { type TeamMember } from '../types';
import { useMemo } from 'react';

interface TeamTableProps {
  data: TeamMember[];
  onEdit?: (member: TeamMember) => void;
  onDelete?: (member: TeamMember) => void;
}

export function TeamTable({ data, onEdit, onDelete }: TeamTableProps) {
  const columns = useMemo<ColumnDef<TeamMember>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            aria-label="Select all"
            checked={
              table.getIsAllPageRowsSelected()
                ? true
                : table.getIsSomePageRowsSelected()
                  ? 'indeterminate'
                  : false
            }
            onChange={table.getToggleAllPageRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            aria-label={`Select ${row.id}`}
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            disabled={!row.getCanSelect()}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => {
          const member = row.original;
          return (
            <div className="flex items-center gap-3">
              <Avatar
                src={member.avatar}
                alt={member.name}
                fallbackText={member.name}
                className="rounded-full"
              />
              <div>
                <div className="font-medium text-neutral-900">{member.name}</div>
                <div className="text-sm text-neutral-500">@{member.username}</div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <Badge variant={status === 'active' ? 'success' : 'default'} type="dot">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => <span className="text-sm text-neutral-700">{row.original.role}</span>,
      },
      {
        accessorKey: 'email',
        header: 'Email address',
        cell: ({ row }) => <span className="text-sm text-neutral-600">{row.original.email}</span>,
      },
      {
        accessorKey: 'labels',
        header: 'Label',
        cell: ({ row }) => {
          const labels = row.original.labels;
          const maxVisible = 3;
          const visibleLabels = labels.slice(0, maxVisible);
          const remainingCount = labels.length - maxVisible;

          return (
            <div className="flex items-center gap-1">
              {visibleLabels.map((label, index) => (
                <Badge key={index} variant="info" size="sm" className="rounded-md">
                  {label}
                </Badge>
              ))}
              {remainingCount > 0 && (
                <span className="text-xs text-neutral-500">+{remainingCount}</span>
              )}
            </div>
          );
        },
        enableSorting: false,
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <TableRowActions
            row={row}
            onEdit={onEdit ? () => onEdit(row.original) : undefined}
            onDelete={onDelete ? () => onDelete(row.original) : undefined}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [onEdit, onDelete]
  );

  return (
    <DataTable
      data={data}
      columns={columns}
      enableRowSelection
      enablePagination
      enableSorting
      enableFiltering
      searchPlaceholder="Search team members..."
      actions={[
        {
          label: 'Filter',
          variant: 'secondary' as const,
          className:
            'border-neutral-200 text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100',
          onClick: () => console.log('Filter'),
          icon: <SlidersVertical className="w-4 h-4" />,
        },
        {
          label: 'Sort by',
          variant: 'secondary' as const,
          className:
            'border-neutral-200 text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100',
          onClick: () => console.log('Sort by'),
          icon: <ArrowUpDown className="w-4 h-4" />,
        },
      ]}
      bulkActions={[
        {
          label: 'Delete Selected',
          variant: 'destructive-primary' as const,
          onClick: (selectedRows) => {
            const members = selectedRows.map((row) => row.original);
            console.log('Delete', members);
          },
        },
      ]}
    />
  );
}
