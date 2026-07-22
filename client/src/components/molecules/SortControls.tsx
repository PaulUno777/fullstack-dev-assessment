import { useTranslation } from 'react-i18next'
import {
  useCandidatesUiStore,
  type SortDirection,
  type SortField,
} from '../../state/candidatesUiStore'

function DirectionArrow({ direction }: { direction: SortDirection }) {
  return (
    <span aria-hidden="true" className="font-mono text-sm leading-none">
      {direction === 'asc' ? '↑' : '↓'}
    </span>
  )
}

const chipBase =
  'inline-flex items-center justify-between gap-2 rounded-2xl border border-dashed px-3 py-2 text-sm font-medium transition outline-none focus-visible:ring-2 focus-visible:ring-teal-700/30'
const chipIdle = 'border-slate-300 bg-white/80 text-slate-700 hover:bg-white'
const chipActive =
  'border-solid border-teal-700/50 bg-teal-50 text-teal-950 ring-2 ring-teal-700/50'

export function SortControls() {
  const { t } = useTranslation()
  const sort = useCandidatesUiStore((s) => s.sort)
  const direction = useCandidatesUiStore((s) => s.direction)
  const setSort = useCandidatesUiStore((s) => s.setSort)
  const setDirection = useCandidatesUiStore((s) => s.setDirection)

  function activate(field: SortField) {
    if (sort === field) {
      setDirection(direction === 'asc' ? 'desc' : 'asc')
      return
    }
    setSort(field)
    setDirection('desc')
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
        {t('candidates.sortBy')}
      </span>
      <div className="flex flex-wrap gap-2" role="group" aria-label={t('candidates.sortBy')}>
        <button
          type="button"
          className={`${chipBase} ${sort === 'date_applied' ? chipActive : chipIdle}`}
          aria-pressed={sort === 'date_applied'}
          onClick={() => activate('date_applied')}
        >
          <span>{t('candidates.fields.dateApplied')}</span>
          {sort === 'date_applied' ? (
            <DirectionArrow direction={direction} />
          ) : (
            <span className="text-slate-300" aria-hidden="true">
              ↓
            </span>
          )}
        </button>
        <button
          type="button"
          className={`${chipBase} ${sort === 'status' ? chipActive : chipIdle}`}
          aria-pressed={sort === 'status'}
          onClick={() => activate('status')}
        >
          <span>{t('candidates.fields.status')}</span>
          {sort === 'status' ? (
            <DirectionArrow direction={direction} />
          ) : (
            <span className="text-slate-300" aria-hidden="true">
              ↓
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
