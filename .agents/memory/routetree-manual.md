---
name: routeTree manual management
description: How TanStack Router's routeTree.gen.ts is managed in this project and the pattern used for sub-routes
---

routeTree.gen.ts is NOT auto-generated here — it is hand-maintained because TanStack Router file-watcher is not running.

**Rule:** When adding new routes, add them as flat children of `rootRouteImport` with their full path (e.g. `path: '/contractor/tenders'`). Do NOT nest them under a parent layout route unless you explicitly want the layout pattern.

**Why:** Flat routes avoid the parent/child path resolution complexity (relative paths, outlet rendering). The manually managed tree means all registered routes are direct children of root with absolute paths. This is consistent with how all 31 existing routes are registered.

**How to apply:** Each new route file uses `createFileRoute("/full/path")`. In routeTree.gen.ts, add import, `.update({ id: '/full/path', path: '/full/path', getParentRoute: () => rootRouteImport })`, and register in `rootRouteChildren` and all three interface blocks (FileRoutesByFullPath, FileRoutesByTo, FileRoutesById, fullPaths union, to union, id union).
