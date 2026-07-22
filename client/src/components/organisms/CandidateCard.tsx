import { useTranslation } from 'react-i18next'
import type { Candidate } from '../../domain/candidate'
import { toListFields } from '../../domain/candidate'
import { ReviewedBadge, StatusBadge } from '../atoms/Badge'
import { Button } from '../atoms/Button'

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
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={t('candidates.selectCandidate', { name: fields.name })}
      className={`cursor-pointer rounded-2xl border bg-white p-5 text-left shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-teal-700/40 ${
        selected
          ? 'border-teal-700/40 ring-2 ring-teal-700/70 shadow-[0_0_0_4px_rgba(15,118,110,0.15)]'
          : 'border-slate-200 hover:border-slate-300'
      }`}
      onClick={onToggleSelect}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onToggleSelect()
        }
      }}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[11px] ${
            selected
              ? 'border-teal-800 bg-teal-800 text-white'
              : 'border-slate-300 bg-white text-transparent'
          }`}
          aria-hidden="true"
        >
          ✓
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-semibold text-slate-900">
                {fields.name}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {t('candidates.yearsExp', { count: fields.years_exp })}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <StatusBadge
                status={fields.status}
                label={t(`candidates.statuses.${fields.status}`)}
              />
            </div>
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
              <dd className="mt-1">
                <ReviewedBadge
                  reviewed={fields.reviewed}
                  needsLabel={t('candidates.needsReview')}
                  reviewedLabel={t('candidates.reviewedDone')}
                />
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

          <div className="mt-4 flex flex-wrap gap-2">
            {!fields.reviewed ? (
              <Button
                variant="primary"
                onClick={(event) => {
                  event.stopPropagation()
                  onOpen()
                }}
              >
                {t('candidates.reviewApplication')}
              </Button>
            ) : (
              <Button
                variant="secondary"
                onClick={(event) => {
                  event.stopPropagation()
                  onOpen()
                }}
              >
                {t('candidates.viewDetails')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
