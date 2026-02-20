import { useMemo } from 'react';
import { FILTER_ALL_VALUE } from '@/shared/constants/filters';
import { type Product } from '../types';

// Dipakai hanya untuk fallback label saat material aktif tidak ditemukan di daftar pilihan utama.
function toTitleCase(text: string): string {
  return text.replace(/\w\S*/g, (word) => word[0].toUpperCase() + word.slice(1).toLowerCase());
}

export function useProductMaterialOptions(products: Product[], activeMaterial?: string) {
  return useMemo(() => {
    // FILTER[27]: Build daftar pilihan material unik dari dataset products (disuplai dari query unfiltered di page).
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

    const normalizedActiveMaterial = activeMaterial?.trim().toLowerCase() ?? '';
    if (
      normalizedActiveMaterial &&
      normalizedActiveMaterial !== FILTER_ALL_VALUE &&
      !materialMap.has(normalizedActiveMaterial)
    ) {
      // Jaga nilai material aktif tetap selectable saat daftar pilihan utama belum memuat value tsb (mis. data edge-case).
      materialMap.set(normalizedActiveMaterial, toTitleCase(activeMaterial!.trim()));
    }

    const sortedMaterials = [...materialMap.entries()].sort((a, b) => a[1].localeCompare(b[1]));
    return [
      { value: FILTER_ALL_VALUE, label: 'All Materials' },
      ...sortedMaterials.map(([value, label]) => ({ value, label })),
    ];
  }, [activeMaterial, products]); // FILTER[26]: Pakai useMemo biar daftar pilihan material unik nggak dihitung ulang di setiap render
}
