import { useTranslation } from 'react-i18next'
import {
  useCandidatesUiStore,
  type ReviewedFilter,
} from '../../state/candidatesUiStore'

const chipBase =
  'rounded-2xl border border-dashed px-3 py-2 text-sm font-medium transition outline-none focus-visible:ring-2 focus-visible:ring-teal-700/30'
const chipIdle = 'border-slate-300 bg-white/80 text-slate-700 hover:bg-white'
const chipActive =
  'border-solid border-teal-700/50 bg-teal-50 text-teal-950 ring-2 ring-teal-700/50'

const OPTIONS: ReviewedFilter[] = ['all', 'needs_review', 'reviewed']

export function ReviewedFilterChips() {
  const { t } = useTranslation()
  const reviewedFilter = useCandidatesUiStore((s) => s.reviewedFilter)
  const setReviewedFilter = useCandidatesUiStore((s) => s.setReviewedFilter)

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wide text-amber-900/80">
        {t('candidates.filterReviewed')}
      </span>
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label={t('candidates.filterReviewed')}
      >
        {OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            className={`${chipBase} ${
              reviewedFilter === option ? chipActive : chipIdle
            }`}
            aria-pressed={reviewedFilter === option}
            onClick={() => setReviewedFilter(option)}
          >
            {t(`candidates.reviewedFilters.${option}`)}
          </button>
        ))}
      </div>
    </div>
  )
}
