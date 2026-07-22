import { useTranslation } from 'react-i18next'
import type { CandidateStatus } from '../../domain/candidate'
import { useCandidatesUiStore } from '../../state/candidatesUiStore'
import { Select } from '../atoms/Select'
import { Button } from '../atoms/Button'
import { SearchField } from '../molecules/SearchField'
import { SortControls } from '../molecules/SortControls'

export function CandidatesToolbar() {
  const { t } = useTranslation()
  const status = useCandidatesUiStore((s) => s.status)
  const setStatus = useCandidatesUiStore((s) => s.setStatus)
  const resetFilters = useCandidatesUiStore((s) => s.resetFilters)

  return (
    <section className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <SearchField />
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
          {t('candidates.filterStatus')}
          <Select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as CandidateStatus | '')
            }
          >
            <option value="">{t('candidates.allStatuses')}</option>
            <option value="pending">{t('candidates.statuses.pending')}</option>
            <option value="accepted">{t('candidates.statuses.accepted')}</option>
            <option value="rejected">{t('candidates.statuses.rejected')}</option>
          </Select>
        </label>
        <SortControls />
        <Button variant="ghost" onClick={resetFilters}>
          {t('candidates.reset')}
        </Button>
      </div>
    </section>
  )
}
