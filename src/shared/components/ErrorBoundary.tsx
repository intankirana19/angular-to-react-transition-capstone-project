import { Component, ReactNode } from 'react';
import { getErrorMessage } from '@/shared/lib/error';
import { ErrorState } from '@/shared/ui/ErrorState';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
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
            fullScreen
            variant="danger"
            title="Something went wrong"
            message={getErrorMessage(this.state.error, 'An unexpected error occurred.')}
            actions={[
              {
                label: 'Reload Page',
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
