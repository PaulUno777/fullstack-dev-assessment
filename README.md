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
| API | Rails 8.1 JSON API — list / show / update status |
| Rules | Pending → accepted/rejected sets `reviewed=true`; final statuses locked |
| Client | Vite + React 19 + TypeScript + Tailwind |
| Data | TanStack Query (server cache) + Zustand (UI filters) |
| i18n | EN / DE / FR (UI + API error messages via `Accept-Language`) |
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
api/rails/          Rails API (services: StatusPolicy, UpdateStatus, ListQuery)
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
| `GET` | `/candidates` | `page`, `per_page`, `status`, `q`, `sort`, `direction` |
| `GET` | `/candidates/:id` | Show |
| `PATCH` | `/candidates/:id` | `{ "candidate": { "status": "accepted" } }` |

List response: `{ "data": [...], "meta": { page, per_page, total, total_pages } }`

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
