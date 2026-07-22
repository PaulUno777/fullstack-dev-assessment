# PLAN — Full-Stack Developer Assessment (Nextise / Hire an Esquire)

Living plan. Update at every significant step. Product requirements live in [`INSTRUCTIONS.md`](./INSTRUCTIONS.md) (immutable brief).

**Goal:** Demonstrate an AI-driven professional workflow (plan → rules → scaffold → tests → CI → docs), not only a working app.

---

## Phases (gate: commit + verify + human confirm)

| Phase | Scope | Branch | Commit focus | Done when |
|-------|--------|--------|--------------|-----------|
| **1** | Audit, PLAN, rename brief, Cursor rules, README skeleton | `docs/phase-1-foundation` | `docs:` / `chore:` | Files present; INSTRUCTIONS = original brief; PR → `develop` |
| **2** | Archive legacy → `old/`; scaffold Rails API + Vite React TS | `chore/phase-2-scaffold` | `chore:` | Both apps boot; seeds portable |
| **3** | Domain + API (list/show/update), pagination/search, i18n, CI | `feat/phase-3-api-candidates` | `feat(api):` / `feat(client):` / `ci:` | API suite green; A1–A4; CI badges |
| **4** | Client UI (list/sort/status lock) + tests | `feat/phase-4-client-ui` | `feat(client):` / `test(client):` | Client suite green; C1–C3 traced |
| **5** | README polish / Loom (CI already landed in Phase 3) | `docs/phase-5-polish` | `docs:` | Submission-ready |

After each phase: **commit → verify → human PR into `develop` → confirm** before the next phase.

---

## Phase 1 — Audit & decisions (current)

### Stack audit (2026-07-22)

| Component | Legacy (repo) | Latest stable (audit) | Decision |
|-----------|---------------|----------------------|----------|
| Ruby | 2.4.0 | ≥ 3.2 (Rails 8.1 floor); prefer 3.3/3.4 | **Regenerate** with Ruby 3.3+ via mise |
| Rails | 5.2 | **8.1.3** | **Regenerate** API-only app |
| Node | (implicit CRA) | Node 20 LTS (local: v20.11.1) | Keep Node 20 for Vite |
| React | 16.4 | **19.2.x** | **Regenerate** |
| Bundler FE | CRA 1.1.4 | **Vite 8.x** | **Regenerate** |
| CSS | App.css default | **Tailwind CSS** | New with Vite |
| Django starter | present | — | Archive only; **not used** |

### Why regenerate (not incremental upgrade)

- Rails 5.2 → 8.1 crosses multiple majors; boilerplate has almost no app code worth migrating.
- CRA is deprecated; React 16 class components are not the target story for an AI-driven fullstack role.
- Copying domain (model fields + seeds + status rules) into a clean scaffold is lower risk and clearer in Git history.

### Architecture decisions

- **Backend:** Clean Architecture *proportionally* — controllers = HTTP; application services/use cases = transitions; ActiveRecord model = persistence + simple validations. Domain status rules in a pure/service object, heavily tested.
- **Frontend:** Layers `domain/` (pure) → `api/` → `state/` → `components/` (presentation) → `pages/`.
- **CORS:** Restricted to Vite origin (`http://localhost:5173`); never `*`.
- **Tests:** Minitest (Rails default) + Vitest (Vite). Rationale: zero extra framework dep for API; document in README.
- **State (client):** **TanStack Query** (server cache) + **Zustand** (UI filters). Redux declined as overkill for one screen / no event sourcing — see README.
- **CD:** Intentionally omitted (local demo + Loom; no production host). CI only.
- **i18n:** Voluntary scope extension — **EN / DE / FR** on API errors (`Accept-Language`) and client foundation (`i18next`). Justified for interview demo of i18n without bloating the brief.
- **Pagination / filter / search:** Voluntary scope extension on `GET /candidates` (`page`, `per_page`, `status`, `q`, `sort`, `direction`) for large-list readiness.
- **Deps added:** `rack-cors` (required CORS); `i18next` + `react-i18next` (client i18n foundation).

### Assumptions / ambiguities (explicit)

| Topic | Decision |
|-------|----------|
| `created` / `updated` in brief | Map to Rails `created_at` / `updated_at`; hide from UI list fields |
| Update endpoint | PATCH status (and allow other fields only if needed later — start with status) |
| Status lock | Enforced in **application layer + UI** (defense in depth) |
| Sort location | Server supports `sort`/`direction`; Phase 4 may also sort client-side |
| Pagination | `page` / `per_page` with `meta` (default 20, max 100) |
| Search | `q` matches candidate `name` (case-insensitive) |
| Legacy code | Archived then **removed** in Phase 4 (history retains `chore: archive…`); active code only under `api/rails` + `client` |

---

## Requirement traceability (`INSTRUCTIONS.md`)

| ID | Requirement | Implementation (planned) | Test (planned) | Phase |
|----|-------------|--------------------------|----------------|-------|
| A1 | JSON `Content-Type` | Rails API defaults | Request assertion | 3 ✅ |
| A2 | Read + Update single Candidate | `GET/PATCH /candidates/:id` | Show/update specs | 3 ✅ |
| A3 | List all candidates | `GET /candidates` (+ pagination meta) | Index spec | 3 ✅ |
| A4 | pending→accepted/rejected ⇒ `reviewed=true` | `Candidates::UpdateStatus` | Unit + request | 3 ✅ |
| C1 | List fields except id/created/updated | CandidateCard via `toListFields` | Vitest `toListFields` | 4 ✅ |
| C2 | Sort by status + date_applied | Toolbar → API `sort`/`direction` | Manual + API specs | 4 ✅ |
| C3 | Status button → API; lock when final | StatusActions + PATCH + API 422 | Vitest `canChangeStatus` | 4 ✅ |
| C4 | Redux optional | TanStack Query + Zustand (documented; Loom rationale) | N/A | 4 ✅ |

---

## Git / PR strategy

### Branch model

| Branch | Role |
|--------|------|
| `master` | Sync with upstream / releases. No direct commits (PR merges only). |
| `develop` | Integration branch (default base for work). |
| `docs/phase-1-foundation` | Phase 1 feature branch → PR into `develop` |
| `chore/phase-2-scaffold` | Phase 2 |
| `feat/phase-3-api-candidates` | Phase 3 |
| `feat/phase-4-client-ui` | Phase 4 |
| `ci/phase-5-github-actions` | Phase 5 |

Flow: `feature → develop` (human opens PR) → later `develop → master` if needed.

### Commit & gate rules

- Conventional Commits: `feat:`, `fix:`, `chore:`, `test:`, `docs:`, `ci:`
- One concern per commit; never leave suite red on purpose
- Agent: create branch, commit, verify, **stop** — human creates/merges PRs (`gh pr create`)
- After each phase PR is merged: pull `develop`, then start next feature branch from `develop`
- Final: PR summary + Loom walkthrough (app + architecture + how AI was used)

---

## Phase checklists

### Phase 1 ✅ (`docs/phase-1-foundation` → PR into `develop`)

- [x] Rename brief → `INSTRUCTIONS.md`
- [x] Create `PLAN.md` with audit + decisions
- [x] Cursor rules: architecture + assessment workflow (+ keep Karpathy)
- [x] Professional `README.md` skeleton
- [x] Sensible `.gitignore`
- [x] Branch model: `master` / `develop` / feature branch per phase

### Phase 2 ✅ (`chore/phase-2-scaffold` → PR into `develop`)

- [x] Move `api/`, `client/` → `old/`
- [x] Scaffold Rails 8.1 API-only under `api/rails` (app name `CandidateApi`)
- [x] Scaffold Vite + React + TS + Tailwind under `client` with **pnpm**
- [x] Port Candidate schema + seeds from `old/api/rails`
- [x] Verify: `bin/rails test` green; `pnpm build` green
- [x] No project `mise.toml` — use machine-installed Ruby/Node/pnpm

### Phase 3 ✅ (`feat/phase-3-api-candidates` → PR into `develop`)

- [x] Use case + model validations (`StatusPolicy` / `UpdateStatus`)
- [x] REST endpoints + CORS restricted to Vite origin
- [x] Tests for A1–A4 green
- [x] Pagination, status filter, name search, sort
- [x] EN/DE/FR API errors + client i18next foundation
- [x] GitHub Actions CI + README badge
- [x] CD omitted (documented)

### Phase 4 ✅ (`feat/phase-4-client-ui` → PR into `develop`)

- [x] Remove `old/` (history retains archive)
- [x] Layered client UI (atoms → molecules → organisms → page)
- [x] TanStack Query + Zustand (no Redux; Loom rationale in README)
- [x] Tests for C1–C3 helpers green (Vitest)
- [x] Recruiter-oriented README

### Phase 5

- [ ] Loom walkthrough (CI already in Phase 3)

---

## UI/UX enhancements (beyond `INSTRUCTIONS.md`)

Voluntary polish on `feat/ui-ux-enhancements`. Core C1–C3 stay intact (card list, not table; sort UI; status via API; lock when final). These are deliberate extras for the assessment narrative.

| Enhancement | Why | Notes |
|-------------|-----|-------|
| Multi-status filter | Recruiters often need “pending + rejected” without losing server pagination | API: `status=pending,rejected` (CSV) and/or `status[]=…`; client multi-select dropdown |
| Dedicated bulk endpoint | One round-trip, consistent errors, same status rules | `PATCH /candidates/bulk` with `{ ids, status }` → `{ data, meta, errors }`; service `Candidates::BulkUpdateStatus` reuses `UpdateStatus` |
| Card selection + floating bulk bar | Speed up review of many pending cards | Confirm dialog before Accept/Reject; only pending IDs update; locked selection explained |
| Candidate detail modal | Keep cards compact; full description + Accept/Reject in modal | List fields still match C1; no Accept/Reject on the card itself |
| Persist filters / sort / language | Restore review context after reload | `localStorage` for `statuses` / `sort` / `direction` / locale. Not persisted: selection, `q`, `page` |
| Browser language detection | First visit matches `navigator.language` (`en`/`de`/`fr`, else `en`) | Explicit LanguageSwitcher choice overrides and persists |
| Sticky toolbar + date sort arrow | Keep controls reachable | Direction toggle on date-applied chip; status sort UI removed (status covered by multi-status filter; API still accepts `sort=status`) |
| 2-column card grid | Denser review on large screens | `grid-cols-1 lg:grid-cols-2`; selected cards use teal ring + soft glow |
| Click-to-select cards | Faster multi-select | Whole card toggles selection; Review CTA opens detail modal (`stopPropagation`) |
| Smart reviewed CTA + badge | Drive unreviewed queue into modal | “Review application” when `!reviewed`; teal Reviewed badge when done; Accept/Reject still sets `reviewed` via A2 |
| Toolbar pagination + mobile filters | Sticky controls without Reset | `Page X of Y · N` + icon Prev/Next; sm Filters toggle; Reset removed |

Brief compliance: Accept/Reject (single + bulk) still go through `Candidates::UpdateStatus` / `StatusPolicy` (A2/A4); status lock unchanged (C3). Cards remain the list UI — no table. Date sort remains in UI; status sort available via API if needed (UX simplification vs C2 dual-sort UI — status filter substitutes for browsing by status).

---

## Changelog of plan updates

| Date | Change |
|------|--------|
| 2026-07-22 | Initial audit, regenerate decision, phased gates, requirement IDs |
| 2026-07-22 | Git model: `develop` + per-phase feature branches; human-owned PRs |
| 2026-07-22 | Phase 2: regenerate `api/rails` + `client` (pnpm); toolchain via machine PATH |
| 2026-07-22 | Phase 3: API A1–A4, pagination/search, EN/DE/FR i18n, CI badges; CD omitted |
| 2026-07-22 | Phase 4: remove `old/`; TanStack Query + Zustand client UI |
| 2026-07-22 | UI/UX enhancements: multi-status, bulk API, selection/modal, persist, auto-i18n |
| 2026-07-22 | Toolbar polish: reviewed filter, click-select, Review CTA, chip sort/filters |
| 2026-07-22 | Toolbar density: drop reviewed filter + status-sort chip; date-only sort; denser pagination |
