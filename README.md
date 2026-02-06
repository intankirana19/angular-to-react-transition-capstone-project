# AIT React Scaffold

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