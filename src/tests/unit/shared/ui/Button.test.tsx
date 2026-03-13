import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/shared/ui/Button';

describe('Button', () => {
  it('renders its children with default button semantics', () => {
    // kontrak paling dasar: teks anak tampil dan elemen dasarnya tetap button
    render(<Button>Save</Button>);

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('does not call onClick when disabled', async () => {
    // disabled harus nahan interaksi user supaya action ga kepanggil
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Save' });

    expect(button).toBeDisabled();

    await user.click(button);

    expect(onClick).not.toHaveBeenCalled();
  });

  it('applies variant and size classes', () => {
    // test ini ngunci beberapa class penting dari cva supaya variant ga diam-diam geser
    render(
      <Button variant="secondary" size="sm">
        Filter
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Filter' });

    expect(button).toHaveClass('border-primary-500');
    expect(button).toHaveClass('h-8');
  });

  it('applies icon-only sizing classes when isIconOnly is true', () => {
    // mode icon-only punya class khusus yang beda dari button biasa
    render(
      <Button isIconOnly aria-label="Open menu">
        <span>icon</span>
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Open menu' });

    expect(button).toHaveClass('px-0');
    expect(button).toHaveClass('aspect-square');
  });

  it('renders the child element when asChild is enabled', () => {
    // asChild penting buat kasus link/button shared tanpa wrapper elemen tambahan
    render(
      <Button asChild>
        <a href="/products">Go to products</a>
      </Button>
    );

    const link = screen.getByRole('link', { name: 'Go to products' });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/products');
    expect(link).toHaveClass('inline-flex');
  });
});
