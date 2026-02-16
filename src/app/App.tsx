import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter } from 'react-router-dom';
import { queryClient } from '@/shared/lib/queryClient';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { useToast } from '@/shared/hooks/useToast';
import { ToastContainer } from '@/shared/ui/Toast';
import { AppRoutes } from './routes';

export function App() {
  const { toasts } = useToast(); // toast di root app biar ga hilang saat unamount/pindah halaman.

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppRoutes />
          <ToastContainer toasts={toasts} />  {/* satu container global toast menghindari duplikasi */}
        </BrowserRouter>
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
