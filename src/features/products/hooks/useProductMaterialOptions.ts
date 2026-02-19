import { useMemo } from 'react';
import { FILTER_ALL_VALUE } from '@/shared/constants/filters';
import { type Product } from '../types';

export function useProductMaterialOptions(products: Product[]) {
  return useMemo(() => {
    // FILTER[27]: Build opsi material unik dari data products yang sedang tampil
    const materialMap = new Map<string, string>();

    for (const product of products) {
      const rawMaterial = product.material?.trim();
      if (!rawMaterial) {
        continue;
      }

      const normalized = rawMaterial.toLowerCase();
      if (!materialMap.has(normalized)) {
        materialMap.set(normalized, rawMaterial);
      }
    }

    const sortedMaterials = [...materialMap.entries()].sort((a, b) => a[1].localeCompare(b[1]));
    return [
      { value: FILTER_ALL_VALUE, label: 'All Materials' },
      ...sortedMaterials.map(([value, label]) => ({ value, label })),
    ];
  }, [products]); // FILTER[26]: Pakai useMemo biar opsi material unik nggak dihitung ulang di setiap render
}
