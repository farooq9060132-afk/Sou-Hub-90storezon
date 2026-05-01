# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/scripts run seed` — seed admin user (admin@90storzon.com / Admin1234!)
- `pnpm --filter @workspace/scripts run test` — run API integration test suite (23 tests)

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Project: 90StorZon

Full-stack productivity & affiliate hub built with React+Vite+wouter (frontend) and Express+PostgreSQL (backend).

### Features
- 9 free online tools (Age, BMI, Loan, Percentage, Word Counter, Password Gen, QR Code, Unit Converter, Domain Authority)
- Blog (CRUD in admin, SEO meta tags on posts)
- Shop with affiliate click tracking
- Admin panel with tabbed interface: Dashboard, Blog, Products, Users, Analytics
- Analytics: page views, daily bar chart (Recharts), traffic sources pie chart, affiliate click stats
- Auth: cookie-based sessions, PBKDF2 password hashing
- SEO: per-page meta tags via SEO component, Open Graph, Twitter card, canonical links
- AdSense placeholders (header, sidebar, in-content, footer slots)
- Lazy routing via React.lazy + Suspense
- robots.txt in public, sitemap.xml served dynamically at /api/sitemap.xml

### DB Schema (key tables)
- `users` — id, name, email, password_hash, is_admin, created_at
- `blog_posts` — id, title, slug, excerpt, content, category, image_url, meta_title, meta_description, created_at, updated_at
- `products` — id, name, description, price, category, image_url, external_link, featured, created_at
- `page_views` — id, page, referrer, user_agent, ip, created_at
- `tool_usage` — id, tool, count
- `affiliate_clicks` — id, product_id, ip, user_agent, created_at

### API Routes
All under `/api`:
- `GET|POST /auth/*` — register, login, logout, me
- `GET /blog/posts`, `GET /blog/posts/:slug`, `POST /blog/posts` (admin), `PUT /blog/posts/by-id/:id` (admin), `DELETE /blog/posts/by-id/:id` (admin)
- `GET /shop/products`, `GET /shop/products/:id`, `POST /shop/products` (admin), `PUT /shop/products/:id` (admin), `DELETE /shop/products/:id` (admin), `POST /shop/products/:id/click`, `GET /shop/affiliate-stats` (admin)
- `GET /analytics/summary`, `GET /analytics/daily`, `POST /analytics/track`
- `GET /admin/stats`, `GET /admin/users` (admin), `DELETE /admin/users/:id` (admin)
- `GET /sitemap.xml`, `GET /robots.txt`

### Important Notes
- `lib/api-zod/src/index.ts` must ONLY export `./generated/api`. Codegen overwrites it — re-fix after each codegen run.
- Admin credentials: admin@90storzon.com / Admin1234! (run seed script to set)
- Blog by-ID routes use `/blog/posts/by-id/:id` (to avoid slug conflict)
- Auth uses PBKDF2 (not bcrypt). Seed script uses same algorithm.
