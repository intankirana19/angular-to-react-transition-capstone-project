import { render, screen } from '@testing-library/react';
import { LoadingState } from '@/shared/ui/LoadingState';

describe('LoadingState', () => {
  it('renders the default loading label inside a status region', () => {
    // pastiin state loading punya teks default dan role aksesibilitas yang tepat
    render(<LoadingState />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders a custom loading label when provided', () => {
    // caller bisa ganti label sesuai konteks loading yang lagi jalan
    render(<LoadingState label="Loading products..." />);

    expect(screen.getByText('Loading products...')).toBeInTheDocument();
  });

  it('uses full-screen layout when fullScreen is enabled', () => {
    // mode fullscreen dipakai buat page-level fallback yang nutup satu layar
    const { container } = render(<LoadingState fullScreen />);

    expect(container.firstChild).toHaveClass('min-h-screen');
  });
});
