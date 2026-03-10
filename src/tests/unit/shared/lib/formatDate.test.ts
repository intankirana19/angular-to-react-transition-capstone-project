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
    // whitespace-only input juga dianggap kosong
    expect(formatDate('   ')).toBe(DEFAULT_PLACEHOLDER);
    expect(formatDate('not-a-date')).toBe(DEFAULT_PLACEHOLDER);
  });

  it('returns custom placeholder for invalid date', () => {
    // override placeholder juga harus berlaku di formatter tanggal
    expect(formatDate('invalid', { placeholder: 'n/a' })).toBe('n/a');
  });

  it('formats timestamp number input correctly', () => {
    // support input angka unix timestamp ms dari API atau cache lokal
    const timestamp = Date.UTC(2026, 2, 9, 12, 0, 0);
    const expected = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(new Date(timestamp));

    expect(formatDate(timestamp)).toBe(expected);
  });

  it('treats zero timestamp as valid date input', () => {
    // regression guard: angka 0 dulu sempat salah dianggap empty
    const expected = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(new Date(0));

    expect(formatDate(0)).toBe(expected);
  });

  it('formats Date object created from epoch zero', () => {
    // pastikan object Date epoch tetap masuk branch valid date
    const epochDate = new Date(0);
    const expected = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(epochDate);

    expect(formatDate(epochDate)).toBe(expected);
  });

  it('formats iso date consistently when timezone is specified', () => {
    // set timezone eksplisit biar output stabil lintas mesin developer/ci
    const iso = '2026-03-09T23:30:00.000Z';
    const expected = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'UTC',
    }).format(new Date(iso));

    expect(
      formatDate(iso, {
        formatOptions: { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' },
      })
    ).toBe(expected);
  });

  it('supports custom locale plus timezone together', () => {
    // cek kombinasi locale + timezone tetap diteruskan semua ke Intl formatter
    const iso = '2026-03-09T23:30:00.000Z';
    const expected = new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      timeZone: 'Asia/Jakarta',
    }).format(new Date(iso));

    expect(
      formatDate(iso, {
        locale: 'id-ID',
        formatOptions: {
          year: 'numeric',
          month: 'long',
          day: '2-digit',
          timeZone: 'Asia/Jakarta',
        },
      })
    ).toBe(expected);
  });

  it('returns placeholder when intl date options are invalid', () => {
    // invalid timezone bikin Intl melempar error jadi helper harus fallback aman
    expect(
      formatDate('2026-03-09T23:30:00.000Z', {
        formatOptions: { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Mars/Olympus' },
      })
    ).toBe(DEFAULT_PLACEHOLDER);
  });
});
