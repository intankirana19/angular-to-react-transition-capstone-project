import { Route, Routes } from 'react-router-dom';
import ProductsListPage from './pages/ProductsListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CreateProductPage from './pages/CreateProductPage';
import EditProductPage from './pages/EditProductPage';
import ProductNotFoundPage from './pages/ProductNotFoundPage';

export default function ProductsRoutes() {
  return (
    <Routes>
      <Route index element={<ProductsListPage />} />
      <Route path="new" element={<CreateProductPage />} />
      <Route path="detail/:productId" element={<ProductDetailPage />} />
      <Route path="edit/:productId" element={<EditProductPage />} />
      <Route path="*" element={<ProductNotFoundPage />} />
    </Routes>
  );
}
