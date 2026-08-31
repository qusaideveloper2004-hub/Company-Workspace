# Company Workspace

An internal company portal, built as a growing product — not a one-time tutorial project.

## Current status

Only the **Tickets** module is being actively built (by you, step by step).
Every other module below exists only as a placeholder route so the product feels complete from day one. Each will be unlocked as new Next.js topics are learned.

| Module | Route | Status |
|---|---|---|
| Dashboard | `/dashboard` | 🔒 Placeholder |
| Employees | `/employees` | 🔒 Placeholder |
| **Tickets** | `/tickets` | 🚧 **Empty — build this next** |
| Tasks | `/tasks` | 🔒 Placeholder |
| Announcements | `/announcements` | 🔒 Placeholder |
| Reports | `/reports` | 🔒 Placeholder |
| Settings | `/settings` | 🔒 Placeholder |

## Folder structure

```
app/
├── layout.tsx                 Root layout
├── page.tsx                   Public entry page ("Enter Workspace")
│
├── (dashboard)/                Route group — shared Sidebar + Navbar
│   ├── layout.tsx
│   ├── dashboard/page.tsx      Placeholder
│   ├── employees/page.tsx      Placeholder
│   ├── tickets/                 ← EMPTY. Build this module here.
│   ├── tasks/page.tsx          Placeholder
│   ├── announcements/page.tsx  Placeholder
│   ├── reports/page.tsx        Placeholder
│   └── settings/page.tsx       Placeholder
│
└── api/                         ← EMPTY. Route Handlers go here.

lib/
├── modules/                     ← EMPTY. Data layer per module (e.g. modules/tickets/data.ts).
└── types/                       ← EMPTY. Shared TypeScript types (e.g. types/ticket.ts).

components/
├── layout/
│   ├── Sidebar.tsx              Navigation for every module (active + "SOON" badges)
│   └── Navbar.tsx                Top bar, derives page title from the route
└── ui/                           ← EMPTY. Reusable UI primitives, as needed.
```

## Why this structure

- **One product, many modules** — not a separate project per feature. Shared layout, shared navigation, shared data conventions.
- **Route Groups** (`(dashboard)`) group pages that share a layout without affecting the URL.
- **`lib/modules/<name>/`** keeps each module's data layer isolated, so adding a database later means adding files, not restructuring the project.
- **Placeholders are real routes**, not comments — the product feels whole from day one, and each module unlocks in place as new topics are learned (Database, Auth, Server Actions, Uploads, Streaming, etc.) without changing the overall architecture.

## Run it

```bash
npm install
npm run dev
```
