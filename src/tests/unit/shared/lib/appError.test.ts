import { AppError, isAppError } from '@/shared/lib/appError';

describe('AppError', () => {
  it('stores status title and message in a consistent error shape', () => {
    // kontrak utama AppError harus mirip error api dengan metadata ui tambahan
    const error = new AppError({
      status: 404,
      title: 'Product not found',
      message: 'The requested product does not exist',
    });

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('AppError');
    expect(error.status).toBe(404);
    expect(error.title).toBe('Product not found');
    expect(error.message).toBe('The requested product does not exist');
  });

  it('isAppError returns true only for AppError instances', () => {
    // type guard harus ketat supaya helper lain aman saat narrowing type
    expect(
      isAppError(
        new AppError({
          status: 400,
          title: 'Invalid product ID',
          message: 'The product ID is invalid',
        })
      )
    ).toBe(true);

    expect(isAppError(new Error('plain error'))).toBe(false);
    expect(isAppError({ status: 400, title: 'x', message: 'y' })).toBe(false);
    expect(isAppError(null)).toBe(false);
  });
});
