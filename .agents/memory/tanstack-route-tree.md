---
name: TanStack Router route tree
description: The routeTree.gen.ts is NOT auto-generated at runtime — the TanStack Router Vite plugin is not configured. New routes require manual edits to routeTree.gen.ts.
---

## Rule
When adding a new route file under `artifacts/tenderbox/src/routes/`, you must also manually register it in `artifacts/tenderbox/src/routeTree.gen.ts`.

**Why:** The `@tanstack/router-plugin/vite` plugin is not in `vite.config.ts`, so the route tree is never auto-regenerated. The file has a comment saying "do not edit" but it must be edited here.

**How to apply:** For each new route (e.g. `login.tsx`), add:
1. An import: `import { Route as LoginRouteImport } from './routes/login'`
2. A route update: `const LoginRoute = LoginRouteImport.update({ id: '/login', path: '/login', getParentRoute: () => rootRouteImport } as any)`
3. Entries in: `FileRoutesByFullPath`, `FileRoutesByTo`, `FileRoutesById`, `fullPaths` union, `to` union, `id` union, `RootRouteChildren`, `FileRoutesByPath` declare block, `rootRouteChildren` object.
