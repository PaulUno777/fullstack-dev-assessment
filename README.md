# Paulin Nzodoum Assessment — Nextise / Hire an Esquire

[![CI](https://github.com/PaulUno777/fullstack-dev-assessment/actions/workflows/ci.yml/badge.svg?branch=develop)](https://github.com/PaulUno777/fullstack-dev-assessment/actions/workflows/ci.yml)

A modernized Rails API and React client for listing, sorting, and updating candidate
application statuses.

This repository demonstrates an **AI-driven** development workflow: a written plan
before any code, Cursor rules that encode the target architecture, clean scaffolding,
systematic testing, CI, and an atomic Git history.

> Original brief (product requirements — **do not modify**): [`INSTRUCTIONS.md`](./INSTRUCTIONS.md)  
> Living plan (audit, decisions, requirements traceability): [`PLAN.md`](./PLAN.md)

---

## Status

| Phase | Description | State |
|-------|-------------|-------|
| 1 | Docs, stack audit, Cursor rules | **Done** |
| 2 | Archive legacy code, scaffold Rails / Vite | **Done** |
| 3 | API domain + pagination/search + i18n + CI | **Done** (PR pending) |
| 4 | Client UI + tests | Pending |
| 5 | Polish README / Loom | Pending (CI already in Phase 3) |

**CD:** intentionally omitted — local demo + Loom video; no production host for this assessment.

---

## Target stack

| Layer | Technology | Version target |
|-------|------------|-----------------|
| Backend | Ruby + Rails (API-only) under `api/rails` | Ruby 3.4.x / Rails 8.1.3 |
| Database (dev/test) | SQLite | bundled with Rails |
| Frontend | Vite + React + TypeScript + Tailwind CSS | Vite 8.x / React 19.2.x / Tailwind 4.x |
| Package manager (FE) | pnpm | 10.x |
| i18n | Rails I18n + i18next | EN / DE / FR |
| Tests | Minitest (backend); Vitest later (Phase 4) | stack defaults |
| CI | GitHub Actions | lint + test on push/PR |

Legacy starters live under `old/` for provenance only.

---

## Architecture (summary)

- **Backend:** controllers orchestrate HTTP; `Candidates::StatusPolicy` / `UpdateStatus` / `ListQuery` own business rules; models validate and persist.
- **Frontend:** `domain` → `api` → `state` → `components` → `pages` (full UI in Phase 4). i18n foundation already present.
- **Security:** CORS restricted to `http://localhost:5173` — no wildcard origins.

---

## API (Phase 3)

| Method | Path | Notes |
|--------|------|--------|
| `GET` | `/candidates` | Paginated list + filters |
| `GET` | `/candidates/:id` | Show one |
| `PATCH` | `/candidates/:id` | Update `status` only |

Query params for list: `page`, `per_page`, `status`, `q` (name search), `sort` (`status` \| `date_applied`), `direction` (`asc` \| `desc`).

Response shape:

```json
{ "data": [ /* candidates */ ], "meta": { "page": 1, "per_page": 20, "total": 6, "total_pages": 1 } }
```

Errors: `{ "errors": [{ "code": "status_locked", "message": "..." }] }` — `message` localized via `Accept-Language` (`en`, `de`, `fr`).

---

## Quick start

Requires Ruby/Rails and Node 22+ with pnpm on your machine (no project-level `mise.toml`).

```bash
# Backend
cd api/rails
bundle install
bin/rails db:setup
bin/rails server
# → http://localhost:3000

# Frontend (separate terminal)
cd client
pnpm install
pnpm dev
# → http://localhost:5173
```

Checks:

```bash
cd api/rails && bin/rails test
cd client && pnpm build
```

---

## Requirements coverage

See [`PLAN.md`](./PLAN.md) for IDs A1–A4 / C1–C4 and documented scope extensions (pagination, search, i18n).

---

## License / context

Technical assessment for the AI-Driven Full-Stack Developer role at Nextise, built on
the original challenge provided by [Hire an Esquire](https://hireanesquire.com/).
