# Paulin Nzodoum Assessment — Nextise / Hire an Esquire

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
| 2 | Archive legacy code, scaffold Rails / Vite | **Done** (PR pending) |
| 3 | API domain logic + tests | Pending |
| 4 | Client UI + tests | Pending |
| 5 | CI + final README | Pending |

---

## Target stack

| Layer | Technology | Version target |
|-------|------------|-----------------|
| Backend | Ruby + Rails (API-only) under `api/rails` | Ruby 3.4.x / Rails 8.1.3 |
| Database (dev/test) | SQLite | bundled with Rails |
| Frontend | Vite + React + TypeScript + Tailwind CSS | Vite 8.x / React 19.2.x / Tailwind 4.x |
| Package manager (FE) | pnpm | 10.x |
| Tests | Minitest (backend); Vitest later (Phase 4) | stack defaults |
| CI | GitHub Actions | lint + test on every push/PR (Phase 5) |

The legacy starters (Rails 5.2, CRA, Django) are preserved under `old/` after Phase 2,
for provenance only — they are not part of the active codebase.

---

## Architecture (summary)

- **Backend:** controllers only orchestrate HTTP; application services own the status
  transition rules (auto-set `reviewed`, lock once a status is final); models handle
  validation and persistence.
- **Frontend:** layered as `domain` (pure business rules) → `api` (network) → `state`
  → presentational `components` → `pages` (containers).
- **Security:** CORS restricted to the Vite dev origin only — no wildcard origins.

Full rules live in [`.cursor/rules/architecture.mdc`](./.cursor/rules/architecture.mdc)
and [`.cursor/rules/assessment-workflow.mdc`](./.cursor/rules/assessment-workflow.mdc).

---

## Quick start

Requires Ruby/Rails and Node 22+ with pnpm already installed on your machine
(no project-level `mise.toml`).

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

Useful checks:

```bash
cd api/rails && bin/rails test
cd client && pnpm build
```

---

## Requirements coverage

See the full traceability table in [`PLAN.md`](./PLAN.md), mapping implementation to
requirement IDs A1–A4 (API) and C1–C4 (Client) from `INSTRUCTIONS.md`.

---

## License / context

Technical assessment for the AI-Driven Full-Stack Developer role at Nextise, built on
the original challenge provided by [Hire an Esquire](https://hireanesquire.com/).