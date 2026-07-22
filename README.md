# Candidates Assessment — Nextise / Hire an Esquire

API Rails + client React modernisés pour lister, trier et mettre à jour le statut de candidats.

Ce dépôt démontre un workflow **AI-driven** : plan écrit avant le code, règles Cursor d’architecture, scaffolds propres, tests systématiques, CI, historique Git atomique.

> Brief d’origine (exigences produit, **ne pas modifier**) : [`INSTRUCTIONS.md`](./INSTRUCTIONS.md)  
> Plan vivant (audit, décisions, traçabilité) : [`PLAN.md`](./PLAN.md)

---

## Status

| Phase | Description | State |
|-------|-------------|--------|
| 1 | Docs, audit, Cursor rules | **Done** |
| 2 | Archive legacy + scaffold Rails / Vite | Pending |
| 3 | API domaine + tests | Pending |
| 4 | Client UI + tests | Pending |
| 5 | CI + README final | Pending |

---

## Stack cible

| Layer | Technology | Version target |
|-------|------------|----------------|
| Backend | Ruby + Rails API | Ruby 3.3+ / Rails 8.1.x |
| DB (dev/test) | SQLite | via Rails |
| Frontend | Vite + React + TypeScript + Tailwind | Vite 8.x / React 19.2.x |
| Tests | Minitest + Vitest | defaults of each stack |
| CI | GitHub Actions | lint + test (Phase 5) |

Legacy starters (Rails 5.2 / CRA / Django) will live under `old/` after Phase 2 for provenance only.

---

## Architecture (summary)

- **Backend:** controllers orchestrate HTTP; application services own status transitions (`reviewed`, lock when final); models validate and persist.
- **Frontend:** `domain` (pure) → `api` → `state` → presentation `components` → `pages`.
- **Security:** CORS restricted to the Vite origin; no wildcard origins.
- Full rules: [`.cursor/rules/architecture.mdc`](./.cursor/rules/architecture.mdc), [`.cursor/rules/assessment-workflow.mdc`](./.cursor/rules/assessment-workflow.mdc).

---

## Quick start

> Commands will be finalized after Phase 2 scaffolds land.

```bash
# Backend (planned)
cd api && bundle install && bin/rails db:setup && bin/rails server

# Frontend (planned)
cd client && npm install && npm run dev
```

---

## Requirements coverage

See the traceability table in [`PLAN.md`](./PLAN.md) (IDs A1–A4, C1–C4 from `INSTRUCTIONS.md`).

---

## License / context

Technical assessment for the AI-Driven Full-Stack Developer role (Nextise / Hire an Esquire). Original challenge by [Hire an Esquire](https://hireanesquire.com/).
