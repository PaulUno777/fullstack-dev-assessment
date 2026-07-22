# Candidates Assessment — Nextise / Hire an Esquire

[![CI](https://github.com/PaulUno777/fullstack-dev-assessment/actions/workflows/ci.yml/badge.svg?branch=develop)](https://github.com/PaulUno777/fullstack-dev-assessment/actions/workflows/ci.yml)

Recruiter-facing **candidate review** app: list applications as cards, filter/search/sort, open a detail modal, and accept or reject **pending** candidates (single + bulk). Delivered as an AI-driven fullstack assessment (plan → rules → tests → CI → atomic commits).

| Doc | Purpose |
|-----|---------|
| [`INSTRUCTIONS.md`](./INSTRUCTIONS.md) | Immutable product brief (A1–A4 / C1–C4) |
| [`PLAN.md`](./PLAN.md) | Decisions, extras beyond the brief, requirement IDs |
| This README | Run, test, and review the delivery |

---

## Examiner quick path (5 minutes)

```bash
# 1) API
cd api/rails && bundle install && bin/rails db:setup && bin/rails server
# → http://127.0.0.1:3000

# 2) Client (other terminal)
cd client && pnpm install && pnpm dev
# → http://127.0.0.1:5173  (Vite proxies /candidates → :3000)
```

**Smoke the UI**

1. Sticky teal toolbar: search, status multi-filter, date sort chip (↑/↓), `Page X of Y · N` + ‹ ›  
2. Click a card body/checkbox to select (teal rim); floating bulk bar → confirm Accept/Reject  
3. **Review application** opens the modal and marks `reviewed=true` (status stays pending until Accept/Reject)  
4. Accept/Reject in the modal locks status; locked cards cannot change again  
5. Switch language (globe) — UI + API errors follow `Accept-Language` (EN/DE/FR)  
6. Reload — status filter + sort + locale persist; selection does not  

**Automated checks**

```bash
cd api/rails && bin/rails test
cd client && pnpm test && pnpm build
# optional: pnpm lint
```

CI runs the same suite on `develop` (badge above).

---

## What was built (map to the brief)

| ID | Requirement | Where to look |
|----|-------------|----------------|
| A1–A3 | JSON list / show / update | `api/rails/app/controllers/candidates_controller.rb` |
| A4 | pending→accepted/rejected ⇒ `reviewed=true`; finals locked | `Candidates::StatusPolicy`, `Candidates::UpdateStatus` |
| C1 | List all fields except id/created/updated | `CandidateCard` + detail modal |
| C2 | Sort UI | Date-applied chip (direction toggle). API still accepts `sort=status` |
| C3 | Accept/Reject via API + lock | Modal actions + bulk bar → `PATCH` |
| C4 | State (Redux optional) | TanStack Query + Zustand — rationale below |

**Extras (documented in PLAN, not required by the brief):** multi-status filter (`status=pending,accepted`), `PATCH /candidates/bulk`, sticky toolbar + pagination, click-to-select + confirm dialog, mark-reviewed on open details, i18n persistence + browser language detect, 16 seed candidates.

---

## Stack

| Layer | Choice |
|-------|--------|
| API | Rails 8.1 API-only, SQLite, service objects |
| Client | Vite, React 19, TypeScript, Tailwind 4, pnpm |
| Server state | TanStack Query |
| UI state | Zustand (`persist` for filters/sort) |
| i18n | i18next (EN/DE/FR) + Rails `Accept-Language` |
| Tests | Minitest (API), Vitest (client domain) |
| CI | GitHub Actions — no CD (local + Loom) |

### Why not Redux?

The brief *suggests* Redux; it does not require it. One screen does not need a global event bus:

- **TanStack Query** — fetch, cache, invalidate after PATCH  
- **Zustand** — page, search, status chips, sort, selection  

Easier to explain in Loom and to change under assessment time pressure.

---

## Project layout

```
api/rails/
  app/models/candidate.rb
  app/services/candidates/   StatusPolicy, UpdateStatus, BulkUpdateStatus,
                             MarkReviewed, ListQuery, Serializer
  app/controllers/candidates_controller.rb
  db/seeds.rb                16 varied candidates
  test/                      controller + service tests

client/src/
  api/candidates.ts          HTTP client
  domain/                    canChangeStatus, bulk helpers + Vitest
  state/candidatesUiStore.ts Zustand (+ persist)
  hooks/useCandidatesQuery.ts
  components/                atoms → molecules → organisms
  pages/CandidatesPage.tsx
  i18n/                      en / de / fr + browser detect
```

---

## API cheat sheet

Base URL: `http://127.0.0.1:3000` (or same-origin via Vite proxy).

| Method | Path | Body / query |
|--------|------|----------------|
| `GET` | `/candidates` | `page`, `per_page`, `status` (CSV or array), `q`, `sort` (`date_applied`\|`status`), `direction` |
| `GET` | `/candidates/:id` | — |
| `PATCH` | `/candidates/:id` | `{ "candidate": { "status": "accepted" } }` **or** `{ "candidate": { "reviewed": true } }` |
| `PATCH` | `/candidates/bulk` | `{ "ids": [1,2], "status": "accepted" }` → `{ data, meta: { updated, failed }, errors: [{ id, code, message }] }` |

List shape: `{ "data": [...], "meta": { page, per_page, total, total_pages } }`.

Send `Accept-Language: de` (or `fr`) to localize error messages.

**curl examples**

```bash
curl -s 'http://127.0.0.1:3000/candidates?status=pending&per_page=5' | jq .
curl -s -X PATCH http://127.0.0.1:3000/candidates/1 \
  -H 'Content-Type: application/json' \
  -d '{"candidate":{"status":"accepted"}}' | jq .
curl -s -X PATCH http://127.0.0.1:3000/candidates/bulk \
  -H 'Content-Type: application/json' \
  -d '{"ids":[1,2,3],"status":"rejected"}' | jq .
```

---

## Manual test script (examiner)

| # | Action | Expected |
|---|--------|----------|
| 1 | `db:setup` / open app | ≥1 page of cards; meta shows total (seeds = 16) |
| 2 | Multi-select Pending | Only pending cards |
| 3 | Toggle date sort chip | Order flips; arrow updates |
| 4 | Select 2 pending → Accept in bulk bar → confirm | Both accepted, `reviewed=true`, selection cleared |
| 5 | Open **Review application** on an unreviewed card | Modal opens; badge → Reviewed; status still pending |
| 6 | Accept in modal | Status accepted; actions locked afterward |
| 7 | Try Reject on an accepted card | Locked message / API `status_locked` |
| 8 | Change language to DE, force a locked PATCH | German error copy |
| 9 | Reload | Filters/sort/locale restored |

---

## Branches & history

Integration branch: **`develop`**. Feature work lands via human-owned PRs (e.g. `feat/ui-ux-enhancements`). Prefer reading Conventional Commits on the PR rather than a single squash for the delivery story.

---

## License / context

Technical assessment for the **AI-Driven Full-Stack Developer** role at Nextise, based on the challenge from [Hire an Esquire](https://hireanesquire.com/).
