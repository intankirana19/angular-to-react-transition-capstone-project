import { useState } from 'react';
import { Input } from '@/shared/ui/Input';
import { Textarea } from '@/shared/ui/Textarea';
import { type ProductInputValues } from '../types';

export function ProductForm() {
  const [values, setValues] = useState<ProductInputValues>({
    name: '',
    price: 0,
    avatar: '',
    material: '',
    description: '',
  });

  return (
    <form className="space-y-4">
      <Input
        label="Name"
        placeholder="Product name"
        required
        value={values.name}
        onChange={(e) => setValues((prev) => ({ ...prev, name: e.target.value }))}
      />
      <Input
        label="Price"
        type="number"
        placeholder="0"
        required
        value={values.price}
        onChange={(e) => setValues((prev) => ({ ...prev, price: Number(e.target.value) }))}
      />
      <Input
        label="Avatar URL"
        placeholder="https://..."
        value={values.avatar}
        onChange={(e) => setValues((prev) => ({ ...prev, avatar: e.target.value }))}
      />
      <Input
        label="Material"
        placeholder="Cotton / Wood / Metal"
        value={values.material}
        onChange={(e) => setValues((prev) => ({ ...prev, material: e.target.value }))}
      />
      <Textarea
        placeholder="Description"
        value={values.description}
        onChange={(e) => setValues((prev) => ({ ...prev, description: e.target.value }))}
      />

      <button
        type="submit"
        className="px-4 py-2.5 text-ait-body-md-semibold text-white bg-ait-primary-500 rounded-lg hover:bg-ait-primary-400 transition-colors"
      >
        Save
      </button>
    </form>
  );
}
