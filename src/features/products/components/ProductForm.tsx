import { useEffect } from 'react';
import { Input } from '@/shared/ui/Input';
import { Textarea, TextareaField } from '@/shared/ui/Textarea';
import { productInputSchema, type Product, type ProductInputValues } from '../types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateProduct } from '../api/hooks/useCreateProduct';
import { useUpdateProduct } from '../api/hooks/useUpdateProduct';

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
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
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

  const isSubmitting = isFormSubmitting || (mode === 'create'
    ? createProductMutation.isPending
    : updateProductMutation.isPending);

  const handleValidSubmit = async (data: ProductInputValues) => {
    if (mode === 'create') {
      const createdProduct = await createProductMutation.mutateAsync(data); // pakai mutateAsync drpd mutate karna data perlu dipakai dionSuccess
      if (onSuccess) {
        await onSuccess(createdProduct);
      }
      return;
    }

    if (!productId) {
      throw new Error('Product id is required for edit mode');
    }

    // mode edit: kirim id + payload untuk update yang existing.
    const updatedProduct = await updateProductMutation.mutateAsync({
      id: productId,
      payload: data,
    });
    if (onSuccess) {
      await onSuccess(updatedProduct);
    }
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
    </form>
  );
}
