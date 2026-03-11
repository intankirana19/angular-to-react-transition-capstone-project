import axios from 'axios';
import { AppError } from '@/shared/lib/appError';
import { getErrorMessage, getErrorTitle } from '@/shared/lib/error';

describe('error helpers', () => {
  it('prefers AppError message and title', () => {
    // service error harus jadi sumber pesan ui paling utama
    const error = new AppError({
      status: 404,
      title: 'Product not found',
      message: 'The requested product does not exist',
    });

    expect(getErrorMessage(error)).toBe('The requested product does not exist');
    expect(getErrorTitle(error)).toBe('Product not found');
  });

  it('reads axios payload message before generic fallback', () => {
    // payload api yang punya message harus kebaca langsung
    const error = axios.AxiosError.from(new Error('network fail'), undefined, undefined, undefined, {
      data: { message: 'API says no' },
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: { headers: {} as never },
    });

    expect(getErrorMessage(error)).toBe('API says no');
  });

  it('maps axios status to a friendly title', () => {
    // status http umum dipetakan ke title yang konsisten
    const error = axios.AxiosError.from(new Error('forbidden'), undefined, undefined, undefined, {
      data: {},
      status: 403,
      statusText: 'Forbidden',
      headers: {},
      config: { headers: {} as never },
    });

    expect(getErrorTitle(error)).toBe('Forbidden');
  });

  it('uses provided fallback when no useful message exists', () => {
    // unknown error tanpa message valid harus jatuh ke fallback caller
    expect(getErrorMessage({ foo: 'bar' }, 'custom fallback')).toBe('custom fallback');
    expect(getErrorTitle({ foo: 'bar' }, 'custom title')).toBe('custom title');
  });
});
