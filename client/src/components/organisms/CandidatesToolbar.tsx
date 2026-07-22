import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCandidatesUiStore } from '../../state/candidatesUiStore'
import { Button } from '../atoms/Button'
import { SearchField } from '../molecules/SearchField'
import { SortControls } from '../molecules/SortControls'
import { MultiSelectDropdown } from '../molecules/MultiSelectDropdown'
import { ReviewedFilterChips } from '../molecules/ReviewedFilterChips'

type Props = {
  page?: number
  totalPages?: number
  total?: number
}

export function CandidatesToolbar({
  page = 1,
  totalPages = 0,
  total = 0,
}: Props) {
  const { t } = useTranslation()
  const statuses = useCandidatesUiStore((s) => s.statuses)
  const setStatuses = useCandidatesUiStore((s) => s.setStatuses)
  const setPage = useCandidatesUiStore((s) => s.setPage)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const canPaginate = totalPages > 1

  return (
    <section className="sticky top-0 z-20 -mx-4 border-b border-slate-200/80 bg-[#f3efe6]/95 px-4 py-3 shadow-sm backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-end gap-2 md:gap-3">
          <div className="min-w-[12rem] flex-1">
            <SearchField />
          </div>

          <Button
            variant="secondary"
            className="md:hidden"
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen((open) => !open)}
          >
            {filtersOpen
              ? t('candidates.hideFilters')
              : t('candidates.showFilters')}
          </Button>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <p className="text-xs text-slate-600 sm:text-sm">
              {totalPages > 0
                ? `${t('candidates.pageOf', { page, totalPages })} · ${t('candidates.totalCount', { count: total })}`
                : t('candidates.totalCount', { count: total })}
            </p>
            <Button
              variant="secondary"
              disabled={!canPaginate || page <= 1}
              onClick={() => setPage(page - 1)}
            >
              {t('candidates.prev')}
            </Button>
            <Button
              variant="secondary"
              disabled={!canPaginate || page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              {t('candidates.next')}
            </Button>
          </div>
        </div>

        <div
          className={`${
            filtersOpen ? 'flex' : 'hidden'
          } flex-col gap-3 md:flex md:flex-row md:flex-wrap md:items-end`}
        >
          <MultiSelectDropdown value={statuses} onChange={setStatuses} />
          <ReviewedFilterChips />
          <SortControls />
        </div>
      </div>
    </section>
  )
}
