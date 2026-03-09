import { DEFAULT_PLACEHOLDER } from '@/shared/constants/format';

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
