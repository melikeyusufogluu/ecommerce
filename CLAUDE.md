# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Next.js version

This project runs Next.js 16.4 with React 19.3, and its APIs differ from older Next.js versions. Before writing framework code, read the bundled docs in `node_modules/next/dist/docs/` (`01-app/`, `03-architecture/`, and so on). In particular:
- Route `params` is a `Promise` and must be awaited, in both pages and route handlers.
- Layouts use the global `LayoutProps<"/">` type helper.
- `next.config.ts` turns on `cacheComponents`, `partialPrefetching` and `experimental.agentFeedback`, and loads Tailwind v4 through a Turbopack CSS rule (`@tailwindcss/turbopack`). There is no PostCSS config.

## Commands

- `npm run dev`: start the dev server at http://localhost:3000.
- `npm run build`: production build. This also type-checks the code.
- `npm run start`: serve the production build.
- `npm run lint`: run ESLint 9 (flat config in `eslint.config.mjs`, using `eslint-config-next`).

The project has no test framework.

## Environment

`MONGODB_URI` must be set in `.env`, which is gitignored. `app/api/db.ts` throws when the module is imported if the variable is missing, so any route that imports it fails without it.

## Architecture

This is an App Router e-commerce demo. All code lives under `app/`, and the `@/*` import alias points to the repo root.

- **Data layer (`app/api/db.ts`):** `connectToDb()` returns `{ client, db }` for the `ecommerce-nextjs` database. During development, one `MongoClient` is cached on `globalThis` so that hot reloads reuse it. The database has two collections:
  - `products`: documents shaped like the `Product` interface, looked up by the string field `id` (not `_id`).
  - `carts`: `{ userId: string, cartIds: string[] }`. POST adds a product with `$addToSet` plus upsert, so the cart's product list never contains duplicates. DELETE removes one with `$pull`.
- **API routes (`app/api/`):** `products/` and `products/[id]` are read-only. `users/[id]/cart` handles GET, POST and DELETE. POST and DELETE take a JSON body of `{ productId }`, and every cart response returns the full list of products in the cart.
- **Pages:** `products/`, `products/[id]`, `cart/` (a client component) and `checkout/` (a placeholder). The pages do **not** call the API yet. They still import the static array from `app/product-data.ts`, and the cart page uses hard-coded IDs. `app/product-data.ts` also holds the `Product` type, which is shared with `ProductList.tsx`.
- **Images:** product images are files in `public/`, referenced as `"/" + product.imageUrl`.
