import { useTranslation } from 'react-i18next'
import {
  useCandidatesUiStore,
  type SortDirection,
  type SortField,
} from '../../state/candidatesUiStore'
import { Select } from '../atoms/Select'

export function SortControls() {
  const { t } = useTranslation()
  const sort = useCandidatesUiStore((s) => s.sort)
  const direction = useCandidatesUiStore((s) => s.direction)
  const setSort = useCandidatesUiStore((s) => s.setSort)
  const setDirection = useCandidatesUiStore((s) => s.setDirection)

  return (
    <div className="flex flex-wrap gap-3">
      <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
        {t('candidates.sortBy')}
        <Select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortField)}
        >
          <option value="date_applied">{t('candidates.fields.dateApplied')}</option>
          <option value="status">{t('candidates.fields.status')}</option>
        </Select>
      </label>
      <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
        {t('candidates.direction')}
        <Select
          value={direction}
          onChange={(e) => setDirection(e.target.value as SortDirection)}
        >
          <option value="desc">{t('candidates.desc')}</option>
          <option value="asc">{t('candidates.asc')}</option>
        </Select>
      </label>
    </div>
  )
}
