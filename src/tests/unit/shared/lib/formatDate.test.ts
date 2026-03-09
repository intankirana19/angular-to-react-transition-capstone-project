import { DEFAULT_PLACEHOLDER } from '@/shared/constants/format';
import { formatDate } from '@/shared/lib/formatDate';

describe('formatDate', () => {
  it('formats valid date value with default options', () => {
    // pake object Date supaya jelas branch valid date yang diuji
    const date = new Date('2026-03-09T12:00:00.000Z');
    const expected = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(date);

    expect(formatDate(date)).toBe(expected);
  });

  it('supports custom format options and locale', () => {
    // cek opsi locale dan formatOptions bisa ngubah output sesuai konfigurasi caller
    const date = new Date('2026-03-09T12:00:00.000Z');
    const expected = new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);

    expect(
      formatDate(date, {
        locale: 'id-ID',
        formatOptions: { year: 'numeric', month: '2-digit', day: '2-digit' },
      })
    ).toBe(expected);
  });

  it('returns placeholder for empty or invalid date values', () => {
    // branch guard invalid value harus konsisten balik placeholder default
    expect(formatDate(undefined)).toBe(DEFAULT_PLACEHOLDER);
    expect(formatDate(null)).toBe(DEFAULT_PLACEHOLDER);
    expect(formatDate('')).toBe(DEFAULT_PLACEHOLDER);
    expect(formatDate('not-a-date')).toBe(DEFAULT_PLACEHOLDER);
  });

  it('returns custom placeholder for invalid date', () => {
    // override placeholder juga harus berlaku di formatter tanggal
    expect(formatDate('invalid', { placeholder: 'n/a' })).toBe('n/a');
  });
});
