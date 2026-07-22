# Changelog

All notable changes to this assessment delivery are documented here.

## [Unreleased]

### Added

- UI/UX enhancements: multi-status filter, `PATCH /candidates/bulk`, card selection + detail modal + floating bulk bar, sticky toolbar, filter/sort/locale persistence with browser language detect (documented in `PLAN.md`)
- Toolbar polish: reviewed filter (`reviewed` query), click-to-select cards, Review CTA, chip sort/filters, toolbar pagination
- Toolbar density: remove reviewed filter + status-sort chip; date-only sort; Page X of Y · N icon pagination; richer seeds
- Examiner README rewrite; Bugbot follow-ups (page-scoped selection, bulk partial errors, mark-reviewed, card a11y)
- Phase 1: `INSTRUCTIONS.md` (renamed original brief), living `PLAN.md`, architecture + assessment Cursor rules, README skeleton, project `.gitignore`
- Git workflow: `develop` integration branch + per-phase feature branches; human-owned PRs documented in `PLAN.md`
- Phase 2: legacy starters under `old/`; Rails 8.1 API at `api/rails` with Candidate + seeds; Vite/React/TS/Tailwind client via pnpm
- Phase 3: Candidates REST API (status rules, pagination/filter/search), EN/DE/FR i18n, GitHub Actions CI + README badge; CD omitted by design
- Phase 4: remove `old/`; candidates UI with TanStack Query + Zustand; recruiter README
