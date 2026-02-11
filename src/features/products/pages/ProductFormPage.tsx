import { ProductForm } from '../components/ProductForm';

export default function ProductFormPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">New Product</h1>
        <p className="text-sm text-neutral-600">Fill the form to add a product</p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm border border-neutral-200">
        <ProductForm />
      </div>
    </div>
  );
}
