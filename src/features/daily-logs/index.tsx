import { Pagination } from '@/shared/ui/Pagination';
import { SimpleSelect } from '@/shared/ui/SimpleSelect';
import { ToastContainer } from '@/shared/ui/Toast';
import { useToast } from '@/shared/hooks/useToast';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { CreateLogDialog } from './components/CreateLogDialog';
import { DailyLogsTable } from './components/DailyLogsTable';
import { DeleteLogDialog } from './components/DeleteLogDialog';
import { EditLogDialog } from './components/EditLogDialog';
import { ViewLogDialog } from './components/ViewLogDialog';
import { mockDailyLogs } from './data/mockLogs';
import type { CreateDailyLogInput, DailyLog, DailyLogFilters, UpdateDailyLogInput } from './types';
import { filterLogs, generateId, sortLogsByDate } from './utils/helpers';

export default function DailyLogsPage() {
  // State management
  const [logs, setLogs] = useState<DailyLog[]>(mockDailyLogs);
  const [filters, setFilters] = useState<DailyLogFilters>({});
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Toast notifications
  const { toasts, success, error } = useToast();

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<DailyLog | null>(null);

  // CRUD Operations
  const handleCreate = (input: CreateDailyLogInput) => {
    try {
      const newLog: DailyLog = {
        ...input,
        id: generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setLogs([newLog, ...logs]);
      setCreateDialogOpen(false);
      success('Log created successfully', `"${input.title}" has been added to your daily logs.`);
    } catch {
      error('Failed to create log', 'An error occurred while creating the log. Please try again.');
    }
  };

  const handleEdit = (log: DailyLog) => {
    setSelectedLog(log);
    setEditDialogOpen(true);
  };

  const handleUpdate = (id: string, updates: UpdateDailyLogInput) => {
    try {
      setLogs(
        logs.map((log) => (log.id === id ? { ...log, ...updates, updatedAt: new Date() } : log))
      );
      setEditDialogOpen(false);
      success('Log updated successfully', 'Your changes have been saved.');
    } catch {
      error('Failed to update log', 'An error occurred while updating the log. Please try again.');
    }
  };

  const handleDelete = (log: DailyLog) => {
    setSelectedLog(log);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = (id: string) => {
    try {
      const logToDelete = logs.find((log) => log.id === id);
      setLogs(logs.filter((log) => log.id !== id));
      setDeleteDialogOpen(false);
      success(
        'Log deleted successfully',
        `"${logToDelete?.title}" has been removed from your daily logs.`
      );
    } catch {
      error('Failed to delete log', 'An error occurred while deleting the log. Please try again.');
    }
  };

  const handleView = (log: DailyLog) => {
    setSelectedLog(log);
    setViewDialogOpen(true);
  }

  // Filter and sort logs
  const filteredLogs = filterLogs(logs, { ...filters, searchQuery: searchQuery || undefined });
  const sortedLogs = sortLogsByDate(filteredLogs);

  // Pagination calculations
  const totalPages = Math.ceil(sortedLogs.length / itemsPerPage);
  const paginatedLogs = sortedLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when filters change
  const handleFilterChange = (newFilters: DailyLogFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-ait-h1 text-ait-neutral-900 mb-2">Daily Logs</h1>
        <p className="text-ait-body-lg-regular text-ait-neutral-600">
          Track and manage your daily activities, tasks, and notes
        </p>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-xl border border-ait-neutral-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ait-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search logs..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-ait-neutral-300 text-ait-body-md-regular placeholder:text-ait-neutral-500 focus:outline-none focus:ring-2 focus:ring-ait-primary-500 focus:border-transparent transition-colors bg-white"
              />
            </div>

            {/* Category Filter */}
            <SimpleSelect
              value={filters.category || 'all'}
              onChange={(value) =>
                handleFilterChange({
                  ...filters,
                  category: value === 'all' ? undefined : (value as DailyLog['category']),
                })
              }
              options={[
                { value: 'all', label: 'All Categories' },
                { value: 'work', label: 'Work' },
                { value: 'personal', label: 'Personal' },
                { value: 'meeting', label: 'Meeting' },
                { value: 'development', label: 'Development' },
                { value: 'other', label: 'Other' },
              ]}
              placeholder="Category"
              className="w-full sm:w-40"
            />

            {/* Priority Filter */}
            <SimpleSelect
              value={filters.priority || 'all'}
              onChange={(value) =>
                handleFilterChange({
                  ...filters,
                  priority: value === 'all' ? undefined : (value as DailyLog['priority']),
                })
              }
              options={[
                { value: 'all', label: 'All Priorities' },
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
              ]}
              placeholder="Priority"
              className="w-full sm:w-40"
            />

            {/* Status Filter */}
            <SimpleSelect
              value={filters.status || 'all'}
              onChange={(value) =>
                handleFilterChange({
                  ...filters,
                  status: value === 'all' ? undefined : (value as DailyLog['status']),
                })
              }
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'pending', label: 'Pending' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
              ]}
              placeholder="Status"
              className="w-full sm:w-40"
            />
          </div>

          {/* Create Button */}
          <button
            onClick={() => setCreateDialogOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-ait-body-md-semibold text-white bg-ait-primary-500 rounded-lg hover:bg-ait-primary-600 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Create Log
          </button>
        </div>

        {/* Results count */}
        {(searchQuery || filters.category || filters.priority || filters.status) && (
          <div className="flex items-center justify-between px-4 py-3 mt-4 bg-ait-primary-50 rounded-lg border border-ait-primary-200">
            <p className="text-ait-body-md-regular text-ait-neutral-700">
              <span className="font-semibold text-ait-primary-600">{sortedLogs.length}</span> of{' '}
              {logs.length} logs found
            </p>
            <button
              onClick={() => {
                handleSearchChange('');
                handleFilterChange({});
              }}
              className="text-ait-body-md-semibold text-ait-primary-600 hover:text-ait-primary-700 transition-colors underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-ait-neutral-200 shadow-sm overflow-hidden">
        <DailyLogsTable logs={paginatedLogs} onEdit={handleEdit} onDelete={handleDelete} onView={handleView} />

        {/* Pagination */}
        {sortedLogs.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={sortedLogs.length}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}
      </div>

      {/* Dialogs */}
      <CreateLogDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreate}
      />

      <ViewLogDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        log={selectedLog}
      />

      <EditLogDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        log={selectedLog}
        onSubmit={handleUpdate}
      />

      <DeleteLogDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        log={selectedLog}
        onConfirm={handleConfirmDelete}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} />
    </div>
  );
}
