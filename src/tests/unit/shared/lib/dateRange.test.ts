import { cloneDateRange } from '@/shared/lib/dateRange';

describe('cloneDateRange', () => {
  it('returns undefined when range is missing', () => {
    // helper harus aman dipanggil saat belum ada date filter
    expect(cloneDateRange(undefined)).toBeUndefined();
  });

  it('clones from and to dates without keeping original references', () => {
    // penting supaya draft dialog ga mutasi object range aktif dari page
    const original = {
      from: new Date('2026-03-01T00:00:00.000Z'),
      to: new Date('2026-03-10T00:00:00.000Z'),
    };

    const cloned = cloneDateRange(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned?.from).not.toBe(original.from);
    expect(cloned?.to).not.toBe(original.to);
  });

  it('keeps undefined side intact while still cloning existing date', () => {
    // partial range juga harus tetap valid karena user bisa pilih from duluan
    const original = {
      from: new Date('2026-03-01T00:00:00.000Z'),
      to: undefined,
    };

    const cloned = cloneDateRange(original);

    expect(cloned).toEqual(original);
    expect(cloned?.from).not.toBe(original.from);
    expect(cloned?.to).toBeUndefined();
  });
});
