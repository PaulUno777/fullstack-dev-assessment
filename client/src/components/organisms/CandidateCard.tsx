import { useTranslation } from 'react-i18next'
import type { Candidate } from '../../domain/candidate'
import { toListFields } from '../../domain/candidate'
import { StatusBadge } from '../atoms/Badge'

type Props = {
  candidate: Candidate
  selected?: boolean
  onToggleSelect: () => void
  onOpen: () => void
}

function formatDate(value: string, locale: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

function truncate(text: string, max = 140) {
  const trimmed = text.trim()
  if (trimmed.length <= max) return trimmed
  return `${trimmed.slice(0, max - 1)}…`
}

export function CandidateCard({
  candidate,
  selected = false,
  onToggleSelect,
  onOpen,
}: Props) {
  const { t, i18n } = useTranslation()
  const fields = toListFields(candidate)

  return (
    <article
      className={`rounded-xl border bg-white p-5 shadow-sm transition ${
        selected
          ? 'border-teal-700/40 ring-2 ring-teal-700/70 shadow-[0_0_0_4px_rgba(15,118,110,0.15)]'
          : 'border-slate-200'
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-800 focus:ring-teal-700"
          checked={selected}
          onChange={onToggleSelect}
          onClick={(event) => event.stopPropagation()}
          aria-label={t('candidates.selectCandidate', { name: fields.name })}
        />
        <button
          type="button"
          className="min-w-0 flex-1 text-left"
          onClick={onOpen}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-semibold text-slate-900">
                {fields.name}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {t('candidates.yearsExp', { count: fields.years_exp })}
              </p>
            </div>
            <StatusBadge
              status={fields.status}
              label={t(`candidates.statuses.${fields.status}`)}
            />
          </div>

          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {t('candidates.fields.dateApplied')}
              </dt>
              <dd className="mt-1 text-slate-800">
                {formatDate(fields.date_applied, i18n.language)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {t('candidates.fields.reviewed')}
              </dt>
              <dd className="mt-1 text-slate-800">
                {fields.reviewed ? t('candidates.yes') : t('candidates.no')}
              </dd>
            </div>
          </dl>

          {fields.description ? (
            <p className="mt-4 text-sm leading-relaxed text-slate-700">
              {truncate(fields.description)}
            </p>
          ) : (
            <p className="mt-4 text-sm italic text-slate-400">
              {t('candidates.noDescription')}
            </p>
          )}
        </button>
      </div>
    </article>
  )
}
