import type { DailyLog, DailyLogFilters } from '../types';

export function filterLogs(logs: DailyLog[], filters: DailyLogFilters): DailyLog[] {
  return logs.filter((log) => {
    if (filters.category && log.category !== filters.category) {
      return false;
    }
    if (filters.priority && log.priority !== filters.priority) {
      return false;
    }
    if (filters.status && log.status !== filters.status) {
      return false;
    }
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        log.title.toLowerCase().includes(query) || log.description.toLowerCase().includes(query)
      );
    }
    return true;
  });
}

export function sortLogsByDate(logs: DailyLog[], order: 'asc' | 'desc' = 'desc'): DailyLog[] {
  return [...logs].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
}

export function getCategoryLabel(category: DailyLog['category']): string {
  const labels: Record<DailyLog['category'], string> = {
    work: 'Work',
    personal: 'Personal',
    meeting: 'Meeting',
    development: 'Development',
    other: 'Other',
  };
  return labels[category];
}

export function getPriorityLabel(priority: DailyLog['priority']): string {
  const labels: Record<DailyLog['priority'], string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  };
  return labels[priority];
}

export function getStatusLabel(status: DailyLog['status']): string {
  const labels: Record<DailyLog['status'], string> = {
    pending: 'Pending',
    'in-progress': 'In Progress',
    completed: 'Completed',
  };
  return labels[status];
}

export function getPriorityColor(priority: DailyLog['priority']): string {
  const colors: Record<DailyLog['priority'], string> = {
    low: 'bg-success-50 text-success-700 border-success-200',
    medium: 'bg-warning-50 text-warning-700 border-warning-200',
    high: 'bg-danger-50 text-danger-700 border-danger-200',
  };
  return colors[priority];
}

export function getStatusColor(status: DailyLog['status']): string {
  const colors: Record<DailyLog['status'], string> = {
    pending: 'bg-neutral-50 text-neutral-700 border-neutral-200',
    'in-progress': 'bg-info-50 text-info-700 border-info-200',
    completed: 'bg-success-50 text-success-700 border-success-200',
  };
  return colors[status];
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
