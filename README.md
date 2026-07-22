# Candidates Assessment — Nextise / Hire an Esquire

[![CI](https://github.com/PaulUno777/fullstack-dev-assessment/actions/workflows/ci.yml/badge.svg?branch=develop)](https://github.com/PaulUno777/fullstack-dev-assessment/actions/workflows/ci.yml)

Review job applications: list candidates, filter/search/sort, and accept or reject
**pending** profiles. Built as an AI-driven fullstack assessment delivery
(plan → architecture rules → tests → CI → atomic Git history).

> Product brief (immutable): [`INSTRUCTIONS.md`](./INSTRUCTIONS.md)  
> Decisions & requirement traceability: [`PLAN.md`](./PLAN.md)

---

## Quick start (< 2 minutes)

Needs Ruby 3.4+ / Rails 8.1, Node 22+, and pnpm on your machine.

```bash
# API
cd api/rails
bundle install
bin/rails db:setup
bin/rails server   # http://localhost:3000

# Client (second terminal)
cd client
pnpm install
pnpm dev           # http://localhost:5173
```

Checks:

```bash
cd api/rails && bin/rails test
cd client && pnpm test && pnpm build
```

---

## What you get

| Area | Implementation |
|------|----------------|
| API | Rails 8.1 JSON API — list / show / update status / bulk update |
| Rules | Pending → accepted/rejected sets `reviewed=true`; final statuses locked |
| Client | Vite + React 19 + TypeScript + Tailwind |
| Data | TanStack Query (server cache) + Zustand (UI filters, persisted) |
| i18n | EN / DE / FR (UI + API error messages via `Accept-Language`; browser detect on first visit) |
| CI | GitHub Actions — API tests + client test/lint/build |

**CD:** intentionally omitted (local demo + Loom). No disposable cloud deploy for this assessment.

---

## Why not Redux? (Loom talking point)

The brief *suggests* Redux but does not require it. This app uses:

- **TanStack Query** for server state (fetch, cache, invalidate after PATCH)
- **Zustand** for local UI state (search, status filter, sort, page)

Redux would add boilerplate and a global event-sourced-style store for one screen.
There is no complex cross-feature event bus here — Query + Zustand stay easier to
explain, test, and change.

---

## Project structure

```
api/rails/          Rails API (services: StatusPolicy, UpdateStatus, BulkUpdateStatus, ListQuery)
client/src/
  api/              HTTP client
  domain/           Pure rules (canChangeStatus) + Vitest
  state/            Zustand UI store
  hooks/            TanStack Query hooks
  components/       atoms → molecules → organisms
  pages/            CandidatesPage
INSTRUCTIONS.md     Original hiring brief
PLAN.md             Audit, scope extensions, traceability
```

---

## API cheat sheet

| Method | Path | Notes |
|--------|------|--------|
| `GET` | `/candidates` | `page`, `per_page`, `status` (single or CSV e.g. `pending,accepted`), `q`, `sort`, `direction` |
| `GET` | `/candidates/:id` | Show |
| `PATCH` | `/candidates/:id` | `{ "candidate": { "status": "accepted" } }` |
| `PATCH` | `/candidates/bulk` | `{ "ids": [1,2], "status": "accepted" }` → `{ data, meta: { updated, failed }, errors }` |

List response: `{ "data": [...], "meta": { page, per_page, total, total_pages } }`

Bulk reuses the same status lock rules as single update (`Candidates::UpdateStatus`). Partial success returns `200` with per-id errors.

---

## UI extras (beyond the brief)

Documented in [`PLAN.md`](./PLAN.md): multi-status filter, card selection + floating bulk bar + confirm, detail modal, sticky toolbar with pagination, Review CTA + reviewed badge, chip status filter + date sort, filter/sort/locale persistence, browser language detect. List UI stays **cards** (2 columns on large screens), not a table.

---

## Requirements coverage

| ID | Brief requirement | Status |
|----|-------------------|--------|
| A1–A4 | JSON API list/show/update + `reviewed` rule | Done |
| C1–C3 | List UI, sort UI, status actions + lock | Done |
| C4 | Redux optional | TanStack Query + Zustand (documented) |

---

## License / context

Technical assessment for the AI-Driven Full-Stack Developer role at Nextise,
based on the original challenge from [Hire an Esquire](https://hireanesquire.com/).
