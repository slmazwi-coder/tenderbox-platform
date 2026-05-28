# Tenderbox

A South African government procurement platform for managing tenders, bids, compliance, payments, and projects.

## Run & Operate

- `pnpm --filter @workspace/tenderbox run dev` — run the frontend (workflow: `artifacts/tenderbox: web`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite 7 + TanStack Router (client-side SPA)
- UI: Radix UI, Tailwind CSS v4, lucide-react, tw-animate-css
- Theme: deep navy primary (#1F4E79), burnt orange accent, oklch color system
- Fonts: Inter (Google Fonts)

## Where things live

- `artifacts/tenderbox/src/routes/` — TanStack Router file-based routes (index, tenders, bids, compliance, evaluation, payments, profile, projects, reports)
- `artifacts/tenderbox/src/components/` — AppSidebar, AppHeader, and shadcn/ui components
- `artifacts/tenderbox/src/styles.css` — Tailwind v4 theme with oklch color variables
- `artifacts/tenderbox/src/routeTree.gen.ts` — auto-generated route tree (do not edit)
- `artifacts/tenderbox/src/router.tsx` — TanStack Router + QueryClient setup

## Architecture decisions

- Pure client-side SPA: TanStack Router with SSR disabled, no server rendering
- TanStack Start was stripped out during migration — only `@tanstack/react-router` is used
- `head()` route metadata was removed (TanStack Start feature); meta tags live in `index.html`
- No backend API — all data is static/demo data within route components
- Supabase integration files removed as they relied on TanStack Start middleware

## Product

Tenderbox helps South African municipalities and public sector procurement officers manage the full tender lifecycle: browse open tenders, submit bids, track compliance documents, manage payments, and view evaluation and project reports.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Do NOT run `pnpm dev` at the workspace root — use `restart_workflow` or `pnpm --filter @workspace/tenderbox run dev`
- `routeTree.gen.ts` is auto-generated — edit route files in `src/routes/` instead
- The `head()` option in `createFileRoute()` is a TanStack Start feature and is not available in plain TanStack Router — use Vite's `index.html` for meta tags

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
