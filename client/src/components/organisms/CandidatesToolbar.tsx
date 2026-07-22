import { useTranslation } from 'react-i18next'
import { useCandidatesUiStore } from '../../state/candidatesUiStore'
import { Button } from '../atoms/Button'
import { SearchField } from '../molecules/SearchField'
import { SortControls } from '../molecules/SortControls'
import { MultiSelectDropdown } from '../molecules/MultiSelectDropdown'

export function CandidatesToolbar() {
  const { t } = useTranslation()
  const statuses = useCandidatesUiStore((s) => s.statuses)
  const setStatuses = useCandidatesUiStore((s) => s.setStatuses)
  const resetFilters = useCandidatesUiStore((s) => s.resetFilters)

  return (
    <section className="sticky top-0 z-20 -mx-4 border-b border-slate-200/80 bg-[#f3efe6]/90 px-4 py-3 shadow-sm backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="flex flex-wrap items-end gap-2 sm:gap-3">
        <SearchField />
        <MultiSelectDropdown value={statuses} onChange={setStatuses} />
        <SortControls />
        <Button variant="ghost" className="shrink-0" onClick={resetFilters}>
          {t('candidates.reset')}
        </Button>
      </div>
    </section>
  )
}
