---
name: Contractor route structure
description: How contractor-specific routes are organised and protected
---

All contractor pages live under the /contractor/* prefix:
- /contractor — dashboard (contractor.tsx)
- /contractor/profile, /contractor/tenders, /contractor/bids, /contractor/payments, /contractor/projects

**Protection:** Each page component is wrapped with `<RoleGuard allowedRoles={["contractor","employee"]}>` from `src/components/RoleGuard.tsx`. The guard reads `useProfile()` and redirects to `getRoleRoute(profile.role)` if the role doesn't match.

**Why flat routes:** Avoids TanStack Router layout/outlet nesting complexity when routeTree is manually managed. Each route is an independent flat child of root.

**Index route:** src/routes/index.tsx is now a redirect — it reads profile.role and navigates to getRoleRoute(role) immediately. All roles land on their own dashboard after login.

**Sidebar:** AppSidebar.tsx reads useProfile().role and renders role-specific nav (CONTRACTOR_NAV, CLIENT_NAV, CONSULTANT_NAV, AUDITOR_NAV, DEFAULT_NAV) plus a portal badge ("Contractor Portal" etc.).
