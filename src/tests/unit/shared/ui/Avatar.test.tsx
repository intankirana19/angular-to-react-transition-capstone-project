import { render, screen } from '@testing-library/react';
import { Avatar } from '@/shared/ui/Avatar';

describe('Avatar', () => {
  it('renders the image when src is provided', () => {
    // kalau ada src valid harus tampilkan img beneran
    render(
      <Avatar
        src="https://example.com/avatar.png"
        alt="Jane Doe avatar"
        fallbackText="Jane Doe"
      />
    );

    const image = screen.getByRole('img', { name: 'Jane Doe avatar' });

    expect(image).toHaveAttribute('src', 'https://example.com/avatar.png');
    expect(image).toHaveAttribute('loading', 'lazy');
  });

  it('renders the fallback initial when there is no src and no placeholder', () => {
    // tanpa gambar fallback ke huruf awal biar tetap ada identitas visual
    render(<Avatar alt="Jane Doe avatar" fallbackText="Jane Doe" />);

    expect(screen.getByRole('img', { name: 'Jane Doe avatar' })).toBeInTheDocument();
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('renders the placeholder icon when placeholder mode is enabled', () => {
    // mode placeholder dipakai kalau memang mau icon generic bukan initial nama
    const { container } = render(
      <Avatar
        alt="Product image"
        fallbackText="Product"
        placeholder
        placeholderIcon="image"
      />
    );

    expect(screen.getByRole('img', { name: 'Product image' })).toBeInTheDocument();
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(screen.queryByText('P')).not.toBeInTheDocument();
  });

  it('renders the online status indicator when status is online', () => {
    // status online nambah dot kecil jadi cukup kunci class warnanya
    const { container } = render(
      <Avatar alt="Jane Doe avatar" fallbackText="Jane Doe" status="online" />
    );

    expect(container.querySelector('.bg-success-500')).toBeInTheDocument();
  });
});
