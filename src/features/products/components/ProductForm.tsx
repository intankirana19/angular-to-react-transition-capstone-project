import { useEffect } from 'react';
import { Input } from '@/shared/ui/Input';
import { Textarea, TextareaField } from '@/shared/ui/Textarea';
import { productInputSchema, type Product, type ProductInputValues } from '../types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProductFormSubmission } from '../hooks/useProductFormSubmission';

interface ProductFormProps {
  productId?: string;
  initialValues?: Partial<ProductInputValues>; // buat edit, isi awal diambil dari data produk.
  mode?: 'create' | 'edit';
  onSuccess?: (product: Product) => void | Promise<void>;
}

const defaultValues: ProductInputValues = {
  name: '',
  price: 0,
  avatar: '',
  material: '',
  description: '',
};

export function ProductForm({
  productId,
  initialValues,
  mode = 'create',
  onSuccess,
}: ProductFormProps) {
  
  const { isMutationPending, submitError, submitProduct } = useProductFormSubmission({
    mode,
    productId,
    onSuccess,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting: isFormSubmitting },
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

  const isSubmitting = isFormSubmitting || isMutationPending;

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {void handleSubmit(submitProduct)(e);}}
      noValidate
    >
      <Input
        label="Name"
        placeholder="Product name"
        error={errors.name?.message}
        disabled={isSubmitting}
        {...register('name')} // register ke react hook form
      />
      <Input
        label="Price"
        type="number"
        placeholder="0"
        error={errors.price?.message}
        disabled={isSubmitting}
        {...register('price', {
          valueAsNumber: true, // input number selalu string, pakai valueAsNumber biar jadi number.
        })}
      />
      <Input
        label="Avatar URL"
        placeholder="https://..."
        disabled={isSubmitting}
        {...register('avatar')}
      />
      <Input
        label="Material"
        placeholder="Cotton / Wood / Metal"
        disabled={isSubmitting}
        {...register('material')}
      />
      <TextareaField label="Description" error={errors.description?.message}>
        <Textarea
          placeholder="Description"
          disabled={isSubmitting}
          {...register('description')}
        />
      </TextareaField>
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2.5 text-ait-body-md-semibold text-white bg-ait-primary-500 rounded-lg transition-colors enabled:hover:bg-ait-primary-400 disabled:bg-disabled disabled:text-white/70 disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none"
      >
        {isSubmitting ? 'Saving...' : 'Save'}
      </button>
      {submitError ? (
        <p className="text-sm text-danger-700" role="alert">
          {submitError}
        </p>
      ) : null}
    </form>
  );
}
