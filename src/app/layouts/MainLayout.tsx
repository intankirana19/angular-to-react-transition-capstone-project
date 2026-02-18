import { ReactNode, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useUiStore } from '@/app/store/useUIStore';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { LoadingState } from '@/shared/ui/LoadingState';
import { Button } from '@/shared/ui/Button';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children?: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const queryClient = useQueryClient();
  const { sidebarOpen, toggleSidebar } = useUiStore();

  return (
    <div className="flex h-screen bg-neutral-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-neutral-200 px-6 py-4">
          <div className="flex items-center justify-between">
            {!sidebarOpen && (
              <Button variant="text" size="sm" onClick={toggleSidebar}>
                ☰
              </Button>
            )}
            <h1 className="text-xl font-semibold">AIT React Scaffold</h1>
            <div />
          </div>
        </header>

        {/* INFINITE[6]: id ini tandai area scroll utama yang dipantau hook */}
        <main id="app-main-scroll" className="flex-1 overflow-y-auto p-6">
          {/* boundary di level konten: kalau page error, sidebar/header tetap tampil */}
          <ErrorBoundary
            key={location.key}
            fullScreen={false}
            title="Something went wrong"
            message="Failed to load this page. Try reloading or open another menu."
            reloadLabel="Retry"
            onRetry={async () => {
              await queryClient.resetQueries(); // retry konten aja, reset state error query trus refetch query aktif
            }}
          >
            {/* suspense khusus outlet biar loader ga full page (atau untuk handle fallback react query jika ada yg pakai useSuspenseQuery), `location.key` reset boundary tiap navigasi biar fallback muncul per perpindahan route (ga freeze dipage asal) */}
            <Suspense key={location.key} fallback={<LoadingState label="Loading page..." />}>
              {children ?? <Outlet />}
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
