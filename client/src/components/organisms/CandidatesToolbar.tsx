import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCandidatesUiStore } from '../../state/candidatesUiStore'
import { Button } from '../atoms/Button'
import { SearchField } from '../molecules/SearchField'
import { SortControls } from '../molecules/SortControls'
import { MultiSelectDropdown } from '../molecules/MultiSelectDropdown'

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
  const displayPages = Math.max(totalPages, total > 0 ? 1 : 0)

  return (
    <section className="sticky top-0 z-20 -mx-4 border-b border-slate-200/70 bg-[#f3efe6] px-4 py-3 shadow-sm sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-end gap-2">
          <div className="min-w-[10rem] flex-1 basis-[12rem]">
            <SearchField />
          </div>

          <div
            className={`${
              filtersOpen ? 'flex' : 'hidden'
            } w-full flex-wrap items-end gap-2 md:flex md:w-auto`}
          >
            <MultiSelectDropdown value={statuses} onChange={setStatuses} />
            <SortControls />
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

          <div className="ml-auto flex shrink-0 items-center gap-1.5">
            <p className="whitespace-nowrap text-xs text-slate-600 sm:text-sm">
              {displayPages > 0
                ? t('candidates.pageMeta', {
                    page: Math.max(page, 1),
                    totalPages: displayPages,
                    total,
                  })
                : t('candidates.pageMeta', { page: 1, totalPages: 1, total: 0 })}
            </p>
            <Button
              variant="secondary"
              className="!px-2.5 font-mono text-base leading-none"
              disabled={!canPaginate || page <= 1}
              aria-label={t('candidates.prev')}
              onClick={() => setPage(page - 1)}
            >
              ‹
            </Button>
            <Button
              variant="secondary"
              className="!px-2.5 font-mono text-base leading-none"
              disabled={!canPaginate || page >= totalPages}
              aria-label={t('candidates.next')}
              onClick={() => setPage(page + 1)}
            >
              ›
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
