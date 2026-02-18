import { Component, ReactNode } from 'react';
import { getErrorMessage } from '@/shared/lib/error';
import { ErrorState } from '@/shared/ui/ErrorState';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  fullScreen?: boolean;
  title?: string;
  message?: string;
  reloadLabel?: string;
  onRetry?: () => void | Promise<unknown>;
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

    // kalau tidak ada baru fallback ke hard refresh.
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <ErrorState
            fullScreen={this.props.fullScreen ?? true}
            variant="danger"
            title={this.props.title ?? 'Something went wrong'}
            message={this.props.message ?? getErrorMessage(this.state.error, 'An unexpected error occurred.')}
            actions={[
              {
                label: this.props.reloadLabel ?? 'Reload Page',
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
