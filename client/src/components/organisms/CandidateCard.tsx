import { useTranslation } from 'react-i18next'
import type { Candidate } from '../../domain/candidate'
import { toListFields } from '../../domain/candidate'
import { StatusBadge } from '../atoms/Badge'
import { StatusActions } from '../molecules/StatusActions'

type Props = {
  candidate: Candidate
  busy?: boolean
  errorMessage?: string
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

export function CandidateCard({
  candidate,
  busy,
  errorMessage,
  onAccept,
  onReject,
}: Props) {
  const { t, i18n } = useTranslation()
  const fields = toListFields(candidate)

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
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
    </article>
  )
}
