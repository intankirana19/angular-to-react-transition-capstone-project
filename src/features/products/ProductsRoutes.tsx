import { Route, Routes, useNavigate } from 'react-router-dom';
import { ErrorState } from '@/shared/ui/ErrorState';
import ProductsListPage from './pages/ProductsListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CreateProductPage from './pages/CreateProductPage';
import EditProductPage from './pages/EditProductPage';

export default function ProductsRoutes() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route index element={<ProductsListPage />} />
      <Route path="new" element={<CreateProductPage />} />
      <Route path="detail/:productId" element={<ProductDetailPage />} />
      <Route path="edit/:productId" element={<EditProductPage />} />
      <Route
        path="*"
        element={
          <ErrorState
            variant="warning"
            title="Product page not found"
            message="The product route you tried to open does not exist."
            actions={[
              {
                label: 'Back to Products',
                variant: 'primary',
                onClick: () => navigate('/products', { replace: true }),
              },
            ]}
          />
        }
      />
    </Routes>
  );
}
