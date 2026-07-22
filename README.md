# Candidates Assessment — Nextise / Hire an Esquire

[![CI](https://github.com/PaulUno777/fullstack-dev-assessment/actions/workflows/ci.yml/badge.svg?branch=develop)](https://github.com/PaulUno777/fullstack-dev-assessment/actions/workflows/ci.yml)

Recruiter-facing **Candidate Review** app: list, search, filter, sort, and accept/reject pending applications. Delivered as an AI-driven fullstack assessment (plan → rules → tests → CI → atomic Git history).

> Product brief (immutable): [`INSTRUCTIONS.md`](./INSTRUCTIONS.md)  
> Decisions & extras: [`PLAN.md`](./PLAN.md)

---

## Examiner quick path (5–10 minutes)

| Step | Command / action |
|------|------------------|
| 1. Run API | `cd api/rails && bundle install && bin/rails db:setup && bin/rails server` → http://localhost:3000 |
| 2. Run client | `cd client && pnpm install && pnpm dev` → http://localhost:5173 (proxies `/candidates` to `:3000`) |
| 3. Automated checks | `cd api/rails && bin/rails test` · `cd client && pnpm test && pnpm build` |
| 4. Manual smoke | Search, multi-status filter, date sort arrow, open **Review application**, Accept/Reject, select cards + bulk bar + confirm, language EN/DE/FR, sticky header+toolbar |

**Stack:** Ruby 3.4+ / Rails 8.1 API · Node 22+ · pnpm · Vite · React 19 · TypeScript · Tailwind 4

---

## What was built (map to the brief)

| ID | Requirement | Where to look |
|----|-------------|----------------|
| A1–A3 | JSON list / show / update | `GET|PATCH /candidates`, `GET /candidates/:id` |
| A4 | Pending → accepted/rejected sets `reviewed=true`; final statuses locked | `Candidates::StatusPolicy` + `UpdateStatus` |
| C1 | List all fields except id/created/updated | `CandidateCard` + detail modal |
| C2 | Sort by date (UI) / status still supported by API | Date chip in toolbar; `sort=status` still works server-side |
| C3 | Accept/Reject + lock | Modal actions + bulk; locked rows cannot change |
| C4 | State (Redux optional) | **TanStack Query + Zustand** (see below) |

### Documented extras (beyond the brief)

Logged in [`PLAN.md`](./PLAN.md): multi-status CSV filter, `PATCH /candidates/bulk`, card multi-select + floating bulk bar + confirm, detail modal, mark-reviewed on open details, sticky translucent toolbar, locale detect + persistence, EN/DE/FR UI + API errors.

---

## Why Rails (not Django) and why not Redux?

**Rails:** The assessment allows Rails *or* Django. After speaking with **Omari Kayumba (Nextise)** about the role needing **flexibility**, I deliberately chose Rails 8 — an environment I would learn under deadline — instead of staying only in a familiar Python path. That matches an AI-driven fullstack engineer who can pick up tools quickly.

**Not Redux:** The brief *suggests* Redux; it does not require it.

- **TanStack Query** = server cache (list fetch, invalidate after PATCH)
- **Zustand** = UI filters/sort/page/selection (persisted where useful)

There is one screen, no event-sourcing or multi-feature bus. Redux would add boilerplate without buying clarity. Happy to defend this in the Loom.

---

## API cheat sheet

| Method | Path | Body / query |
|--------|------|----------------|
| `GET` | `/candidates` | `page`, `per_page`, `status` (`pending` or `pending,accepted`), `q`, `sort` (`date_applied`\|`status`), `direction` |
| `GET` | `/candidates/:id` | — |
| `PATCH` | `/candidates/:id` | `{ "candidate": { "status": "accepted" } }` **or** `{ "candidate": { "reviewed": true } }` (mark reviewed without status change) |
| `PATCH` | `/candidates/bulk` | `{ "ids": [1,2], "status": "rejected" }` → `{ data, meta: { updated, failed }, errors: [{ id, code, message }] }` |

Send `Accept-Language: de|fr|en` for localized error messages.

---

## Project layout

```
api/rails/app/services/candidates/   StatusPolicy, UpdateStatus, MarkReviewed, BulkUpdateStatus, ListQuery, Serializer
client/src/
  api/           HTTP client
  domain/        Pure helpers + Vitest (status lock, bulk partition)
  state/         Zustand UI store
  hooks/         TanStack Query
  components/    atoms → molecules → organisms
  pages/         CandidatesPage
.github/workflows/ci.yml
```

---

## AI-assisted workflow (what to ask about in the interview)

1. **Plan first:** living [`PLAN.md`](./PLAN.md) + immutable brief; phased gates before scaffolding  
2. **Rules:** Cursor rules (architecture, assessment workflow, Karpathy simplicity) so the agent stays on rails  
3. **Graphify:** knowledge graph for oriented exploration before large edits  
4. **Atomic commits** on feature branches → human-owned PRs into `develop`  
5. **Tests before polish:** Rails minitest + Vitest; CI badge on `develop`  
6. **CD omitted** on purpose (local demo + Loom) — called out in the plan  

---

## License / context

Technical assessment for the **AI-Driven Full-Stack Developer** role at Nextise, based on the original [Hire an Esquire](https://hireanesquire.com/) challenge.
