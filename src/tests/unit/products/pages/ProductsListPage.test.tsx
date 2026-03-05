import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductsListPage from '@/features/products/pages/ProductsListPage'
import { type Product } from '@/features/products/types'

type SearchState = {
  searchQuery: string
  setSearchQuery: (value: string) => void
  clearSearch: () => void
  hasSearch: boolean
  querySearch: Record<string, unknown>
}

type FilterState = {
  materialFilter: string
  setMaterialFilter: (value: string) => void
  createdDateRange: undefined
  setCreatedDateRange: (value: undefined) => void
  hasMaterialFilter: boolean
  hasDateFilter: boolean
  hasAnyFilter: boolean
  activeStructuredFilterCount: number
  queryFilter: Record<string, unknown>
  clearFilters: () => void
}

const testState = vi.hoisted(() => {
  const setSearchQuery = vi.fn<(value: string) => void>()
  const clearSearch = vi.fn<() => void>()
  const setMaterialFilter = vi.fn<(value: string) => void>()
  const setCreatedDateRange = vi.fn<(value: undefined) => void>()
  const clearFilters = vi.fn<() => void>()
  const onSortValueChange = vi.fn<(value: string) => void>()
  const onFilterDialogOpenChange = vi.fn<(open: boolean) => void>()
  const setDraftMaterialFilter = vi.fn<(value: string) => void>()
  const setDraftDateRange = vi.fn<(value: undefined) => void>()
  const applyFilterDraft = vi.fn<() => void>()
  const clearDraftFilters = vi.fn<() => void>()
  const navigate = vi.fn<(to: string) => void>()

  const firstProduct: Product = {
    id: 'p-1',
    name: 'chair',
    price: 100,
    avatar: '',
    material: 'wood',
    createdAt: '2026-01-01T00:00:00.000Z',
  }

  const searchState: SearchState = {
    searchQuery: '',
    setSearchQuery,
    clearSearch,
    hasSearch: false,
    querySearch: {},
  }

  const filterState: FilterState = {
    materialFilter: 'all',
    setMaterialFilter,
    createdDateRange: undefined,
    setCreatedDateRange,
    hasMaterialFilter: false,
    hasDateFilter: false,
    hasAnyFilter: false,
    activeStructuredFilterCount: 0,
    queryFilter: {},
    clearFilters,
  }

  return {
    firstProduct,
    listedProducts: [] as Product[],
    allProducts: [] as Product[],
    hasProducts: false,
    visibleProducts: [] as Product[],
    searchState,
    filterState,
    sortState: {
      sortValue: 'createdAt:desc',
      sortOptions: [{ value: 'createdAt:desc', label: 'Newest First' }],
      sortBy: 'createdAt',
      sortOrder: 'desc',
      querySort: { sortBy: 'createdAt', sortOrder: 'desc' },
      onSortValueChange,
    },
    filterDialogState: {
      isFilterDialogOpen: false,
      onFilterDialogOpenChange,
      draftMaterialFilter: 'all',
      setDraftMaterialFilter,
      draftDateRange: undefined,
      setDraftDateRange,
      applyFilterDraft,
      clearDraftFilters,
    },
    materialOptions: [{ value: 'all', label: 'All Materials' }],
    setSearchQuery,
    clearSearch,
    clearFilters,
    navigate,
  }
})

vi.mock('react-router-dom', async () => {
  // pakai modul asli lalu ganti navigate biar perpindahan halaman bisa diassert
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => testState.navigate,
  }
})

// mock hook search supaya state keyword bisa dikontrol langsung dari test
vi.mock('@/features/products/hooks/useProductSearchState', () => ({
  useProductSearchState: () => testState.searchState,
}))

// mock hook filter supaya kondisi filter aktif nonaktif bisa diatur cepat
vi.mock('@/features/products/hooks/useProductFilterState', () => ({
  useProductFilterState: () => testState.filterState,
}))

// mock hook sort karena halaman butuh shape sort saat render
vi.mock('@/features/products/hooks/useProductSortState', () => ({
  useProductSortState: () => testState.sortState,
}))

// mock hook dialog filter agar tidak tergantung perilaku dialog asli
vi.mock('@/features/products/hooks/useProductFilterDialogState', () => ({
  useProductFilterDialogState: () => testState.filterDialogState,
}))

// mock query products supaya data list dan data opsi bisa dipisah sesuai kebutuhan test
vi.mock('@/features/products/api/hooks/useGetProducts', () => ({
  useGetProducts: (query?: unknown) => ({
    data: query ? testState.listedProducts : testState.allProducts,
  }),
}))

// mock opsi material supaya select tetap punya sumber data statis
vi.mock('@/features/products/hooks/useProductMaterialOptions', () => ({
  useProductMaterialOptions: () => testState.materialOptions,
}))

// mock infinite list untuk ganti mode empty atau mode ada data tanpa scroll real
vi.mock('@/features/products/hooks/useProductInfiniteList', () => ({
  useProductInfiniteList: () => ({
    hasProducts: testState.hasProducts,
    visibleProducts: testState.visibleProducts,
  }),
}))

// mock table produk jadi ringan cukup render jumlah row dan tombol detail
vi.mock('@/features/products/components/ProductsTable', () => ({
  ProductsTable: (props: { products: Product[]; onRowClick?: (product: Product) => void }) => (
    <div>
      <div data-testid="table-count">{props.products.length}</div>
      <button
        type="button"
        onClick={() => {
          const first = props.products[0]
          if (first) props.onRowClick?.(first)
        }}
      >
        go detail
      </button>
    </div>
  ),
}))

// mock dialog edit karena tidak diuji di file ini
vi.mock('@/features/products/components/ProductFormDialog', () => ({
  ProductFormDialog: () => null,
}))

// mock dialog delete karena tidak diuji di file ini
vi.mock('@/features/products/components/DeleteProductDialog', () => ({
  DeleteProductDialog: () => null,
}))

// mock komponen dialog shared agar aman dari dependency portal radix
vi.mock('@/shared/ui/Dialog', () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
  DialogDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  DialogBody: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

// mock date range picker supaya render halaman tetap sederhana
vi.mock('@/shared/ui/DatePicker', () => ({
  DateRangePicker: () => <div>date-range-picker-mock</div>,
}))

// mock select shared supaya tidak tarik perilaku komponen select asli
vi.mock('@/shared/ui/Select', () => ({
  Select: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <button type="button">{children}</button>,
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

// mock simple select agar blok filter material tetap bisa dirender
vi.mock('@/shared/ui/SimpleSelect', () => ({
  SimpleSelect: () => <div>simple-select-mock</div>,
}))

describe('ProductsListPage simple', () => {
  beforeEach(() => {
    // reset state dasar biar tiap test mulai dari kondisi netral
    testState.listedProducts = []
    testState.allProducts = []
    testState.hasProducts = false
    testState.visibleProducts = []
    testState.searchState.searchQuery = ''
    testState.searchState.hasSearch = false
    testState.searchState.querySearch = {}
    testState.filterState.materialFilter = 'all'
    testState.filterState.hasAnyFilter = false
    testState.filterState.hasMaterialFilter = false
    testState.filterState.activeStructuredFilterCount = 0
    testState.filterState.queryFilter = {}
  })

  it('shows default empty state when filter is not active', () => {
    // kondisi default tanpa filter aktif harus tampil empty state umum
    render(<ProductsListPage />)
    expect(screen.getByText('No products found')).toBeInTheDocument()
  })

  it('shows filtered empty state and clears filters', async () => {
    const user = userEvent.setup()

    // setup ini khusus untuk memaksa branch filter aktif tapi data kosong
    testState.searchState.hasSearch = true
    testState.searchState.searchQuery = 'cha'
    testState.searchState.querySearch = { search: 'cha' }
    testState.filterState.materialFilter = 'wood'
    testState.filterState.hasAnyFilter = true
    testState.filterState.hasMaterialFilter = true
    testState.filterState.activeStructuredFilterCount = 1
    testState.filterState.queryFilter = { material: 'wood' }

    render(<ProductsListPage />)

    expect(screen.getByText('No products match current filters')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(testState.clearSearch).toHaveBeenCalledTimes(1)
    expect(testState.clearFilters).toHaveBeenCalledTimes(1)
  })

  it('navigates to add page and detail page', async () => {
    const user = userEvent.setup()

    // setup ini untuk mode ada data jadi products table muncul
    testState.listedProducts = [testState.firstProduct]
    testState.allProducts = [testState.firstProduct]
    testState.hasProducts = true
    testState.visibleProducts = [testState.firstProduct]

    render(<ProductsListPage />)

    expect(screen.getByTestId('table-count')).toHaveTextContent('1')
    await user.click(screen.getByRole('button', { name: 'Add product' }))
    expect(testState.navigate).toHaveBeenCalledWith('/products/new')

    await user.click(screen.getByRole('button', { name: 'go detail' }))
    expect(testState.navigate).toHaveBeenCalledWith('/products/detail/p-1')
  })
})
