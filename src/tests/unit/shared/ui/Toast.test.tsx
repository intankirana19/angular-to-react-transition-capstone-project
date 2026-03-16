import { fireEvent, render, screen } from '@testing-library/react';
import { Toast } from '@/shared/ui/Toast';

describe('Toast', () => {
  beforeEach(() => {
    // fake timer dipakai buat ngetes auto close tanpa nunggu delay beneran
    vi.useFakeTimers();
  });

  afterEach(() => {
    // timer asli dibalikin lagi biar file test lain tetap aman
    vi.useRealTimers();
  });

  it('renders the title and message', () => {
    // pastiin isi toast tampil utuh di ui
    render(
      <Toast
        id="toast-1"
        type="success"
        title="Saved"
        message="Product saved successfully"
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('Product saved successfully')).toBeInTheDocument();
  });

  it('calls onClose with the toast id when the close button is clicked', () => {
    // tombol close harus ngirim id toast yang benar ke caller
    const onClose = vi.fn();

    render(
      <Toast
        id="toast-1"
        type="error"
        title="Failed"
        message="Something went wrong"
        onClose={onClose}
      />
    );

    const closeButton = screen.getByRole('button');

    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledWith('toast-1');
  });

  it('auto closes after the given duration', async () => {
    // duration dipakai buat nutup toast otomatis setelah beberapa saat
    const onClose = vi.fn();

    render(
      <Toast
        id="toast-1"
        type="info"
        title="Heads up"
        duration={1500}
        onClose={onClose}
      />
    );

    await vi.advanceTimersByTimeAsync(1499);

    expect(onClose).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);

    expect(onClose).toHaveBeenCalledWith('toast-1');
  });
});
