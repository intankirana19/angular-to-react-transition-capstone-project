import { cn } from '@/shared/lib/cn';

describe('cn', () => {
  it('joins static and conditional class values', () => {
    // helper ini harus tetap nerima pola campuran string dan conditional class
    const isVisible = true;
    const isHidden = false;

    expect(cn('base', isVisible && 'visible', isHidden && 'hidden', ['px-4'])).toBe(
      'base visible px-4'
    );
  });

  it('keeps the last conflicting tailwind utility', () => {
    // konflik utility tailwind harus di-merge supaya class akhir tidak saling tabrak
    expect(cn('px-2 text-sm', 'px-4', 'text-lg')).toBe('px-4 text-lg');
  });

  it('ignores falsy values cleanly', () => {
    // sering dipakai dengan ternary atau flag boolean jadi falsy input harus aman
    expect(cn(undefined, null, false, '', 'flex')).toBe('flex');
  });
});
