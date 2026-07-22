import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/cn'
import {
  useCandidatesUiStore,
  type SortDirection,
} from '@/state/candidatesUiStore'

function DirectionArrow({ direction }: { direction: SortDirection }) {
  return (
    <span aria-hidden="true" className="font-mono text-sm leading-none">
      {direction === 'asc' ? '↑' : '↓'}
    </span>
  )
}

const chipBase =
  'inline-flex h-[38px] cursor-pointer items-center justify-between gap-2 rounded-2xl border border-dashed px-3 text-sm font-medium transition outline-none focus-visible:ring-2 focus-visible:ring-teal-700/30'
const chipActive =
  'border-solid border-teal-700/50 bg-teal-50 text-teal-950 ring-2 ring-teal-700/50'

export function SortControls() {
  const { t } = useTranslation()
  const direction = useCandidatesUiStore((s) => s.direction)
  const setDirection = useCandidatesUiStore((s) => s.setDirection)
  const setSort = useCandidatesUiStore((s) => s.setSort)

  function toggleDirection() {
    setSort('date_applied')
    setDirection(direction === 'asc' ? 'desc' : 'asc')
  }

  return (
    <button
      type="button"
      className={cn(chipBase, chipActive)}
      aria-label={`${t('candidates.sortBy')}: ${t('candidates.sortDateApplied')}`}
      onClick={toggleDirection}
    >
      <span>{t('candidates.sortDateApplied')}</span>
      <DirectionArrow direction={direction} />
    </button>
  )
}
