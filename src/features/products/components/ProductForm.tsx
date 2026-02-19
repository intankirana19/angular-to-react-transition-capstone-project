import { useEffect } from 'react';
import { Input } from '@/shared/ui/Input';
import { Textarea, TextareaField } from '@/shared/ui/Textarea';
import { productInputSchema, type Product, type ProductInputValues } from '../types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProductFormSubmission } from '../hooks/useProductFormSubmission';

interface ProductFormProps {
  productId?: string;
  // buat mode edit biar form bisa diisi data existing
  initialValues?: Partial<ProductInputValues>;
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
  // id dipisah biar label description kebaca aksesibel dan stabil di test
  const descriptionInputId = 'product-description';

  // submit logic dipisah ke hook supaya komponen fokus render field
  const { isMutationPending, submitError, submitProduct } = useProductFormSubmission({
    mode,
    productId,
    onSuccess,
  });

  // setup react hook form dan validasi zod
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm<ProductInputValues>({
    resolver: zodResolver(productInputSchema), // pakai schema biar rules konsisten
    mode: 'onBlur', // tampilkan error setelah field disentuh
    defaultValues,
  });

  // kalau mode edit reset form saat initial value berubah
  useEffect(() => {
    if (initialValues) {
      reset({ ...defaultValues, ...initialValues });
    }
  }, [initialValues, reset]);

  const isSubmitting = isFormSubmitting || isMutationPending;

  return (
    <form
      className="space-y-4"
      // bungkus submit react hook form ke handler internal
      onSubmit={(e) => {void handleSubmit(submitProduct)(e);}}
      noValidate
    >
      <Input
        label="Name"
        placeholder="Product name"
        error={errors.name?.message}
        disabled={isSubmitting}
        {...register('name')} // hubungkan input ke state form
      />
      <Input
        label="Price"
        type="number"
        placeholder="0"
        error={errors.price?.message}
        disabled={isSubmitting}
        {...register('price', {
          valueAsNumber: true, // ubah nilai input number jadi number beneran
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
      <TextareaField
        label="Description"
        htmlFor={descriptionInputId}
        error={errors.description?.message}
      >
        <Textarea
          id={descriptionInputId}
          placeholder="Description"
          disabled={isSubmitting}
          {...register('description')}
        />
      </TextareaField>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto px-4 py-2.5 text-ait-body-md-semibold text-white bg-primary-500 rounded-lg transition-colors enabled:hover:bg-primary-400 disabled:bg-disabled disabled:text-white/70 disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none"
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
