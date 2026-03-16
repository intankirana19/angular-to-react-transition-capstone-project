import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CircleAlert } from 'lucide-react';
import { ErrorState } from '@/shared/ui/ErrorState';

describe('ErrorState', () => {
  it('renders title and message inside an alert region', () => {
    // pastiin alertnya kebaca jelas di ui dan aksesibilitasnya tetap ada
    render(<ErrorState title="Failed to load" message="Please try again later" />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Failed to load')).toBeInTheDocument();
    expect(screen.getByText('Please try again later')).toBeInTheDocument();
  });

  it('renders action buttons and calls the action handler when clicked', async () => {
    // action dipakai buat retry atau navigasi jadi wiring click-nya penting
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(
      <ErrorState
        title="Failed to load"
        message="Please try again later"
        actions={[{ label: 'Retry', onClick: onRetry, variant: 'primary' }]}
      />
    );

    const button = screen.getByRole('button', { name: 'Retry' });

    await user.click(button);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('applies warning styling and full-screen layout when requested', () => {
    // variant warning dan mode fullscreen dipakai buat tampilan error yang konteksnya beda
    const { container } = render(
      <ErrorState
        title="Heads up"
        message="This is a warning state"
        variant="warning"
        fullScreen
      />
    );

    expect(screen.getByRole('alert')).toHaveClass('bg-warning-50');
    expect(container.firstChild).toHaveClass('min-h-screen');
  });

  it('renders a custom icon when one is provided', () => {
    // custom icon dipakai kalau mau beda tampilan tanpa ubah struktur komponen
    render(
      <ErrorState
        title="Heads up"
        message="Custom icon active"
        icon={<CircleAlert data-testid="custom-error-icon" className="h-6 w-6" />}
      />
    );

    expect(screen.getByTestId('custom-error-icon')).toBeInTheDocument();
  });
});
