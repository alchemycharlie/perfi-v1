# PerFi — Phase 4 Checkpoint

## Status: Complete

## What was produced

- `docs/perfi/phase-4-frontend-ux-admin.md` — full Phase 4 planning (16 sections)
- `docs/perfi/phase-4-checkpoint.md` — this file
- `docs/perfi/working-notes.md` — updated progress log

## Sections completed

1. Next.js App Router architecture — rendering strategy per surface, Server Components + Server Actions
2. Unified repo structure — full directory tree, no monorepo
3. Route groups — layout composition and auth behaviour per group
4. Tailwind and design system — CSS variables, colour philosophy, typography (Inter), spacing, Radix + shadcn patterns
5. Shared component strategy — 3-tier system (primitives, composed, feature), key components specified
6. Data fetching and mutation — Server Components for reads, Server Actions for mutations, minimal client state
7. Forms strategy — Zod validation, quick-add slide-out, inline editing, error handling
8. Charting and visualisation — Recharts, 9 chart types specified, cashflow calendar as custom grid, muted colours
9. Neurodiversity-aware UX principles — 6 concrete rules with per-page primary actions
10. Accessibility principles — WCAG 2.1 AA, keyboard, screen reader, contrast, reduced motion, testing strategy
11. Dashboard UX — wireframe layout, 7 cards specified, responsive behaviour, skeleton loading
12. Empty states and walkthrough — 9 empty states specified, 4-step guided tour implementation
13. Landing page structure — 9-section layout with content plan, headline/subheadline, section copy
14. Interactive preview — Granola-style scroll showcase + simpler tabbed fallback for v1
15. Admin panel UX — 6 admin pages with UX specs, dense-but-scannable design philosophy
16. Email capture and contact — waitlist form, contact form, anti-spam, auth emails, invite email strategy
17. Supplementary sections (10 gap fixes from cross-phase audit):
    - 17.1 CSV export UX
    - 17.2 Undo support (toast-based for single-item deletions)
    - 17.3 Onboarding 5-step flow UX
    - 17.4 Workspace switcher and user menu UX
    - 17.5 Settings and billing pages UX
    - 17.6 Financial goals vs savings goals UX distinction
    - 17.7 Cashflow calendar detailed UX
    - 17.8 Auth implementation reference (from Phase 3)
    - 17.9 Stripe integration reference (from Phase 3)
    - 17.10 Entitlement enforcement map (9 limits mapped to UI)

## Key decisions made

- **Server Components + Server Actions**: No separate API layer for CRUD. API routes only for webhooks and public forms.
- **No global state library**: Server Components + React context. No Redux/Zustand.
- **Radix UI + Tailwind**: Accessible primitives, styled with Tailwind. shadcn/ui as pattern reference, not a dependency.
- **Inter typeface**: Clean, excellent number rendering, open source.
- **Recharts for visualisation**: SVG-based, accessible, SSR-friendly.
- **Muted teal-green accent**: Organic, calm, not the standard fintech blue. No aggressive red/green for financial indicators.
- **CSS variables for design tokens**: Future dark mode support without rewriting classes.
- **Tabbed product preview for v1 landing page**: Simpler than scroll-based; upgradeable later.
- **Manual waitlist invites for v1**: No email service dependency. Add Resend when needed.
- **Admin is functional, not beautiful**: Denser layout, same component library.
- **axe-core in CI**: Fail builds on WCAG AA violations.

## Contradictions and risks found

- **Cloudflare deployment with App Router**: `@cloudflare/next-on-pages` supports App Router but has limitations with some Node.js APIs and Server Actions. Must verify Server Actions work on Cloudflare Workers before committing to this deployment target. Fallback: Vercel.
- **Recharts bundle size**: Recharts adds ~150KB to the bundle. Since charts are only on Analytics and Dashboard, ensure they are code-split (dynamic import) so the marketing site doesn't load them.
- **Server Actions on Cloudflare**: Server Actions require a server runtime. Cloudflare Workers support this, but edge cases (large file uploads, long-running actions) may hit limits. For v1 scope this should be fine.
- **No email service in v1**: Waitlist confirmation emails are not sent automatically. This could reduce trust ("did my signup work?"). Mitigated by the on-screen confirmation message. Should be a fast-follow.
- **Dashboard card count**: 7 cards may be too many for mobile. On mobile, consider collapsing Budget Status and Goals Progress into a single "Overview" expandable section.

## Gaps found and fixed in cross-phase audit

| Gap | Source | Fix |
|-----|--------|-----|
| CSV export — no UX | Phase 1 v1 scope | Added section 17.1: export in Settings, Free = transactions, Pro = all |
| Undo support — only confirmation, no undo | Phase 1 section 9 | Added section 17.2: toast-based undo for single-item deletions |
| Onboarding — no UX detail | Phase 2 section 8 | Added section 17.3: full 5-step UX with fields and layout |
| Workspace switcher / user menu — not designed | Phase 2 section 2 | Added section 17.4: dropdown UX for both |
| Settings and billing pages — no UX | Phase 2 page inventory | Added section 17.5: settings sections, billing states |
| Financial vs savings goals — no UX distinction | Phase 2 section 5.13 | Added section 17.6: creation flow, type badges, progress display |
| Cashflow calendar — minimal UX | Phase 2 section 5 | Added section 17.7: day cells, dots, detail panel, sparkline, responsive |
| Auth details — not referenced | Phase 3 section 8 | Added section 17.8: httpOnly cookies, signup triggers, middleware checks |
| Stripe integration — not detailed | Phase 3 section 14 | Added section 17.9: upgrade/cancel flows, webhook handler |
| Entitlements — not mapped to UI | Phase 3 section 14 | Added section 17.10: all 9 limits mapped to specific UI enforcement points |

## Readiness for Phase 5

Phase 4 provides the complete frontend blueprint. All architecture, UX patterns, component strategy, and page-level designs are defined. No blockers.

Phase 5 should cover:
- Implementation roadmap and build order
- Sprint/milestone planning
- Technical dependencies and setup tasks
- Launch checklist
- Post-launch priorities
- Master plan consolidation
