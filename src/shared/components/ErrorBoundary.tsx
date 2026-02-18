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
                onClick: () => window.location.reload(),
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
