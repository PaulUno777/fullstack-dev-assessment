import { useEffect, useId } from 'react'
import { useTranslation } from 'react-i18next'
import type { Candidate } from '../../domain/candidate'
import { toListFields } from '../../domain/candidate'
import { ReviewedBadge, StatusBadge } from '../atoms/Badge'
import { StatusActions } from '../molecules/StatusActions'
import { Button } from '../atoms/Button'

type Props = {
  candidate: Candidate | null
  busy?: boolean
  errorMessage?: string
  onClose: () => void
  onAccept: () => void
  onReject: () => void
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

export function CandidateDetailModal({
  candidate,
  busy,
  errorMessage,
  onClose,
  onAccept,
  onReject,
}: Props) {
  const { t, i18n } = useTranslation()
  const titleId = useId()

  useEffect(() => {
    if (!candidate) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !busy) onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [candidate, busy, onClose])

  if (!candidate) return null

  const fields = toListFields(candidate)

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-slate-950/40 p-4 sm:items-center"
      role="presentation"
      onClick={() => {
        if (!busy) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2
              id={titleId}
              className="font-display text-2xl font-semibold text-slate-900"
            >
              {fields.name}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {t('candidates.yearsExp', { count: fields.years_exp })}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge
              status={fields.status}
              label={t(`candidates.statuses.${fields.status}`)}
            />
            <ReviewedBadge
              reviewed={fields.reviewed}
              needsLabel={t('candidates.needsReview')}
              reviewedLabel={t('candidates.reviewedDone')}
            />
            <Button variant="ghost" disabled={busy} onClick={onClose}>
              {t('candidates.close')}
            </Button>
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
          <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
            {fields.description}
          </p>
        ) : (
          <p className="mt-4 text-sm italic text-slate-400">
            {t('candidates.noDescription')}
          </p>
        )}

        <div className="mt-5 border-t border-slate-100 pt-4">
          <StatusActions
            status={fields.status}
            disabled={busy}
            onAccept={onAccept}
            onReject={onReject}
          />
          {errorMessage ? (
            <p className="mt-2 text-sm text-rose-700" role="alert">
              {errorMessage}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
