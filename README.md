# INTAN CMS

React capstone project based on a reusable internal scaffold.

## Project Context

This repository still contains scaffold modules (for example `users`, `team`, and several UI demo pages).
The implementation task in this submission is focused on the **Product Management** feature module.

## What Was Implemented (Product Management)

- Product list page with table rendering
- Search, filter, and sort using a typed query payload
- Infinite scroll for progressive list rendering
- Product detail page by dynamic route param (`:productId`)
- Create and edit forms using React Hook Form + Zod
- Delete flow with confirmation dialog
- React Query cache invalidation after mutations
- Global toast feedback and inline form error feedback
- Product-focused unit tests

## Tech Stack

- React 19 + TypeScript + Vite
- React Router v7
- TanStack Query v5
- TanStack Table
- Zustand
- Axios + axios-retry
- Zod
- Tailwind CSS v4 + Radix UI
- Vitest + Testing Library

## Setup Instructions

**Prerequisites:** Node.js 20+, pnpm 9+

```bash
pnpm install
cp .env.example .env
pnpm dev
```

## Scripts

```bash
pnpm dev              # start dev server
pnpm build            # production build
pnpm preview          # preview build
pnpm lint             # eslint
pnpm lint:fix         # eslint --fix
pnpm format           # prettier --write
pnpm format:check     # prettier --check
pnpm type-check       # tsc --noEmit
pnpm test             # vitest (watch)
pnpm test:ui          # vitest --ui
pnpm test:ui:coverage # vitest --ui --coverage
pnpm test:run         # vitest run
pnpm test:coverage    # vitest run --coverage
```

## Product Routes

- `/products` - list page
- `/products/new` - create page
- `/products/detail/:productId` - detail page
- `/products/edit/:productId` - edit page

## Requirement Alignment (Summary)

The Product module already covers the core capstone expectations:

- UI composition with reusable shared components (`ErrorState`, `LoadingState`)
- Routing with dynamic params and programmatic navigation
- Server state via React Query (typed query keys, cache invalidation on mutation)
- Local UI state via `useState`, global client state via Zustand
- Typed service layer with Zod schema validation
- Form handling + validation + pending/disabled submit state
- Consistent loading/error UX using `Suspense` + `ErrorBoundary`
- Testability with product-focused component/form/hook tests

## Product-Centric Structure

```text
src/
|-- features/
|   `-- products/
|       |-- api/
|       |   |-- hooks/        # query/mutation hooks
|       |   `-- services/     # products service layer
|       |-- components/       # ProductsTable, ProductForm, dialogs
|       |-- hooks/            # products list/form state hooks
|       |-- pages/            # list/detail/create/edit pages
|       |-- types/
|       `-- utils/
|-- shared/
|   |-- components/data-table/
|   |-- hooks/                # reusable query/infinite hooks
|   |-- lib/                  # axios, query client, helpers
|   `-- ui/                   # reusable UI components
|-- app/                      # routes, layouts, app store
`-- tests/unit/products/      # product-focused unit tests
```

## Key Product Files

- `src/features/products/pages/ProductsListPage.tsx`
- `src/features/products/pages/ProductDetailPage.tsx`
- `src/features/products/pages/CreateProductPage.tsx`
- `src/features/products/pages/EditProductPage.tsx`
- `src/features/products/api/services/productsService.ts`
- `src/features/products/utils/productListQuery.ts`
- `src/features/products/hooks/useProductInfiniteList.ts`
- `src/shared/hooks/useInfiniteScroll.ts`


## Environment Variables

Client-side variables must be prefixed with `VITE_`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000
VITE_ENABLE_DEVTOOLS=true
```

### Production Deploy (Vercel)

For Vercel deployments, set these variables in **Project Settings -> Environment Variables** (Production):

```env
VITE_API_BASE_URL=https://68789a3563f24f1fdc9e98dd.mockapi.io/api
VITE_API_TIMEOUT=30000
VITE_ENABLE_DEVTOOLS=false
```

If `VITE_API_BASE_URL` is not set in production, Axios falls back to `/api` (`src/shared/lib/axios.ts`) and requests like `/api/products` can return `404`.

## Architectural Decisions

### A. App Layering, Boundaries, and Project Structure

1. `App.tsx`, `routes.tsx`, `layouts`, dan `useUIStore.ts` dipindahkan ke folder `app` sebagai layer aplikasi. Semua yang app-level (tidak reusable) diletakkan di `app`, sedangkan yang reusable global dipindahkan ke `shared`.
   Sources:
   - https://feature-sliced.design/docs/reference/layers
   - https://medium.com/@tejasvinavale1599/the-best-folder-structure-for-scalable-react-apps-in-2025-enterprise-recommended-4fa755b8f0c7

2. API base URL disimpan di `.env` (`VITE_API_BASE_URL`) dan dipakai sebagai `baseURL` Axios. Saat ini cukup `.env` karena target masih satu env (local/mock). Kalau nanti ada staging/production, tinggal pecah ke `.env.development` / `.env.production`.
   Sources:
   - https://vite.dev/guide/env-and-mode
   - https://axios-http.com/docs/config_defaults

3. Untuk fitur produk, `index.tsx` dipakai sebagai entry point import yang rapi (`import('@/features/products')`), bukan tempat numpuk UI. UI utama tetap di `pages/` agar list/detail/create/edit berkembang rapi. Wildcard export bisa dihindari kalau nanti berpotensi ganggu tree-shaking.
   Source:
   - https://www.linkedin.com/pulse/best-practices-using-indexts-files-avoiding-tree-shaking-amin-atwi-bexmf

4. Service dan custom hook dipisah (ngikut best-practice dari feature lain), supaya service reusable untuk test/prefetching dan layer query tetap tipis.
   Source:
   - https://tanstack.com/query/v5/docs/framework/react/guides/prefetching

### B. Product Data Flow (Mock-first CRUD, Ready for Real API)

5. Detail produk (mock, karena API real hanya daftar awal):
   - Service `getProductById` tidak call endpoint detail terpisah, tapi ambil dari `getProducts()` lalu `find` by `id`.
   - Tujuannya: source detail = source list yang sudah persist lokal, jadi hasil create/edit langsung kebaca tanpa mismatch.
   - Kalau API detail sudah tersedia, logic ini diganti request ke endpoint detail.
   - Hook `useGetProductById` pakai `useSuspenseQuery` key `['products', productId]`.
   - `ProductDetailPage` buang branch `isLoading/error` manual karena sudah ditangani Suspense + ErrorBoundary.

6. Tambah produk (mock):
   - Service `createProduct`: validasi `productInputSchema`, generate `id` (`crypto.randomUUID`) + `createdAt`, prepend item baru ke awal list, lalu persist lokal.
   - Karena belum ada API create, list harus dihandle lokal supaya hasil create langsung terlihat dan tetap ada setelah refresh.
   - Saat API create real siap, logic local-generate + persist diganti request normal.
   - Hook `useCreateProduct` invalidate `['products']` setelah sukses.
   - `ProductForm` mode create pakai `mutateAsync` + state pending.
   - `CreateProductPage` tetap page terpisah (reuse `ProductForm` mode create), lalu sukses -> navigate `/products`.

7. Edit produk (mock):
   - Service `updateProduct`: validasi payload, cari item, update datanya, persist lagi.
   - `id` dan `createdAt` dipertahankan dari existing item supaya tetap entity yang sama.
   - Saat API update real siap, logic local update ini diganti request endpoint update.
   - Hook `useUpdateProduct` invalidate `['products']` dan `['products', id]`.
   - `ProductForm` mode edit kirim `{ id, payload }`.
   - `EditProductPage` ambil initial data dari `useGetProductById(productId)`, mapping ke `initialValues`, lalu reset form biar sinkron.
   - Navigasi detail -> edit -> detail pakai `replace: true` agar history flow konsisten.
   - Add/Edit page dipisah walau UI mirip karena `useSuspenseQuery` tidak punya `enabled` (tidak bisa dipanggil kondisional untuk mode create).

### C. Loading, Error, Toast, and UX Consistency (App-level)

8. Toast notification dipindah dari local state per-page ke global store Zustand, `ToastContainer` dirender sekali di `App.tsx`, supaya toast tetap aman saat pindah halaman.
   Sources:
   - https://zustand.docs.pmnd.rs/getting-started/introduction
   - https://zustand.docs.pmnd.rs/apis/create

9. Loading UI distandarisasi ke reusable `LoadingState` agar fallback suspense dan loading komponen lain konsisten.

10. Suspense dipisah 2 level:
   - `routes.tsx`: fallback global saat initial lazy-load route tree.
   - `MainLayout.tsx`: Suspense membungkus `Outlet`, jadi yang loading hanya area konten, layout tetap tampil.
   - `key={location.key}` dipakai supaya fallback remount setiap navigasi.
   Source:
   - https://react.dev/reference/react/Suspense

11. Hook API list (`users`, `products`) diubah dari `useQuery` ke `useSuspenseQuery` untuk menyatukan loading awal ke `<Suspense fallback>`, jadi page gak perlu branch `isLoading` manual. `useQuery` tetap bisa dipakai kalau butuh loading lokal per-komponen.
   Sources:
   - https://tanstack.com/query/v5/docs/framework/react/reference/useSuspenseQuery
   - https://tanstack.com/query/v5/docs/framework/react/guides/suspense
   - https://tanstack.com/query/v5/docs/framework/react/reference/useQuery

12. Error message distandarisasi lewat helper `getErrorMessage` (`Error`, `AxiosError`, payload API) supaya tidak ada silent failure.

13. `ProductForm` ditambah inline submit error (selain toast), jadi gagal submit tetap terlihat di area form.

14. Error UI di page users/products dirapikan pakai reusable `ErrorState`.

15. `ErrorBoundary` pakai `ErrorState` dan expose props (`fullScreen`, `title`, `message`, `reloadLabel`) biar boundary global dan content bisa beda copy/layout tanpa duplicate JSX.

16. Loading/error handler manual di users/products list/detail dihapus supaya page fokus render state sukses.

17. Tambah ErrorBoundary content-level di `MainLayout` (`Outlet`) dengan fallback non-fullscreen, jadi sidebar/header tetap hidup saat error feature-level. Retry pakai `queryClient.resetQueries()` biar query state ikut reset tanpa hard refresh app.

### D. Form Architecture and Validation Rules

18. Logic submit `ProductForm` dipindah ke custom hook `useProductFormSubmission` supaya komponen fokus ke render + binding field.

19. Validasi create/edit dipusatkan di `productInputSchema` + `zodResolver`.
   - Required:
     - `name` wajib (`min(1)`).
   - Format:
     - `avatar` optional, tapi kalau diisi harus URL valid + protokol `http/https`.
     - check regex `^https?://` + `new URL(value)` + validasi protocol.
     - parse gagal -> invalid.
   - Min/Max:
     - `name` max 100,
     - `price` min 0 max 1,000,000,
     - `material` max 50,
     - `description` max 500.

39. Scope `useProductFormSubmission`:
   - pilih mutation by mode (`create`/`edit`),
   - submit async,
   - expose `isMutationPending` + `submitError`,
   - toast sukses/gagal,
   - callback `onSuccess`.
   Dampak: submit logic tidak tersebar di UI dan lebih gampang dites.

### E. Product List Query Architecture (Search/Filter/Sort/Infinite)

20. Infinite scroll dijadikan reusable hook `useInfiniteScroll`.
   Flow:
   1. Konsumer (`useProductInfiniteList`) tentukan batch via `page * PAGE_SIZE`.
   2. Konsumer panggil hook dengan `enabled`, `hasMore`, `scrollContainerId`, `threshold`, `debounceMs`, `onLoadMore`.
   3. Hook attach listener ke container by id (fallback `window`).
   4. Scroll event naikin `scrollTick`, lalu diproses `useDebounce`.
   5. Kalau near-bottom (`threshold`), callback `onLoadMore()` dipanggil.
   6. Konsumer update `page` sampai `totalPages`.
   7. Layout memberi container stabil `id="app-main-scroll"`.
   8. Hook handle mount/initial-check/cleanup listener.
   Source:
   - https://blog.logrocket.com/react-infinite-scroll/

21. Search dikirim sebagai payload query dari page -> hook -> service untuk meniru request params API.
   - Search aktif minimal 3 karakter (`minLength: 3`).
   - Alur: input search -> `useProductSearchState` -> merge dengan filter/sort -> `useGetProducts(queryPayload)` -> `getProducts(queryPayload)` -> helper query (`matchesSearch`).

22. Filter (material + created date range) ikut payload flow yang sama (client contract siap backend query params).

23. Sort diproses dari payload (`sortBy`, `sortOrder`) di helper (server-side style).
   - Table-level sorting TanStack dimatikan; source of truth sorting hanya query/service.
   - Alasan utama: infinite scroll butuh urutan global dataset, bukan cuma `visibleProducts`.
   - Problem sebelum disatukan:
     1. urutan terlihat gak konsisten,
     2. setelah load batch baru urutan bisa campur,
     3. susah dipredict/debug karena 2 sumber sorting aktif.
   - Dampak: saat API real support params, mayoritas perubahan cukup di service.

24. Opsi filter `material` diambil dari base products (tanpa payload) agar dropdown tetap lengkap saat filter/search aktif.
   - Jika selected material belum ada di opsi, hook tetap inject value aktif agar tetap terlihat.
   - Catatan: nanti idealnya options datang dari API.

25. State list dipisah per-hook supaya `ProductsListPage` fokus komposisi UI:
   - `useProductSearchState`
   - `useProductFilterState`
   - `useProductFilterDialogState`
   - `useProductSortState`
   - `useProductInfiniteList`
   Alasan: lebih testable dan perubahan satu concern tidak ngerusak concern lain.

### F. Shared Reusability Decisions

26. Query-state engine dipindah ke `shared/hooks` supaya reusable lintas fitur:
   - `useSearchQueryState`
   - `useSortQueryState`
   - `useSelectDateRangeFilterState`
   - `useFilterDialogDraftState`

27. Nilai default filter `All` distandarisasi di `FILTER_ALL_VALUE` (`src/shared/constants/filters.ts`).

28. Date range type distandarisasi ke `DateRangeValue`; clone helper dipisah ke `cloneDateRange` untuk hindari mutasi tidak sengaja.

29. `DateRangePicker` ditambah `monthsToShow` + adapter `DateRangeValue`.
   - Dipakai `monthsToShow={1}` di filter products untuk dialog compact.
   - UX: compact calendar sizing + auto-apply saat range complete.

30. `DateRangePicker` ditambah `usePortal`.
   - Di products dipakai `usePortal={false}` agar popup tetap nempel di dialog.

31. `SelectTrigger` ditambah `showIcon` untuk custom trigger (hindari icon ganda, API komponen tetap reusable).

32. Empty-state products dibedakan by context:
   - default: `No products found`
   - saat search/filter aktif: `No products match current filters`

33. Visual header shared `DataTable` dirapikan (typography, border, hover) tanpa ubah behavior sorting handler TanStack.

### G. Testing Architecture and Decisions

34. Vitest pakai globals (`globals: true`) + type support di TS (`vitest/globals`, `@testing-library/jest-dom`) biar gak import API test berulang.
   Source:
   - https://vitest.dev/config/#globals

35. Coverage setup ditambah:
   - script `test:ui:coverage` dan `test:coverage`,
   - dependency `@vitest/ui` + `@vitest/coverage-v8`,
   - coverage config: provider `v8`, include `src/**/*.{ts,tsx}`, reporter `text/html/json-summary`.
   Sources:
   - https://vitest.dev/guide/ui
   - https://vitest.dev/guide/coverage

36. Struktur unit test dipindah ke `src/tests/unit` (non-co-located) untuk jaga source folder tetap bersih.
   - Trade-off: test file lebih jauh dari source file.

37. Fix test `Description` by label:
   - tambah `htmlFor` di `TextareaField`,
   - tambah `id` di textarea `ProductForm`.
   Hasil: aksesibilitas label-field valid + test stabil.
   Sources:
   - https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/label
   - https://testing-library.com/docs/queries/bylabeltext/

38. Unit test `ProductForm` mock `useProductFormSubmission` supaya fokus ke behavior form (validasi, disabled state pending, payload submit), bukan mutation/network.
   Sources:
   - https://testing-library.com/docs/user-event/intro/
   - https://vitest.dev/guide/mocking/modules
   - https://vitest.dev/api/vi#vi-hoisted

40. Unit test `ProductFormDialog` mock `ProductForm` dummy untuk isolasi logic dialog.
   - cek props mapping `initialValues`, title/description per mode, fallback saat product kosong, dan `onSuccess` menutup dialog.

41. Unit test `useProductSearchState` pakai `renderHook` + `act` untuk verifikasi trim input, payload `querySearch`, flag `hasSearch`, dan reset via `clearSearch`.
   Sources:
   - https://testing-library.com/docs/react-testing-library/api/#renderhook
   - https://react.dev/reference/react/act

46. Ditambah test hook `useProductMaterialOptions` untuk lock bug reopen filter material:
   - selected material tetap terlihat walau list kosong/terfilter,
   - fallback option tidak duplikat.

### H. Responsive and Mobile UX Decisions

42. Responsive shell app (sidebar + header) dirapikan agar mobile/desktop konsisten tanpa duplikasi logic.
   - reusable `useMediaQuery` dan `useSyncSidebarWithViewport`.
   - store UI ditambah `setSidebarOpen` eksplisit.
   - `MainLayout` handle sync viewport + mobile toggle.
   - `Sidebar` mode drawer di mobile, static/collapsed di desktop.
   - dampak UX:
     - mobile default sidebar tertutup,
     - desktop default terbuka dan bisa collapse.

43. Responsive Products List: compact di mobile, lengkap di desktop (toolbar lebih ringkas, trigger icon-friendly, add button adaptif).

44. Presentasi data produk dipisah:
   - mobile `md:hidden` card list,
   - desktop `hidden md:block` DataTable.
   `ProductDetailPage` action button juga disesuaikan untuk viewport kecil (icon-first).

45. Flow create/edit/form/delete dirapikan untuk mobile:
   - cancel/spacing page lebih proporsional,
   - submit button full-width di mobile,
   - delete dialog punya safe horizontal margin.

47. Filter dialog products dirapikan untuk mobile:
   - width aman viewport,
   - max-height aman viewport,
   - internal content scrollable,
   - area date picker pakai tinggi stabil.

48. Footer aksi filter disederhanakan:
   - `Cancel` dihapus (sudah ada close `X`),
   - label utama jadi `Apply`,
   - layout footer horizontal kanan: `Clear` + `Apply`.

### I. Routing Edge Cases (dipindah dari Notes biar gak kepisah)

- Invalid/missing `productId` dan entity-not-found dipisahkan:
  - param route tidak valid -> ErrorBoundary,
  - param valid tapi data tidak ada -> `ProductEntityNotFoundPage`.
- Wildcard `404` untuk `/products/*` ditangani di router module products.


## License
MIT







