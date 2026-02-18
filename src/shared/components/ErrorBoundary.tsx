import { Component, ReactNode } from 'react';
import { getErrorMessage } from '@/shared/lib/error';

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

  private readonly handleTryAgain = () => { // coba render ulang dulu tanpa reload full page
    this.setState({ hasError: false, error: null }); 
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-screen items-center justify-center bg-neutral-50">
            <div className="rounded-lg bg-white p-8 shadow-lg max-w-md">
              <h1 className="text-2xl font-bold text-danger-600 mb-4">Something went wrong</h1>
              <p className="text-neutral-600 mb-4">
                {getErrorMessage(this.state.error, 'An unexpected error occurred.')}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={this.handleTryAgain}
                  className="w-full rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full rounded-md bg-neutral-200 px-4 py-2 text-neutral-800 hover:bg-neutral-300"
                >
                  Reload
                </button>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
