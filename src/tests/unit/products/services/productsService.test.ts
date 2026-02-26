import { getProductById } from '@/features/products/api/services/productsService';

describe('productsService getProductById negative cases', () => {
  beforeEach(() => {
    localStorage.clear(); // reset storage biar tiap test punya kondisi awal yang bersih
  });

  it('throws AppError 400 when id is empty/invalid', async () => {
    // aturan service payload id kosong dianggap request tidak valid 400 bukan return null
    await expect(getProductById('   ')).rejects.toMatchObject({
      name: 'AppError',
      status: 400,
      title: 'Invalid product ID',
      message: 'The product ID in the route is empty or invalid.',
    });
  });

  it('throws AppError 404 when product id does not exist', async () => {
    // seed 1 data agar jelas kasus ini murni id tidak ketemu bukan storage kosong
    localStorage.setItem(
      'mock:products',
      JSON.stringify([
        {
          id: 'p-1',
          name: 'Laptop',
          price: 1000,
          avatar: '',
          material: 'Aluminum',
          description: 'Test product',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ])
    );

    // aturan service id tidak ditemukan harus error 404 style api
    await expect(getProductById('p-404')).rejects.toMatchObject({
      name: 'AppError',
      status: 404,
      title: 'Product not found',
      message: 'The requested product does not exist or has been removed.',
    });
  });
});
