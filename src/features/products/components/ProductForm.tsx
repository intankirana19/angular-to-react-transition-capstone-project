import { useEffect } from 'react';
import { Input } from '@/shared/ui/Input';
import { Textarea, TextareaField } from '@/shared/ui/Textarea';
import { productInputSchema, type ProductInputValues } from '../types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface ProductFormProps {
  initialValues?: Partial<ProductInputValues>; // buat edit, isi awal diambil dari data produk.
  onSubmit?: (data: ProductInputValues) => void;
}

const defaultValues: ProductInputValues = {
  name: '',
  price: 0,
  avatar: '',
  material: '',
  description: '',
};

export function ProductForm({ initialValues, onSubmit }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductInputValues>({
    resolver: zodResolver(productInputSchema), // ambil validasi zod yg dischema
    mode: 'onBlur', // munculin error saat field selesai diisi
    defaultValues,
  });

  // Kalau ada data edit biar disinkronin ke form
  useEffect(() => {
    if (initialValues) {
      reset({ ...defaultValues, ...initialValues });
    }
  }, [initialValues, reset]);

  const handleValidSubmit = (data: ProductInputValues) => {
    if (onSubmit) {
      onSubmit(data);
      return;
    }
    console.log('submit product', data);
  };

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {void handleSubmit(handleValidSubmit)(e);}}
      noValidate
    >
      <Input
        label="Name"
        placeholder="Product name"
        error={errors.name?.message}
        {...register('name')} // register ke react hook form
      />
      <Input
        label="Price"
        type="number"
        placeholder="0"
        error={errors.price?.message}
        {...register('price', {
          valueAsNumber: true, // input number selalu string, pakai valueAsNumber biar jadi number.
        })}
      />
      <Input
        label="Avatar URL"
        placeholder="https://..."
        {...register('avatar')}
      />
      <Input
        label="Material"
        placeholder="Cotton / Wood / Metal"
        {...register('material')}
      />
      <TextareaField label="Description" error={errors.description?.message}>
        <Textarea
          placeholder="Description"
          {...register('description')}
        />
      </TextareaField>

      <button
        type="submit"
        className="px-4 py-2.5 text-ait-body-md-semibold text-white bg-ait-primary-500 rounded-lg hover:bg-ait-primary-400 transition-colors"
      >
        Save
      </button>
    </form>
  );
}
