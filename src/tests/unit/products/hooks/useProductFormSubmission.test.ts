import { act, renderHook } from '@testing-library/react';
import { useProductFormSubmission } from '@/features/products/hooks/useProductFormSubmission';
import { type Product, type ProductInputValues } from '@/features/products/types';

// test ini fokus ke alur submit di hook mutation + toast yang tidak dites di productform test
const {
  useCreateProductMock,
  useUpdateProductMock,
  useToastMock,
  getErrorMessageMock,
} = vi.hoisted(() => ({
  // mock hook create product
  useCreateProductMock: vi.fn(),
  // mock hook update product
  useUpdateProductMock: vi.fn(),
  // mock hook toast global
  useToastMock: vi.fn(),
  // mock helper normalisasi error
  getErrorMessageMock: vi.fn(),
}));

// arahkan import hook create ke mock biar perilaku api bisa kita kontrol
vi.mock('@/features/products/api/hooks/useCreateProduct', () => ({
  useCreateProduct: useCreateProductMock,
}));

// arahkan import hook update ke mock untuk skenario edit
vi.mock('@/features/products/api/hooks/useUpdateProduct', () => ({
  useUpdateProduct: useUpdateProductMock,
}));

// mock toast supaya pesan sukses dan error bisa diverifikasi
vi.mock('@/shared/hooks/useToast', () => ({
  useToast: useToastMock,
}));

// mock formatter error supaya output pesan lebih deterministic
vi.mock('@/shared/lib/error', () => ({
  getErrorMessage: getErrorMessageMock,
}));

describe('useProductFormSubmission', () => {
  const addToastMock = vi.fn(); // spy pemanggilan add toast dari hook toast
  const createMutateAsyncMock = vi.fn(); // spy mutateAsync untuk mode create
  const updateMutateAsyncMock = vi.fn(); // spy mutateAsync untuk mode edit

  const sampleInput: ProductInputValues = {
    name: 'Desk',
    price: 120,
    avatar: 'https://img.test/desk.png',
    material: 'Wood',
    description: 'Solid wood desk',
  }; // data form contoh buat dipakai ulang di semua skenario submit

  beforeEach(() => {
    useCreateProductMock.mockReturnValue({
      isPending: false, // default create mutation tidak loading
      mutateAsync: createMutateAsyncMock, // spy create mutation untuk verifikasi payload create
    });

    useUpdateProductMock.mockReturnValue({
      isPending: false, // default update mutation tidak loading
      mutateAsync: updateMutateAsyncMock, // spy update mutation untuk verifikasi payload edit
    });

    useToastMock.mockReturnValue({
      addToast: addToastMock, // spy toast supaya mudah verifikasi type/title/message
    });

    // fallback implementasi normalizer error agar test punya error message yang deterministic
    getErrorMessageMock.mockImplementation((error: unknown) => {
      if (error instanceof Error) {
        return error.message;
      }
      return 'Unknown error';
    });
  });

  it('submits create flow and shows success toast', async () => {
    const createdProduct: Product = {
      id: 'p-1',
      ...sampleInput,
      createdAt: '2025-01-01T00:00:00.000Z',
    }; // simulasi response api sukses saat create product
    const onSuccessMock = vi.fn();
    createMutateAsyncMock.mockResolvedValue(createdProduct); // saat create dipanggil balikin data produk yang berhasil dibuat

    const { result } = renderHook(() =>
      useProductFormSubmission({ mode: 'create', onSuccess: onSuccessMock })
    ); // render hook dalam mode create biar alur create bisa dites end to end

    await act(async () => {
      await result.current.submitProduct(sampleInput);
    }); // trigger submit persis kayak user klik submit di form

    expect(createMutateAsyncMock).toHaveBeenCalledWith(sampleInput);
    expect(updateMutateAsyncMock).not.toHaveBeenCalled();
    expect(onSuccessMock).toHaveBeenCalledWith(createdProduct);
    expect(result.current.submitError).toBeNull();
    expect(addToastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'success',
        title: 'Product Created Successfully',
      })
    );
  });

  it('submits edit flow and sends id + payload', async () => {
    const updatedProduct: Product = {
      id: 'p-9',
      ...sampleInput,
      createdAt: '2024-01-01T00:00:00.000Z',
    }; // simulasi response api sukses saat update product
    updateMutateAsyncMock.mockResolvedValue(updatedProduct); // saat update dipanggil balikin data produk versi terbaru

    const { result } = renderHook(() =>
      useProductFormSubmission({ mode: 'edit', productId: 'p-9' })
    ); // render hook mode edit dengan productid yang valid

    await act(async () => {
      await result.current.submitProduct(sampleInput);
    }); // jalankan submit untuk ngecek payload update yang dikirim hook

    expect(updateMutateAsyncMock).toHaveBeenCalledWith({
      id: 'p-9',
      payload: sampleInput,
    });
    expect(createMutateAsyncMock).not.toHaveBeenCalled();
    expect(result.current.submitError).toBeNull();
    expect(addToastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'success',
        title: 'Product Updated Successfully',
      })
    );
  });

  it('sets submitError and shows error toast when mutation fails', async () => {
    createMutateAsyncMock.mockRejectedValue(new Error('network down')); // paksa create mutation gagal biar masuk branch error handling
    getErrorMessageMock.mockReturnValue('Failed to reach server'); // normalizer error dimock supaya pesan error konsisten saat diverifikasi di test

    const { result } = renderHook(() =>
      useProductFormSubmission({ mode: 'create' })
    ); // render mode create untuk validasi perilaku gagal create

    await act(async () => {
      await result.current.submitProduct(sampleInput);
    }); // trigger submit lalu biarkan hook memproses error

    expect(result.current.submitError).toBe('Failed to reach server');
    expect(addToastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'error',
        title: 'Failed to create product',
        message: 'Failed to reach server',
      })
    );
  });

  it('handles edit mode without productId as an error', async () => {
    const { result } = renderHook(() =>
      useProductFormSubmission({ mode: 'edit' })
    ); // render mode edit tanpa id untuk ngetes validasi early guard di hook

    await act(async () => {
      await result.current.submitProduct(sampleInput);
    }); // submit tetap dipanggil untuk memastikan guard benar benar aktif

    expect(updateMutateAsyncMock).not.toHaveBeenCalled();
    expect(result.current.submitError).toBe('Product id is required for edit mode');
    expect(addToastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'error',
        title: 'Failed to update product',
        message: 'Product id is required for edit mode',
      })
    );
  });
});
