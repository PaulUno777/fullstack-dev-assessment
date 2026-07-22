# Candidate Review

A small internal tool for reviewing job applicants: list, search, filter, sort,
and accept or reject candidates one at a time or in bulk with a locked
final state once a decision is made.

[![CI](https://github.com/PaulUno777/fullstack-dev-assessment/actions/workflows/ci.yml/badge.svg?branch=develop)](https://github.com/PaulUno777/fullstack-dev-assessment/actions/workflows/ci.yml)

> Original product brief: [`INSTRUCTIONS.md`](./INSTRUCTIONS.md)
> Working notes / decisions log: [`PLAN.md`](./PLAN.md)
> Changelog: [`CHANGELOG.md`](./CHANGELOG.md)

---

## Stack

- **API:** Ruby 3.4 / Rails 8.1 (API-only)
- **Client:** Vite / React 19 / TypeScript / Tailwind 4
- **State:** TanStack Query (server cache) + Zustand (UI state)
- **Tests:** Minitest (API) / Vitest (client)
- **CI:** GitHub Actions

## Getting started

```bash
# API
cd api/rails
bundle install
bin/rails db:setup
bin/rails server        # http://localhost:3000

# Client (separate terminal)
cd client
pnpm install
pnpm dev                 # http://localhost:5173, proxies /candidates to :3000
```

Run the test suites:

```bash
cd api/rails && bin/rails test
cd client && pnpm test && pnpm build
```

## What it does

- Search candidates by name, filter by one or more statuses, sort by date
  applied
- Review a candidate's full profile in a detail view, accept or reject them
  once decided, that status is final and can't be changed
- Select several candidates at once and accept/reject them together, with a
  confirmation step before it's applied
- Available in English, German, and French — picks up your browser's language
  on first visit, remembers your choice afterward
- Sticky toolbar so filters/search stay reachable while scrolling a long list

## API

| Method | Path | Notes |
|---|---|---|
| `GET` | `/candidates` | `page`, `per_page`, `status` (comma-separated), `q` (name search), `sort`, `direction` |
| `GET` | `/candidates/:id` | — |
| `PATCH` | `/candidates/:id` | `{ "candidate": { "status": "accepted" } }` |
| `PATCH` | `/candidates/bulk` | `{ "ids": [1,2], "status": "rejected" }` → per-item success/failure in the response |

Send `Accept-Language: de` or `fr` for localized error messages (defaults to
English).

## Architecture notes

The API keeps controllers thin they only handle HTTP (params in, status/JSON
out). The actual business rule (a candidate can move from pending to
accepted/rejected, and is locked once decided) lives in a dedicated service,
`Candidates::UpdateStatus`, backed by a `StatusPolicy`. The bulk endpoint
reuses the same policy, so a batch update can't bypass the single-update rules.

The client is layered similarly: pure domain helpers (e.g. "can this
candidate's status still change") have no framework dependency and are unit
tested directly; the API client, state, and UI components each stay in their
own lane.

```
api/rails/app/services/candidates/   StatusPolicy, UpdateStatus, MarkReviewed, BulkUpdateStatus, ListQuery, Serializer
client/src/
  api/           HTTP client
  domain/        Pure helpers + tests
  state/         Zustand store
  hooks/         TanStack Query
  components/    atoms → molecules → organisms
  pages/         CandidatesPage
```

## A couple of decisions worth explaining

**Rails instead of Django.** The brief allowed either. In an early conversation
about the role, Omari Kayumba mentioned the position needs
flexibility across environments so instead of staying in Python, which I
know well, I picked this up in Rails, a stack I had to get comfortable with
under a deadline. It felt like a more honest test of adaptability than
defaulting to what's already familiar.

**No Redux.** The brief mentions it as an option. State here is genuinely
light one screen, filters, a selection set, a paginated list with no event
sourcing, no cross-feature state bus, nothing that would actually exercise
what Redux is built for. TanStack Query handles the server cache and
invalidation after updates; Zustand holds the small bits of UI state. Adding
Redux on top would mostly be boilerplate without a real problem for it to
solve.

## Working notes

`PLAN.md` is where I keep the running log of decisions, trade-offs, and
anything that isn't spelled out in the original brief so nothing is decided
silently. `CHANGELOG.md` tracks what shipped, phase by phase.