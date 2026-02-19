# INTAN CMS

A production-ready React scaffold with modern tools and sensible defaults.

## What's included

- React 19 + TypeScript + Vite
- React Router v7
- Tailwind CSS v4 + Radix UI (Dialog, Dropdown Menu, Slot)
- CVA for component variants + Lucide icons
- TanStack Query v5 + DevTools (server state)
- TanStack Table (data tables)
- Zustand v5 (client/UI state)
- Zod for schema validation
- Axios + axios-retry (HTTP client)
- ESLint + Prettier + Husky/lint-staged
- Vitest + Testing Library + Vitest UI

## Quick start

**Prerequisites:** Node.js 20+, pnpm 9+

```bash
pnpm install
cp .env.example .env
pnpm dev
```

## Scripts

```bash
pnpm dev            # start dev server
pnpm build          # production build
pnpm preview        # preview build
pnpm lint           # eslint
pnpm lint:fix       # eslint --fix
pnpm format         # prettier --write
pnpm format:check   # prettier --check
pnpm type-check     # tsc --noEmit
pnpm test           # vitest (watch)
pnpm test:ui        # vitest --ui
pnpm test:run       # vitest run
```

## Project Structure

```
src/
├── components/
│   ├── layout/     # app layouts (MainLayout, Sidebar)
│   ├── shared/     # shared components (data-table)
│   └── ui/         # reusable UI components (Avatar, Badge, Button, Checkbox, Input)
├── constants/      # app constants (navigation)
├── features/       # feature modules (home, team, users)
├── hooks/          # shared hooks (useDebounce)
├── lib/            # shared utilities/config (axios, cn, queryClient)
├── providers/      # app providers
├── routes/         # router setup
├── store/          # zustand stores (useUIStore)
├── test/           # test setup
└── types/          # global TS types (env.d.ts)
```

## Conventions

- Feature-first organization under `src/features/*`
- State:
  - TanStack Query for server state
  - Zustand for global UI/client state
  - React Context for app-level providers only
- Components:
  - `src/components/ui/` - reusable UI primitives
  - `src/components/shared/` - shared complex components (data tables, etc.)
  - `src/components/layout/` - layout components

## Notes

- Sidebar: `src/components/layout/Sidebar.tsx`
- Navigation config: `src/constants/navigation.ts`
- Data table component: `src/components/shared/data-table/`
- HTTP client config: `src/lib/axios.ts`
- Query client config: `src/lib/queryClient.ts`

## Features

### Data Table Component

A reusable data table component built with TanStack Table:

- Located at `src/components/shared/data-table/`
- Includes: TableHeader, TableBody, TablePagination, TableToolbar, TableRowActions
- Customizable via props and hooks

### Feature Modules

- **Home**: Landing page (`src/features/home/`)
- **Team**: Team management with table (`src/features/team/`)
- **Users**: User management with API integration (`src/features/users/`)

## Environment Variables

Client-side variables must be prefixed with `VITE_`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000
VITE_ENABLE_DEVTOOLS=true
```

## License

MIT

## Architecture Notes

1.  `App.tsx`, `routes.tsx`, `layouts`, dan `useUIStore.ts` dipindahkan ke folder `app` sebagai layer aplikasi. Semua yang bersifat app-level (tidak reusable) diletakkan di folder `app`. Semua yang reusable secara global dipindahkan ke folder `shared`.
    Sources:
    - https://feature-sliced.design/docs/reference/layers
    - Ada non-member link nya: https://medium.com/@tejasvinavale1599/the-best-folder-structure-for-scalable-react-apps-in-2025-enterprise-recommended-4fa755b8f0c7

2.  API base URL disimpan di `.env` (`VITE_API_BASE_URL`) dan bisa dipakai sebagai `baseURL` di instance Axios. Hanya pakai `.env` saja karena saat ini hanya menargetkan satu environment (local dev/mock API); jika nanti ada staging/production, baru dipisah ke `.env.development` / `.env.production`.
    Sources:
    - https://vite.dev/guide/env-and-mode
    - https://axios-http.com/docs/config_defaults

3.  Refer dari fitur auth dari skafold, tapi untuk fitur produk, `index.tsx` hanya dipakai sebagai entry point agar import lebih rapi (`import('@/features/products')`), bukan sebagai tempat menumpuk seluruh UI. UI utama tetap disimpan di folder `pages/` agar mudah dikembangkan untuk list/detail/create/edit sesuai kebutuhan. Mungkin bisa dihindari penggunaan wildcard exports untuk jaga bundle size (bisa jadi ada banyak yang sebenarnya tidak terpakai).
    Source:
    - https://www.linkedin.com/pulse/best-practices-using-indexts-files-avoiding-tree-shaking-amin-atwi-bexmf#:~:text=An%20index.,a%20cleaner%20interface%20for%20modules.

4.  Refer dari fitur user, tapi untuk fitur produk, service dan custom hook dipisah. Service bisa jadi reusable misal untuk test atau prefetching.
    Source:
    - https://tanstack.com/query/v5/docs/framework/react/guides/prefetching

5.  Detail produk (mock karena real api hanya daftar produk awal):
    - Service (`productsService.ts`): `getProductById` tidak call endpoint detail terpisah, tapi ambil dari `getProducts()` lalu `find` by `id`. Keputusan ini dipakai supaya sumber data detail sama dengan list yang sudah dipersist lokal; hasil create/edit mock langsung kebaca di halaman detail tanpa mismatch. Nantinya jika sudah ada API detail produk, logic "ambil dari list lalu find by id" ini tidak terpakai lagi, dan diganti dengan request ke endpoint detail langsung lalu parse response seperti biasa.
    - Hook (`useGetProductById.ts`): pakai `useSuspenseQuery` dengan key `['products', productId]`, jadi loading awal detail ikut fallback Suspense route-level dan error dilempar ke ErrorBoundary.
    - Page (`ProductDetailPage.tsx`): branch `isLoading/error` manual dihapus supaya tidak double logic karena state loading/error sudah dihandle di level layout/app dengan pattern Suspense + ErrorBoundary jadi komponen fokus render data sukses saja.

6.  Tambah produk (mock karena real api hanya daftar produk awal):
    - Service (`productsService.ts`): `createProduct` validasi payload pakai `productInputSchema`, generate `id` (`crypto.randomUUID`) + `createdAt`, lalu prepend (produk baru diletakkan di index 0/awal list) ke list dan simpan pakai `persistProducts` karena belum ada api create sehingga api list belum update dengan data produk baru, jadi list harus dihandle secara lokal supaya hasil create produk langsung terlihat dan tetap ada setelah refresh. Nantinya jika sudah ada API create produk, logic "generate id + prepend list + persist local storage" ini tidak terpakai lagi, dan diganti dengan request ke endpoint create lalu parse response seperti biasa.
    - Hook (`useCreateProduct.ts`): setelah mutation sukses, invalidate query `['products']` agar list refetch dari source lokal terbaru (yang sudah diupdate service).
    - Component (`ProductForm.tsx`): mode `create` pakai `createProductMutation.mutateAsync`, submit state terkontrol (`isPending`) dan callback `onSuccess` menerima produk hasil create.
    - Page (`CreateProductPage.tsx`): route create dipisah ke page khusus create dengan tetap reuse komponen `ProductForm` mode `create` ( alasan pemisahan ada di poin terakhir edit produk), lalu setelah sukses navigasi kembali ke `/products` sehingga user langsung lihat item baru di list.

7.  Edit produk (mock karena real api hanya daftar produk awal):
    - Service (`productsService.ts`): `updateProduct` validasi payload, cari produk yang mau diedit, update datanya, lalu simpan lagi ke local storage. Karena mock, untuk data `id` dan `createdAt` ambil dari data existing supaya produknya tetap dianggap item yang sama. Nantinya jika sudah ada API update produk, logic "cari + update + simpan ke local storage" ini tidak terpakai lagi, dan diganti dengan request ke endpoint update lalu parse response seperti biasa.
    - Hook (`useUpdateProduct.ts`): setelah sukses, invalidate query `['products']` (list) dan `['products', id]` (detail) supaya dua page itu nanti ikut sinkron/terupdate setelah edit.
    - Component (`ProductForm.tsx`): mode `edit` kirim `{ id, payload }` ke mutation update, dan tetap pakai alur submit yang sama dengan create.
    - Page (`EditProductPage.tsx`): route edit dipisah ke page khusus edit, ambil data awal edit dari `useGetProductById(productId)`, mapping ke `initialValues`, lalu `ProductForm` di-`reset` biar isi form langsung ikut sinkron/terupdate sesuai data edit yang baru didapat.
    - Komponen page add & edit produk dipisah walau UI mirip karena `useSuspenseQuery` tidak ada `enabled` seperti `useQuery`, jadi hook tidak bisa dipanggil conditional di satu komponen sedangkan add product tidak perlu fetch data.

8.  Toast notification diubah dari state lokal per halaman ke store global `zustand` dan `ToastContainer` dirender sekali di `App.tsx` supaya notifikasi tetap muncul saat pindah halaman, karena data toast disimpan satu tempat di level app dan tetap dipakai bersama oleh semua halaman lewat `useToast` tanpa mengubah cara pakainya di feature.
    Sources:
    - https://zustand.docs.pmnd.rs/getting-started/introduction
    - https://zustand.docs.pmnd.rs/apis/create

9.  UI loading distandarisai ke komponen reusable `src/shared/ui/LoadingState.tsx` baik untuk fallback suspense route-level maupun komponen lain supaya tampilannya konsisten dan maintenance lebih ringan.

10. Suspense dipisah antara level global (`routes.tsx`) dan level konten route (`MainLayout.tsx`). Di `routes.tsx`, secara global dipakai sebagai fallback saat initial lazy-load route tree untuk loading chunk code dari `lazy()`. Di `MainLayout.tsx`, suspense "membungkus" `Outlet` supaya saat route berganti yang loading hanya area konten utama sehingga layout sidebar (atau kalau ada header) tetap tampil dan `key={location.key}` dipakai agar fallback di-remount setiap navigasi, jadi fallback (loader) bisa muncul lagi setiap pindah halaman (tidak freeze dihalaman asal saat navigasi).
    Sources:
    - https://react.dev/reference/react/Suspense

11. Custom hook untuk api daftar `user` dan `product` diubah dari pakai `useQuery` jadi pakai `useSuspenseQuery` untuk menyatukan loading awal halaman ke `<Suspense fallback>` (route-level), jadi page tidak perlu branch `isLoading` manual. Jika butuh UI/UX berbeda per komponen (bukan route-level), bisa tetap pakai `useQuery` + `isLoading` lokal.
    Sources:
    - https://tanstack.com/query/v5/docs/framework/react/reference/useSuspenseQuery
    - https://tanstack.com/query/v5/docs/framework/react/guides/suspense
    - https://tanstack.com/query/v5/docs/framework/react/reference/useQuery

12. Error message distandarisasi dengan helper `getErrorMessage` di `src/shared/lib/error.ts` supaya pesan dari `Error`, `AxiosError`, dan payload API bisa ditampilkan konsisten ke user. Pemakaian awal diterapkan di fallback `ErrorBoundary`, halaman list/detail, dan feedback submit/delete form agar tidak ada silent failure. 

13. `ProductForm` ditambah inline submit error (teks di bawah tombol `Save`) selain toast, jadi saat create/update gagal user tetap dapat feedback langsung di area form.

14. Tampilan error di page `users` dan `products` dirapikan pakai komponen reusable `ErrorState` (`src/shared/ui/ErrorState.tsx`) supaya fallback UI konsisten dan maintenance lebih mudah.

15. `ErrorBoundary` sekarang pakai `ErrorState` sebagai UI fallback dan expose props konfigurasi (`fullScreen`, `title`, `message`, `reloadLabel`) supaya boundary global dan boundary konten bisa beda copy/layout tanpa nulis fallback JSX berulang.

16. Loading/error handler dipage `users`, `products list`, dan `product detail` dihapus supaya fokus ke state sukses karena loading/error sudah dihandle di level layout/app dengan Suspense + ErrorBoundary.

17. Tambah ErrorBoundary di `MainLayout` level konten (`Outlet`) dengan fallback `ErrorState` non-fullscreen, jadi saat error feature-level sidebar/header tetap tampil dan user masih bisa pindah menu. `Retry` di boundary konten pakai `onRetry` + `queryClient.resetQueries()` supaya error state query ikut di-reset lalu refetch, tanpa hard refresh seluruh app.

18. Logic submit di `ProductForm` dipindah ke custom hook `useProductFormSubmission` (`src/features/products/hooks/useProductFormSubmission.ts`) supaya komponen `ProductForm` fokus ke render + binding form field saja. Alur create/edit, toast sukses/gagal, dan inline submit error sekarang di hook biar lebih gampang untuk maintenance & testing.

19. Infinite scroll dijadikan custom hook reusable `useInfiniteScroll` (`src/shared/hooks/useInfiniteScroll.ts`) supaya bisa dipakai ulang di list lain. 
    - Flow:
    1. Data yang tampil per batch ditentuin dipage konsumer:
       Di `src/features/products/hooks/useProductInfiniteList.ts`, `page` + `PAGE_SIZE` dipakai untuk membentuk `visibleProducts = products.slice(0, page * PAGE_SIZE)`.
    2. Panggil hook dengan parameter yang jelas:
       Di `src/features/products/hooks/useProductInfiniteList.ts`, hook dipanggil dengan `enabled`, `hasMore`, `scrollContainerId`, `threshold`, `debounceMs`, dan `onLoadMore`.
    3. Hook pasang listener scroll ke target yang sesuai:
       Di `src/shared/hooks/useInfiniteScroll.ts`, target diambil dari `scrollContainerId` (kalau ada), fallback ke `window`.
    4. Event scroll tidak langsung memuat data:
       Di `src/shared/hooks/useInfiniteScroll.ts`, listener hanya menaikkan `scrollTick`, lalu `scrollTick` diproses lewat `useDebounce` untuk mengurangi trigger berlebihan.
    5. Saat posisi scroll sudah dekat bawah, hook panggil callback:
       Di `src/shared/hooks/useInfiniteScroll.ts`, perhitungan near-bottom pakai `threshold`, lalu `onLoadMore()` dipanggil jika kondisi terpenuhi.
    6. Konsumer tentuin next actionnya:
       Di `src/features/products/hooks/useProductInfiniteList.ts`, `onLoadMore` meng-update `page` (`setPage(...)`) sampai batas `totalPages`.
    7. Container scroll dibuat stabil di level layout.
       Di `src/app/layouts/MainLayout.tsx`, elemen `main` diberi `id=\"app-main-scroll\"` jadi hook selalu attach ke container yang benar.
    8. Hook otomatis aman dipakai dari awal sampai selesai.
       Di `src/shared/hooks/useInfiniteScroll.ts` (effect pertama): `target.addEventListener('scroll', handleScroll)`, `handleScroll()` (initial check), dan cleanup `target.removeEventListener('scroll', handleScroll)`.
    - Source: https://blog.logrocket.com/react-infinite-scroll/

20. Search produk sekarang dikirim sebagai payload query dari page ke hook (`useGetProducts`) lalu diteruskan ke service (`productsService.ts`) untuk meniru request params API.
     - Alur: `ProductsListPage` input search -> `useProductSearchState` bentuk query part `search` -> digabung dengan filter+sort jadi `queryPayload` -> `useGetProducts(queryPayload)` (query key `["products", queryPayload]`) -> `getProducts(queryPayload)` -> `applyProductListQuery` (`matchesSearch`).

21. Filter produk (material + created date range) juga mengikuti alur payload yang sama agar kontrak client tetap siap untuk backend query params.
    - Alur: filter dialog di `ProductsListPage` (draft) -> commit ke payload (`material`, `createdFrom`, `createdTo`) -> service -> helper (`matchesMaterial`, `matchesCreatedAt`).

22. Sort produk diproses dari payload sortBy + sortOrder, lalu helper mengurutkan data seperti response server-side sorted list.
    - Alur: kontrol sort di toolbar page -> payload query -> service -> helper (sortProducts).
    - Keputusan final: table-level sorting (TanStack getSortedRowModel) dinonaktifkan di ProductsTable, sehingga source of truth sorting hanya dari query/service.
    - Alasan (best practice untuk infinite scroll + server-side style query): sorting harus konsisten untuk seluruh dataset, bukan hanya item yang sedang terlihat (visibleProducts).
    - Cons sebelum perubahan (saat ada 2 sorting system):
      1. Urutan bisa tidak konsisten karena pada infinite scroll header table hanya me-sort `visibleProducts` (slice batch yang sedang tampil), bukan seluruh dataset products.
      2. Setelah load batch berikutnya (scroll), urutan global bisa terlihat "campur" antara hasil sort query dan sort lokal table.
      3. Sulit dipredict/debug karena ada dua sumber state sorting yang aktif bersamaan.
    - Dampak arsitektur: saat API produk real sudah support query params search/filter/sort, perubahan utama cukup di layer service (mapping payload ke request params) tanpa ubah komponen page/table.
    - Contoh payload: { search, material, createdFrom, createdTo, sortBy, sortOrder }.

23. Sumber opsi `material` untuk filter saat ini masih diambil dari data list produk yang sedang loaded (`useProductMaterialOptions`) untuk kebutuhan mock/local flow.
    - Keputusan untuk real API: opsi filter sebaiknya berasal dari backend (facet/metadata endpoint, misalnya `/products/filters` atau `/products/materials`) atau dari enum hardcoded jika domain category memang fixed.
    - Implikasi: logic "derive material options dari list aktif" dianggap sementara; saat backend sudah siap, cukup ganti source options (hook/service terkait) tanpa ubah flow dialog filter di page.

24. State list products (search/filter/sort/infinite) dipisah jadi hook per fungsi agar `ProductsListPage` fokus ke komposisi UI, bukan detail state:
    - `useProductSearchState` (`src/features/products/hooks/useProductSearchState.ts`) untuk input keyword + query part `search`.
    - `useProductFilterState` (`src/features/products/hooks/useProductFilterState.ts`) untuk filter aktif `material` + `createdFrom/createdTo`.
    - `useProductFilterDialogState` (`src/features/products/hooks/useProductFilterDialogState.ts`) untuk alur draft dialog (open/edit/apply/clear) tanpa langsung mengubah filter aktif.
    - `useProductSortState` (`src/features/products/hooks/useProductSortState.ts`) untuk opsi sort + query part `sortBy/sortOrder`.
    - `useProductInfiniteList` (`src/features/products/hooks/useProductInfiniteList.ts`) untuk batching `visibleProducts` + reset page saat query berubah.
    - Alasan: lebih mudah dites per hook, dan perubahan di satu fungsi tidak bikin fungsi lain ikut rusak.

25. Engine reusable query-state dipindah ke layer `shared/hooks` untuk dipakai lintas fitur, bukan khusus products:
    - `useSearchQueryState` (`src/shared/hooks/useSearchQueryState.ts`)
    - `useSortQueryState` (`src/shared/hooks/useSortQueryState.ts`)
    - `useSelectDateRangeFilterState` (`src/shared/hooks/useSelectDateRangeFilterState.ts`)
    - `useFilterDialogDraftState` (`src/shared/hooks/useFilterDialogDraftState.ts`)
    - Alasan: karena pola state ini dipakai berulang di banyak halaman list, kita jadikan reusable supaya tidak copy-paste dan format data ke API tetap seragam.

26. Nilai default opsi filter "All" distandarisasi di konstanta global `FILTER_ALL_VALUE` (`src/shared/constants/filters.ts`) dan dipakai oleh products filter.
    - Alasan: mencegah hardcoded string tersebar, mengurangi typo/inconsistency saat nanti ada fitur lain yang butuh pola filter serupa.

27. Tipe date range distandarisasi ke `DateRangeValue` (`src/shared/types/dateRange.ts`) dan helper clone dipisah ke `cloneDateRange` (`src/shared/lib/dateRange.ts`).
    - Alasan: supaya tipe date range tidak ditulis ulang di banyak file, dan supaya perubahan nilai tanggal di satu tempat tidak tanpa sengaja mengubah data di tempat lain.

28. `DateRangePicker` diperluas dengan prop `monthsToShow` (`src/shared/ui/DatePicker.tsx`) dan adapter type `DateRangeValue`.
    - Pemakaian awal: filter dialog products pakai `monthsToShow={1}` agar dialog lebih ringkas.
    - Alasan: komponen date range jadi fleksibel untuk kebutuhan compact (toolbar/dialog sempit) atau full (2 bulan) tanpa bikin komponen baru.

29. `SelectTrigger` ditambah prop `showIcon` (`src/shared/ui/Select.tsx`) untuk kasus trigger custom (misal tombol sort dengan icon sendiri).
    - Alasan: menghindari icon ganda dan menjaga API komponen tetap reusable tanpa bikin komponen Select versi baru/terpisah.

30. Empty-state list products dibedakan berdasarkan context filter aktif di `ProductsListPage`:
    - Default: `No products found`
    - Saat search/filter aktif: `No products match current filters`
    - Alasan: feedback lebih jelas ke user apakah data memang kosong dari source, atau kosong karena filter/pencarian yang dipilih user.

31. Visual header pada shared `DataTable` dirapikan (typography, border, dan hover state) tanpa mengubah perilaku sorting handler TanStack Table.
    - Alasan: meningkatkan konsistensi visual tabel reusable, sementara behavior sorting tetap sama.
