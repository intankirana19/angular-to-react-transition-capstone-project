import { ReactNode, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Menu } from 'lucide-react';
import { useUiStore } from '@/app/store/useUIStore';
import { useSyncSidebarWithViewport } from '@/app/hooks/useSyncSidebarWithViewport';
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
  const { sidebarOpen, sidebarCollapsed, toggleSidebar } = useUiStore();
  const shouldHideTitleOnDesktop = sidebarOpen && !sidebarCollapsed;
  useSyncSidebarWithViewport();

  return (
    <div className="flex h-screen bg-neutral-50">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="border-b border-neutral-200 bg-white px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between">
            <Button
              className="lg:hidden"
              variant="text"
              size="sm"
              isIconOnly
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
            {!sidebarOpen && (
              <Button
                className="hidden lg:inline-flex"
                variant="text"
                size="sm"
                isIconOnly
                onClick={toggleSidebar}
                aria-label="Open sidebar"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <h1
              className={`text-xl font-semibold ${shouldHideTitleOnDesktop ? 'lg:invisible' : 'lg:visible'}`}
              aria-hidden={shouldHideTitleOnDesktop}
            >
              INTAN CMS
            </h1>
            <div />
          </div>
        </header>

        {/* INFINITE[6]: id ini tandai area scroll utama yang dipantau hook */}
        <main id="app-main-scroll" className="flex-1 overflow-y-auto p-4 sm:p-6">
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
