import { useState } from 'react';
import { useCreateProduct } from '../api/hooks/useCreateProduct';
import { useUpdateProduct } from '../api/hooks/useUpdateProduct';
import { type Product, type ProductInputValues } from '../types';
import { useToast } from '@/shared/hooks/useToast';
import { getErrorMessage } from '@/shared/lib/error';

type ProductFormMode = 'create' | 'edit';

interface UseProductFormSubmissionParams {
  mode: ProductFormMode;
  productId?: string;
  onSuccess?: (product: Product) => void | Promise<void>;
}

interface UseProductFormSubmissionResult {
  isMutationPending: boolean;
  submitError: string | null;
  submitProduct: (data: ProductInputValues) => Promise<void>;
}

export function useProductFormSubmission({
  mode,
  productId,
  onSuccess,
}: UseProductFormSubmissionParams): UseProductFormSubmissionResult {
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const { addToast } = useToast();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isMutationPending =
    mode === 'create' ? createProductMutation.isPending : updateProductMutation.isPending;

  const handleCreateSubmit = async (data: ProductInputValues): Promise<void> => {
    // Kalau create, pakai mutateAsync biar hasilnya bisa dipakai lanjut
    const createdProduct = await createProductMutation.mutateAsync(data);
    addToast({
      type: 'success',
      title: 'Product Created Successfully',
      message: `"${createdProduct.name ?? 'Product'}" was created successfully.`,
      duration: 6000,
    });

    // kalau sukses, jalanin callback (misalnya untuk navigate)
    if (onSuccess) {
      await onSuccess(createdProduct);
    }
  };

  const handleEditSubmit = async (data: ProductInputValues): Promise<void> => {
    // Kalau mode edit tapi id kosong, stop dulu biar jelas error-nya
    if (!productId) {
      throw new Error('Product id is required for edit mode');
    }

    // Untuk edit, kirim id + data terbaru ke mutation update
    const updatedProduct = await updateProductMutation.mutateAsync({
      id: productId,
      payload: data,
    });
    addToast({
      type: 'success',
      title: 'Product Updated Successfully',
      message: `"${updatedProduct.name ?? 'Product'}" was updated successfully.`,
      duration: 6000,
    });
    if (onSuccess) {
      await onSuccess(updatedProduct);
    }
  };

  // Biar rapi, submit dipilih berdasarkan mode
  const submitByMode: Record<ProductFormMode, (data: ProductInputValues) => Promise<void>> = {
    create: handleCreateSubmit,
    edit: handleEditSubmit,
  };

  // Inti submit flow dipusatkan di hook, jadi komponen form fokus render UI aja
  const submitProduct = async (data: ProductInputValues) => {
    
    // Bersihin error lama dulu sebelum submit baru
    setSubmitError(null);

    try {
      await submitByMode[mode](data);
    } catch (error) {
      const message = getErrorMessage(error);
      // Tetap tampilkan error di bawah form biar user langsung notice
      setSubmitError(message);

      // Sekalian kasih toast biar gak ada silent failure
      addToast({
        type: 'error',
        title: mode === 'create' ? 'Failed to create product' : 'Failed to update product',
        message,
        duration: 7000,
      });
    }
  };

  return {
    isMutationPending,
    submitError,
    submitProduct,
  };
}
