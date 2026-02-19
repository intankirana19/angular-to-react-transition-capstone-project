import { type DateRangeValue } from '@/shared/types/dateRange';

// Utility reusable untuk clone date range supaya object aslinya tidak ikut kemutasi
export function cloneDateRange(range: DateRangeValue | undefined): DateRangeValue | undefined {
  if (!range) {
    return undefined;
  }

  return {
    from: range.from ? new Date(range.from) : undefined,
    to: range.to ? new Date(range.to) : undefined,
  };
}
