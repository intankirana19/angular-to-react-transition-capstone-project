import { createProduct, getProductById, getProducts } from '@/features/products/api/services/productsService';
import { apiClient } from '@/shared/lib/axios';
import { API_ENDPOINTS } from '@/shared/api/endpoints';

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

describe('productsService createProduct', () => {
  beforeEach(() => {
    localStorage.clear(); // reset state storage antar test
    vi.useFakeTimers(); // aktifkan fake timer supaya test tidak benar-benar menunggu delay 5 detik di service
    vi.setSystemTime(new Date('2026-03-03T10:00:00.000Z')); // kunci waktu "now" agar createdAt jadi deterministik dan assertion stabil
  });

  afterEach(() => {
    vi.restoreAllMocks(); // kembalikan semua spy/mock ke implementasi asli agar tidak bocor ke test lain
    vi.useRealTimers(); // wajib restore timer asli setelah pakai fake timer supaya file test lain tidak ikut terpengaruh
  });

  it('creates product with generated id and createdAt, then persists as first item', async () => {
    localStorage.setItem(
      'mock:products',
      JSON.stringify([
        {
          id: 'existing-1',
          name: 'Existing Product',
          price: 150,
          avatar: '',
          material: 'Wood',
          description: 'Existing',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
      ])
    ); // seed existing product buat cek urutan prepend

    const mockedUuid = '11111111-1111-4111-8111-111111111111'; // format UUID valid sesuai typing randomUUID di TypeScript
    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue(mockedUuid); // bikin id hasil create konsisten agar gampang diassert

    const promise = createProduct({
      name: 'New Product',
      price: 200,
      avatar: '',
      material: 'Metal',
      description: 'Brand new',
    });

    await vi.advanceTimersByTimeAsync(5000); // majuin fake clock 5 detik supaya Promise delay() selesai tanpa nunggu real time
    const created = await promise;

    expect(created).toMatchObject({
      id: mockedUuid,
      name: 'New Product',
      price: 200,
      avatar: '',
      material: 'Metal',
      description: 'Brand new',
      createdAt: '2026-03-03T10:00:05.000Z',
    }); // cek hasil return create sesuai payload + id mock + timestamp dari fake clock

    const storedRaw = localStorage.getItem('mock:products');
    expect(storedRaw).not.toBeNull(); // pastikan side effect persist ke localStorage benar terjadi

    const stored = JSON.parse(storedRaw ?? '[]') as Array<{ id: string }>; // fallback [] hanya buat jaga type getItem yang bisa null
    expect(stored).toHaveLength(2);
    expect(stored[0]?.id).toBe(mockedUuid);
    expect(stored[1]?.id).toBe('existing-1');
  });

  it('rejects invalid payload', async () => {
    const assertion = expect( // simpan promise assertion dulu biar reject async ketangkap matcher dan ga jadi unhandled rejection
      createProduct({
        name: '   ',
        price: -1,
        avatar: 'notaurl',
        material: 'Wood',
        description: 'Invalid payload',
      })
    ).rejects.toMatchObject({
      name: 'ZodError',
    });

    await vi.advanceTimersByTimeAsync(5000); // tetap perlu majukan clock karena validasi payload dieksekusi setelah await delay() di service
    await assertion;
  });
});

describe('productsService loadProducts fallback', () => {
  beforeEach(() => {
    localStorage.clear(); // reset storage biar branch fallback bisa dikontrol
  });

  afterEach(() => {
    vi.restoreAllMocks(); // bersihin spy api client antar test
  });

  it('falls back to api seed and persists products when localStorage is invalid', async () => {
    localStorage.setItem('mock:products', JSON.stringify({ invalid: true })); // paksa safeParse gagal agar masuk fallback API

    const apiSeed = [
      {
        id: 'seed-1',
        name: 'Seed Product',
        price: 120,
        avatar: '',
        material: 'Metal',
        description: 'From API seed',
        createdAt: '2026-03-01T00:00:00.000Z',
      },
    ];

    const getSpy = vi.spyOn(apiClient, 'get').mockResolvedValue({
      data: apiSeed,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    });

    const products = await getProducts();

    expect(getSpy).toHaveBeenCalledWith(API_ENDPOINTS.products);
    expect(products).toEqual(apiSeed);

    const storedRaw = localStorage.getItem('mock:products');
    expect(storedRaw).not.toBeNull();
    expect(JSON.parse(storedRaw ?? '[]')).toEqual(apiSeed);
  });
});
