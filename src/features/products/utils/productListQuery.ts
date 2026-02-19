import { type Product, type ProductListQuery } from '../types';

type ProductDateRange = {
  fromDate: Date | null;
  toDate: Date | null;
};

// SEARCH[9]: Ini dipakai khusus engine mock lokal untuk compare string saat filter/sort client-side
function normalizeText(value: string | undefined): string {
  return value?.trim().toLowerCase() ?? '';
}

// FILTER[16]: Ubah payload createdFrom/createdTo jadi batas tanggal inklusif buat filter createdAt
function parseDateRange(query: ProductListQuery): ProductDateRange {
  const fromDate = query.createdFrom ? new Date(query.createdFrom) : null;
  const toDate = query.createdTo ? new Date(query.createdTo) : null;

  if (fromDate) {
    fromDate.setHours(0, 0, 0, 0); // range start inklusif dari awal hari
  }

  if (toDate) {
    toDate.setHours(23, 59, 59, 999); // range end inklusif sampai akhir hari
  }

  return { fromDate, toDate };
}

// SEARCH[10]: Cek product match keyword search dari gabungan field yang user cari
function matchesSearch(product: Product, normalizedSearch: string): boolean {
  if (!normalizedSearch) {
    return true;
  }

  const searchableText = [product.id, product.name, product.material, product.description] // field yg ikut full-text search
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return searchableText.includes(normalizedSearch);
}

// FILTER[17]: Cek apakah material product sesuai sama material filter pilihan user
function matchesMaterial(product: Product, normalizedMaterial: string): boolean {
  if (!normalizedMaterial) {
    return true;
  }

  return normalizeText(product.material) === normalizedMaterial;
}

// FILTER[18]: Cek apakah createdAt product masih masuk range tanggal filter
function matchesCreatedAt(product: Product, dateRange: ProductDateRange): boolean {
  const { fromDate, toDate } = dateRange;

  if (!fromDate && !toDate) {
    return true;
  }

  const createdAt = product.createdAt ? new Date(product.createdAt) : null;
  if (!createdAt || Number.isNaN(createdAt.getTime())) {
    return false;
  }

  if (fromDate && createdAt < fromDate) {
    return false;
  }

  if (toDate && createdAt > toDate) {
    return false;
  }

  return true;
}

// SEARCH[11] + FILTER[19]: Jalanin semua rules filter lokal biar hasilnya mirip backend
function filterProducts(products: Product[], query: ProductListQuery): Product[] {
  const normalizedSearch = normalizeText(query.search); // normalisasi keyword search
  const normalizedMaterial = normalizeText(query.material); // normalisasi material utk exact match
  const dateRange = parseDateRange(query); // parse batas tanggal from/to

  return products.filter((product) => {
    return (
      matchesSearch(product, normalizedSearch) &&
      matchesMaterial(product, normalizedMaterial) &&
      matchesCreatedAt(product, dateRange)
    );
  });
}

// SORT[10]: Urutin list hasil filter berdasarkan sortBy + sortOrder dari payload query
function sortProducts(products: Product[], query: ProductListQuery): Product[] {
  const sortBy = query.sortBy ?? 'createdAt'; // default sort kolom createdAt
  const sortOrder = query.sortOrder ?? 'desc'; // default urutan terbaru dulu
  const direction = sortOrder === 'asc' ? 1 : -1; // faktor arah utk komparasi angka/string

  return [...products].sort((left, right) => {
    switch (sortBy) {
      case 'price': {
        const leftValue = left.price ?? Number.NEGATIVE_INFINITY;
        const rightValue = right.price ?? Number.NEGATIVE_INFINITY;
        return (leftValue - rightValue) * direction;
      }
      case 'name': {
        return (normalizeText(left.name).localeCompare(normalizeText(right.name)) || 0) * direction;
      }
      case 'material': {
        return (
          normalizeText(left.material).localeCompare(normalizeText(right.material)) * direction
        );
      }
      case 'createdAt':
      default: {
        const leftTime = left.createdAt
          ? new Date(left.createdAt).getTime()
          : Number.NEGATIVE_INFINITY;
        const rightTime = right.createdAt
          ? new Date(right.createdAt).getTime()
          : Number.NEGATIVE_INFINITY;
        return (leftTime - rightTime) * direction;
      }
    }
  });
}

// SEARCH[12] + FILTER[20] + SORT[11]: Entry helper mock backend, alurnya filter dulu baru sort
export function applyProductListQuery(products: Product[], query: ProductListQuery): Product[] {
  const filteredProducts = filterProducts(products, query); // sementara filter lokal ala backend
  return sortProducts(filteredProducts, query);
}
