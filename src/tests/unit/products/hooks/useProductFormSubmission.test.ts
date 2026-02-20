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

// mock toast supaya bisa assert pesan sukses dan error
vi.mock('@/shared/hooks/useToast', () => ({
  useToast: useToastMock,
}));

// mock formatter error supaya output pesan lebih deterministic
vi.mock('@/shared/lib/error', () => ({
  getErrorMessage: getErrorMessageMock,
}));

describe('useProductFormSubmission', () => {
  // spy pemanggilan add toast dari hook toast
  const addToastMock = vi.fn();
  // spy mutateAsync untuk mode create
  const createMutateAsyncMock = vi.fn();
  // spy mutateAsync untuk mode edit
  const updateMutateAsyncMock = vi.fn();

  // data form contoh buat dipakai ulang di semua skenario submit
  const sampleInput: ProductInputValues = {
    name: 'Desk',
    price: 120,
    avatar: 'https://img.test/desk.png',
    material: 'Wood',
    description: 'Solid wood desk',
  };

  beforeEach(() => {
    vi.clearAllMocks(); // reset semua history dan implementation mock biar tiap test independen

    useCreateProductMock.mockReturnValue({
      isPending: false, // default create mutation tidak loading
      mutateAsync: createMutateAsyncMock, // spy create mutation untuk verifikasi payload create
    });

    useUpdateProductMock.mockReturnValue({
      isPending: false, // default update mutation tidak loading
      mutateAsync: updateMutateAsyncMock, // spy update mutation untuk verifikasi payload edit
    });

    useToastMock.mockReturnValue({
      addToast: addToastMock, // spy toast supaya mudah assert type/title/message
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
    // simulasi response api sukses saat create product
    const createdProduct: Product = {
      id: 'p-1',
      ...sampleInput,
      createdAt: '2025-01-01T00:00:00.000Z',
    };
    const onSuccessMock = vi.fn();
    // saat create dipanggil balikin data produk yang berhasil dibuat
    createMutateAsyncMock.mockResolvedValue(createdProduct);

    // render hook dalam mode create biar alur create bisa dites end to end
    const { result } = renderHook(() =>
      useProductFormSubmission({ mode: 'create', onSuccess: onSuccessMock })
    );

    // trigger submit persis kayak user klik submit di form
    await act(async () => {
      await result.current.submitProduct(sampleInput);
    });

    // mode create harus memanggil create mutation saja
    expect(createMutateAsyncMock).toHaveBeenCalledWith(sampleInput);
    expect(updateMutateAsyncMock).not.toHaveBeenCalled();
    // callback sukses dan state submit error harus mencerminkan alur sukses
    expect(onSuccessMock).toHaveBeenCalledWith(createdProduct);
    expect(result.current.submitError).toBeNull();
    // toast sukses wajib tampil setelah create berhasil
    expect(addToastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'success',
        title: 'Product Created Successfully',
      })
    );
  });

  it('submits edit flow and sends id + payload', async () => {
    // simulasi response api sukses saat update product
    const updatedProduct: Product = {
      id: 'p-9',
      ...sampleInput,
      createdAt: '2024-01-01T00:00:00.000Z',
    };
    // saat update dipanggil balikin data produk versi terbaru
    updateMutateAsyncMock.mockResolvedValue(updatedProduct);

    // render hook mode edit dengan productid yang valid
    const { result } = renderHook(() =>
      useProductFormSubmission({ mode: 'edit', productId: 'p-9' })
    );

    // jalankan submit untuk ngecek payload update yang dikirim hook
    await act(async () => {
      await result.current.submitProduct(sampleInput);
    });

    // mode edit harus kirim id dan payload ke update mutation
    expect(updateMutateAsyncMock).toHaveBeenCalledWith({
      id: 'p-9',
      payload: sampleInput,
    });
    expect(createMutateAsyncMock).not.toHaveBeenCalled();
    expect(result.current.submitError).toBeNull();
    // toast sukses edit muncul dengan title update
    expect(addToastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'success',
        title: 'Product Updated Successfully',
      })
    );
  });

  it('sets submitError and shows error toast when mutation fails', async () => {
    // paksa create mutation gagal biar masuk branch error handling
    createMutateAsyncMock.mockRejectedValue(new Error('network down'));
    // normalizer error dimock biar pesan error konsisten di assert
    getErrorMessageMock.mockReturnValue('Failed to reach server');

    // render mode create untuk validasi perilaku gagal create
    const { result } = renderHook(() =>
      useProductFormSubmission({ mode: 'create' })
    );

    // trigger submit lalu biarkan hook memproses error
    await act(async () => {
      await result.current.submitProduct(sampleInput);
    });

    // jika mutation gagal hook harus expose error submit hasil normalisasi
    expect(result.current.submitError).toBe('Failed to reach server');
    // toast error harus membawa context kegagalan create
    expect(addToastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'error',
        title: 'Failed to create product',
        message: 'Failed to reach server',
      })
    );
  });

  it('handles edit mode without productId as an error', async () => {
    // render mode edit tanpa id untuk ngetes validasi early guard di hook
    const { result } = renderHook(() =>
      useProductFormSubmission({ mode: 'edit' })
    );

    // submit tetap dipanggil untuk memastikan guard benar benar aktif
    await act(async () => {
      await result.current.submitProduct(sampleInput);
    });

    // edit tanpa productid divalidasi di level hook sebelum panggil mutation
    expect(updateMutateAsyncMock).not.toHaveBeenCalled();
    expect(result.current.submitError).toBe('Product id is required for edit mode');
    // user tetap mendapat feedback lewat toast error yang sesuai mode edit
    expect(addToastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'error',
        title: 'Failed to update product',
        message: 'Product id is required for edit mode',
      })
    );
  });
});
