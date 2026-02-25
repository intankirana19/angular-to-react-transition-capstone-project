import { renderHook } from '@testing-library/react';
import { useProductMaterialOptions } from '@/features/products/hooks/useProductMaterialOptions';
import { FILTER_ALL_VALUE } from '@/shared/constants/filters';
import { type Product } from '@/features/products/types';

describe('useProductMaterialOptions', () => {
  it('keeps active material option even when current products do not contain it', () => {
    const products: Product[] = []; // guard bug lama: selected material harus tetap kebaca saat dialog reopen walau list kosong

    const { result } = renderHook(() => useProductMaterialOptions(products, 'aluminum'));

    expect(result.current).toEqual([
      { value: FILTER_ALL_VALUE, label: 'All Materials' },
      { value: 'aluminum', label: 'Aluminum' },
    ]);
  });

  it('does not duplicate active material when it already exists in product list', () => {
    const products: Product[] = [ // kalau material sudah ada di dataset, fallback jangan bikin opsi dobel
      {
        id: 'p-1',
        name: 'Chair',
        material: 'Aluminum',
        price: 10,
        avatar: '',
        description: '',
        createdAt: '2026-02-01T00:00:00.000Z',
      },
    ];

    const { result } = renderHook(() => useProductMaterialOptions(products, 'aluminum'));

    expect(result.current).toEqual([
      { value: FILTER_ALL_VALUE, label: 'All Materials' },
      { value: 'aluminum', label: 'Aluminum' },
    ]);
  });
});
