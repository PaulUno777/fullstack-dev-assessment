import { useTranslation } from 'react-i18next'
import type { Candidate } from '@/domain/candidate'
import { toListFields } from '@/domain/candidate'
import { cn } from '@/lib/cn'
import { StatusBadge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { CandidateMetaFields } from '@/components/molecules/CandidateMetaFields'

type Props = {
  candidate: Candidate
  selected?: boolean
  onToggleSelect: () => void
  onOpen: () => void
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
  const { t } = useTranslation()
  const fields = toListFields(candidate)

  return (
    <article
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={t('candidates.selectCandidate', { name: fields.name })}
      className={cn(
        'cursor-pointer rounded-2xl border bg-white p-5 text-left shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-teal-700/40',
        selected
          ? 'border-teal-700/40 ring-2 ring-teal-700/70 shadow-[0_0_0_4px_rgba(15,118,110,0.15)]'
          : 'border-slate-200 hover:border-slate-300',
      )}
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
          className={cn(
            'mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[11px]',
            selected
              ? 'border-teal-800 bg-teal-800 text-white'
              : 'border-slate-300 bg-white text-transparent',
          )}
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
            <StatusBadge
              status={fields.status}
              label={t(`candidates.statuses.${fields.status}`)}
            />
          </div>

          <CandidateMetaFields fields={fields} />

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
