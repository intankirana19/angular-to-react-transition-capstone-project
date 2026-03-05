import { applyProductListQuery } from '@/features/products/utils/productListQuery';
import { type Product } from '@/features/products/types';

const products: Product[] = [
  {
    id: 'p-1',
    name: 'Alpha Chair',
    price: 300,
    avatar: '',
    material: 'Wood',
    description: 'Living room chair',
    createdAt: '2026-03-01T10:00:00.000Z',
  },
  {
    id: 'p-2',
    name: 'beta desk',
    price: 100,
    avatar: '',
    material: 'metal',
    description: 'Office desk',
    createdAt: '2026-03-02T15:00:00.000Z',
  },
  {
    id: 'p-3',
    name: 'Gamma Lamp',
    price: undefined,
    avatar: '',
    material: 'Glass',
    description: 'Bedside lamp',
    createdAt: '2026-03-03T08:00:00.000Z',
  },
  {
    id: 'p-4',
    name: 'No Date',
    price: 999,
    avatar: '',
    material: 'Wood',
    description: 'Missing date',
    createdAt: undefined,
  },
];

describe('applyProductListQuery', () => {
  it('searches by normalized text across searchable fields', () => {
    const result = applyProductListQuery(products, { search: '  office  ' });
    expect(result.map((item) => item.id)).toEqual(['p-2']);
  });

  it('filters material with trim and case-insensitive equality', () => {
    const result = applyProductListQuery(products, { material: '  WOOD ' });
    expect(result.map((item) => item.id)).toEqual(['p-1', 'p-4']);
  });

  it('applies created date range inclusively from start to end of day', () => {
    const result = applyProductListQuery(products, {
      createdFrom: '2026-03-02',
      createdTo: '2026-03-03',
      sortBy: 'createdAt',
      sortOrder: 'asc',
    });

    expect(result.map((item) => item.id)).toEqual(['p-2', 'p-3']);
  });

  it('excludes invalid or missing createdAt when date filter is active', () => {
    const result = applyProductListQuery(products, {
      createdFrom: '2026-03-01T00:00:00.000Z',
      createdTo: '2026-03-05T00:00:00.000Z',
    });

    expect(result.some((item) => item.id === 'p-4')).toBe(false);
  });

  it('sorts by price asc and treats undefined as negative infinity', () => {
    const result = applyProductListQuery(products, { sortBy: 'price', sortOrder: 'asc' });
    expect(result.map((item) => item.id)).toEqual(['p-3', 'p-2', 'p-1', 'p-4']);
  });

  it('sorts by name desc with normalized text', () => {
    const result = applyProductListQuery(products, { sortBy: 'name', sortOrder: 'desc' });
    expect(result.map((item) => item.id)).toEqual(['p-4', 'p-3', 'p-2', 'p-1']);
  });

  it('defaults to createdAt desc when sort query is not provided', () => {
    const result = applyProductListQuery(products, {});
    expect(result.map((item) => item.id)).toEqual(['p-3', 'p-2', 'p-1', 'p-4']);
  });
});
