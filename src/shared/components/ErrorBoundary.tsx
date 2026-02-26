import { Component, ReactNode } from 'react';
import { getErrorMessage, getErrorTitle } from '@/shared/lib/error';
import { ErrorState } from '@/shared/ui/ErrorState';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  fullScreen?: boolean;
  title?: string;
  message?: string;
  reloadLabel?: string;
  onRetry?: () => void | Promise<unknown>;
  resolveReloadLabel?: (error: Error | null) => string; // optional kalau nanti mau label aksi beda per jenis error (misal 401 -> "Go to Login")
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private readonly handleRetry = () => {
    this.setState({ hasError: false, error: null }); // reset boundary dulu biar subtree bisa render ulang

    // guard utk pakai kalau ada handler custom (misal invalidate query)
    if (this.props.onRetry) {
      void this.props.onRetry();
      return;
    }

    window.location.reload(); // kalau ga ada custom retry handler, fallback ke hard refresh
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <ErrorState
            fullScreen={this.props.fullScreen ?? true}
            variant="danger"
            title={this.props.title ?? getErrorTitle(this.state.error, 'Something went wrong')} // default baca title dari objek error; tetap bisa dioverride jika butuh copy statis
            message={this.props.message ?? getErrorMessage(this.state.error, 'An unexpected error occurred.')} // message juga ambil dari error biar page ga perlu branch error lokal
            actions={[
              {
                label: this.props.reloadLabel ?? this.props.resolveReloadLabel?.(this.state.error) ?? 'Reload Page',
                onClick: this.handleRetry,
                variant: 'primary',
              },
            ]}
          />
        )
      );
    }

    return this.props.children;
  }
}
