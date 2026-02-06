// import { format } from 'date-fns';

export const DEFAULT_PLACEHOLDER = '-';

type PriceFormatOptions = {
  locale?: string;
  currency?: string;
  maximumFractionDigits?: number;
  placeholder?: string;
};

export function formatCurrency(
  value: number | null | undefined,
  {
    locale = 'en-US',
    currency = 'USD',
    maximumFractionDigits = 2,
    placeholder = DEFAULT_PLACEHOLDER,
  }: PriceFormatOptions = {}
) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return placeholder;
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits,
  }).format(value);
}


export function formatDate(
  value: string | number | Date | null | undefined,
  {
    placeholder = DEFAULT_PLACEHOLDER,
    formatOptions = { year: 'numeric', month: 'short', day: '2-digit' },
    locale = 'en-US',
  }: {
    placeholder?: string;
    formatOptions?: Intl.DateTimeFormatOptions;
    locale?: string;
  } = {}
) {
  if (!value) return placeholder;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return placeholder;
  return new Intl.DateTimeFormat(locale, formatOptions).format(date);
}



// versi pakai external lib date-fns refer TeamTable dr skafold?
// type DateFormatOptions = {
//   placeholder?: string;
//   formatString?: string;
// };
// export function formatDate(
//   value: string | number | Date | null | undefined,
//   { placeholder = DEFAULT_PLACEHOLDER, formatString = 'MMM d, yyyy' }: DateFormatOptions = {}
// ) {
//   if (!value) {
//     return placeholder;
//   }

//   const date = value instanceof Date ? value : new Date(value);
//   if (Number.isNaN(date.getTime())) {
//     return placeholder;
//   }

//   return format(date, formatString);
// }
