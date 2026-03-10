import { DEFAULT_PLACEHOLDER } from '@/shared/constants/format';
import { formatCurrency } from '@/shared/lib/formatCurrency';

describe('formatCurrency', () => {
  it('formats numeric value with default options', () => {
    // expected dibikin dari Intl asli supaya assertion gak hardcoded ke string locale tertentu
    const expected = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(1234.5);

    expect(formatCurrency(1234.5)).toBe(expected);
  });

  it('uses custom locale and currency options', () => {
    // test ini memastikan opsi formatter dari caller benar-benar dipakai oleh helper
    const expected = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(15000);

    expect(
      formatCurrency(15000, {
        locale: 'id-ID',
        currency: 'IDR',
        maximumFractionDigits: 0,
      })
    ).toBe(expected);
  });

  it('returns placeholder for null undefined and NaN', () => {
    // semua nilai invalid numeric harus fallback ke placeholder default
    expect(formatCurrency(null)).toBe(DEFAULT_PLACEHOLDER);
    expect(formatCurrency(undefined)).toBe(DEFAULT_PLACEHOLDER);
    expect(formatCurrency(Number.NaN)).toBe(DEFAULT_PLACEHOLDER);
  });

  it('returns custom placeholder for invalid value', () => {
    // caller boleh override placeholder sesuai kebutuhan tampilan
    expect(formatCurrency(undefined, { placeholder: 'n/a' })).toBe('n/a');
  });

  it('returns placeholder for positive infinity', () => {
    // infinity bukan nominal valid jadi harus fallback ke placeholder
    expect(formatCurrency(Number.POSITIVE_INFINITY)).toBe(DEFAULT_PLACEHOLDER);
  });

  it('returns placeholder for negative infinity', () => {
    // negative infinity juga harus dianggap invalid sama seperti infinity biasa
    expect(formatCurrency(Number.NEGATIVE_INFINITY)).toBe(DEFAULT_PLACEHOLDER);
  });

  it('formats negative value correctly', () => {
    // penting buat kasus diskon/refund supaya angka minus tetap kebaca valid
    const expected = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(-99.99);

    expect(formatCurrency(-99.99)).toBe(expected);
  });

  it('formats very large value without fallback placeholder', () => {
    // jaga helper tetap aman buat nominal besar dan tidak false-invalid
    const largeValue = 9_999_999_999.99;
    const expected = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(largeValue);

    expect(formatCurrency(largeValue)).toBe(expected);
  });
});
