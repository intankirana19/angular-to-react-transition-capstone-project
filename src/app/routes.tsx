import { Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import type { ElementType } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { AuthLayout } from '@/layouts/AuthLayout';

const HomePage = lazy(() => import('@/features/home'));
const UsersPage = lazy(() => import('@/features/users'));
const TeamPage = lazy(() => import('@/features/team'));
const TypographyPage = lazy(() => import('@/features/typography'));
const ColorsPage = lazy(() => import('@/features/colors'));
const AccordionPage = lazy(() => import('@/features/accordion'));
const SelectPage = lazy(() => import('@/features/select'));
const DatePickerPage = lazy(() => import('@/features/datepicker'));
const TextareaPage = lazy(() => import('@/features/textarea'));
const DialogPage = lazy(() => import('@/features/dialog'));
const DailyLogsPage = lazy(() => import('@/features/daily-logs'));
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
        <p className="text-neutral-600">Loading...</p>
      </div>
    </div>
  );
}

export function AppRoutes() {
  type AppRoute =
    | { index: true; Component: ElementType }
    | { path: string; Component: ElementType };

  const routes: AppRoute[] = [
    { index: true, Component: HomePage },
    { path: 'users', Component: UsersPage },
    { path: 'team', Component: TeamPage },
    { path: 'typography', Component: TypographyPage },
    { path: 'colors', Component: ColorsPage },
    { path: 'accordion', Component: AccordionPage },
    { path: 'select', Component: SelectPage },
    { path: 'datepicker', Component: DatePickerPage },
    { path: 'textarea', Component: TextareaPage },
    { path: 'dialog', Component: DialogPage },
    { path: 'daily-logs', Component: DailyLogsPage },
  ];

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Auth Routes (without sidebar) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* Main Routes (with sidebar) */}
        <Route path="/" element={<MainLayout />}>
          {routes.map((r) => {
            const Component = r.Component;

            return 'index' in r ? (
              <Route key="index" index element={<Component />} />
            ) : (
              <Route key={r.path} path={r.path} element={<Component />} />
            );
          })}
        </Route>
      </Routes>
    </Suspense>
  );
}
