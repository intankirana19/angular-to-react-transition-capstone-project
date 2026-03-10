import { DEFAULT_PLACEHOLDER } from '@/shared/constants/format';

type DateFormatOptions = {
  placeholder?: string;
  formatOptions?: Intl.DateTimeFormatOptions;
  locale?: string;
};

export function formatDate(
  value: string | number | Date | null | undefined,
  {
    placeholder = DEFAULT_PLACEHOLDER,
    formatOptions = { year: 'numeric', month: 'short', day: '2-digit' },
    locale = 'en-US',
  }: DateFormatOptions = {}
) {
  // 0 itu timestamp valid jadi jangan dianggap kosong
  if (value === null || value === undefined || value === '') return placeholder;
  // string whitespace dianggap empty input supaya hasil konsisten ke placeholder
  if (typeof value === 'string' && value.trim() === '') return placeholder;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return placeholder;

  return new Intl.DateTimeFormat(locale, formatOptions).format(date);
}
