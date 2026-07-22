import { useTranslation } from 'react-i18next'
import {
  useCandidatesUiStore,
  type SortDirection,
  type SortField,
} from '../../state/candidatesUiStore'
import { Dropdown } from './Dropdown'

function DirectionArrow({ direction }: { direction: SortDirection }) {
  return (
    <span aria-hidden="true" className="font-mono text-base leading-none">
      {direction === 'asc' ? '↑' : '↓'}
    </span>
  )
}

export function SortControls() {
  const { t } = useTranslation()
  const sort = useCandidatesUiStore((s) => s.sort)
  const direction = useCandidatesUiStore((s) => s.direction)
  const setSort = useCandidatesUiStore((s) => s.setSort)
  const setDirection = useCandidatesUiStore((s) => s.setDirection)

  function chooseField(field: SortField, close: () => void) {
    if (field === 'status') {
      setSort('status')
      close()
      return
    }
    if (sort === 'date_applied') {
      setDirection(direction === 'asc' ? 'desc' : 'asc')
    } else {
      setSort('date_applied')
    }
    close()
  }

  const triggerLabel =
    sort === 'status'
      ? t('candidates.fields.status')
      : t('candidates.fields.dateApplied')

  return (
    <Dropdown
      label={t('candidates.sortBy')}
      className="min-w-[12rem]"
      trigger={
        <span className="flex items-center gap-2">
          <span>{triggerLabel}</span>
          {sort === 'date_applied' ? (
            <DirectionArrow direction={direction} />
          ) : null}
        </span>
      }
    >
      {({ close }) => (
        <>
          <button
            type="button"
            role="option"
            aria-selected={sort === 'date_applied'}
            className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm text-slate-800 hover:bg-slate-50"
            onClick={() => chooseField('date_applied', close)}
          >
            <span>{t('candidates.fields.dateApplied')}</span>
            <DirectionArrow
              direction={
                sort === 'date_applied' ? direction : 'desc'
              }
            />
          </button>
          <button
            type="button"
            role="option"
            aria-selected={sort === 'status'}
            className="flex w-full items-center px-3 py-2 text-left text-sm text-slate-800 hover:bg-slate-50"
            onClick={() => chooseField('status', close)}
          >
            {t('candidates.fields.status')}
          </button>
        </>
      )}
    </Dropdown>
  )
}
