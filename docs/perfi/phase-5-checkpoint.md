# PerFi — Phase 5 Checkpoint

## Status: Complete

## What was produced

- `docs/perfi/phase-5-roadmap-handoff.md` — 10 sections covering roadmap, risks, deployment, and handoff
- `docs/perfi/final-master-plan.md` — consolidated master reference document
- `docs/perfi/phase-5-checkpoint.md` — this file
- `docs/perfi/working-notes.md` — updated progress log

## Sections completed (Phase 5)

1. Phase-by-phase implementation roadmap — 6 build phases (A–F) with tasks and exit criteria
2. Recommended build order — week-by-week timeline, parallelism opportunities
3. Technical priorities for MVP — must-haves before launch, implementation notes from Phase 3
4. Leanest smart launch path — 4-step sequence (marketing → beta → billing → public launch)
5. Risks, caveats, and founder warnings — 5 real risks + compliance positioning requirements
6. Where complexity is being underestimated — cashflow calendar, Stripe webhooks, RLS performance, demo data, category seeding
7. What should be postponed — 11 post-v1 features, 5 fast-follows
8. Recommended email and campaign tools — Resend (transactional), Buttondown (marketing), Supabase Auth (auth emails)
9. Deployment recommendation — **Vercel** (changed from Cloudflare), full stack summary, £0 launch cost
10. Final implementation handoff — document priority order, first steps

## Final master plan

`final-master-plan.md` consolidates all 5 phases into a single implementation reference covering:

- Product summary, principles, and audience
- Tech stack
- Full 17-table schema summary
- Auth, security, and RLS
- Pricing and entitlements
- Stripe integration
- Onboarding and demo data
- Key UX and architecture decisions
- Build order (6 phases, 10–14 weeks)
- Deployment stack
- Compliance positioning
- Post-v1 roadmap
- Document index

## Key decisions made in Phase 5

- **Deployment changed from Cloudflare to Vercel** — risk of Cloudflare + Next.js App Router friction is not worth it for a solo founder. Cloudflare remains for DNS.
- **Resend for transactional email** — free tier sufficient, React Email templates, fast integration.
- **Buttondown for marketing email** — simple newsletter tool for waitlist nurture and launch announcements.
- **10–14 weeks estimated build time** — realistic range for solo founder full-time. 16–20 weeks including design, copy, and marketing.
- **Lean launch sequence**: marketing site first (week 2–3), beta users (week 7–8), Stripe (week 9–10), public launch (week 11–12).

## Contradictions and risks flagged

- **Cloudflare → Vercel**: Reversed the Phase 4 assumption. Vercel is the safer choice for Next.js App Router.
- **Solo founder scope realism**: 17 tables, ~30 pages, Stripe billing, admin panel — this is a real product. 10–14 weeks is optimistic.
- **Manual entry fatigue**: The #1 churn risk. Quick-add UX must be obsessively fast.
- **Accessibility accountability**: Marketing ND/accessibility creates user expectations. Must deliver WCAG AA, not just claim it.
- **Compliance**: All copy must position PerFi as tracking/planning, never as financial advice.

## Planning pack completeness

| Document                         | Status   | Pages                                    |
| -------------------------------- | -------- | ---------------------------------------- |
| Phase 1 — Product definition     | Complete | Product, scope, principles, positioning  |
| Phase 2 — IA, flows, pricing     | Complete | 29 pages, 13 flows, pricing tiers        |
| Phase 3 — Data, schema, security | Complete | 17 tables, RLS, auth, Stripe             |
| Phase 4 — Frontend, UX, admin    | Complete | Architecture, all page UX, accessibility |
| Phase 5 — Roadmap, handoff       | Complete | Build order, deployment, risks           |
| Final master plan                | Complete | Consolidated reference                   |
| Working notes                    | Complete | All questions resolved or documented     |

**The planning pack is ready for implementation.**
