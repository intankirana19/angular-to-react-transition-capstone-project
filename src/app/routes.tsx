import { Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import type { ElementType } from 'react';
import { MainLayout } from '@/app/layouts/MainLayout';
import { AuthLayout } from '@/app/layouts/AuthLayout';
import { LoadingState } from '@/shared/ui/LoadingState';

const HomePage = lazy(() => import('@/features/home'));
const UsersPage = lazy(() => import('@/features/users'));
const ProductsPage = lazy(() => import('@/features/products'));
const ProductDetailPage = lazy(() => import('@/features/products/pages/ProductDetailPage'));
const ProductFormPage = lazy(() => import('@/features/products/pages/ProductFormPage'));
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

export function AppRoutes() {
  type AppRoute =
    | { index: true; Component: ElementType }
    | { path: string; Component: ElementType };

  const routes: AppRoute[] = [
    { index: true, Component: HomePage },
    { path: 'users', Component: UsersPage },
    { path: 'products', Component: ProductsPage },
    { path: 'products/:productId', Component: ProductDetailPage },
    { path: 'products/edit/:productId', Component: ProductFormPage },
    { path: 'products/new', Component: ProductFormPage },
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
    <Suspense fallback={<LoadingState fullScreen/>}> {/* suspense dipakai untuk module route yang di-load dengan lazy() (loading chunk kode) bukan loading data api, tapi UI jadi komponen reusable 'LoadingState' untuk standarisasi */}
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
