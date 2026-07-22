import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CandidateStatus } from '../domain/candidate'

export type SortField = 'status' | 'date_applied'
export type SortDirection = 'asc' | 'desc'
export type ReviewedFilter = 'all' | 'needs_review' | 'reviewed'

type CandidatesUiState = {
  page: number
  perPage: number
  statuses: CandidateStatus[]
  reviewedFilter: ReviewedFilter
  q: string
  sort: SortField
  direction: SortDirection
  selectedIds: number[]
  setPage: (page: number) => void
  setStatuses: (statuses: CandidateStatus[]) => void
  setReviewedFilter: (reviewedFilter: ReviewedFilter) => void
  setQ: (q: string) => void
  setSort: (sort: SortField) => void
  setDirection: (direction: SortDirection) => void
  toggleSelected: (id: number) => void
  setSelectedIds: (ids: number[]) => void
  clearSelection: () => void
  resetFilters: () => void
}

const initialFilters = {
  page: 1,
  perPage: 10,
  statuses: [] as CandidateStatus[],
  reviewedFilter: 'all' as ReviewedFilter,
  q: '',
  sort: 'date_applied' as SortField,
  direction: 'desc' as SortDirection,
  selectedIds: [] as number[],
}

export const useCandidatesUiStore = create<CandidatesUiState>()(
  persist(
    (set) => ({
      ...initialFilters,
      setPage: (page) => set({ page }),
      setStatuses: (statuses) => set({ statuses, page: 1 }),
      setReviewedFilter: (reviewedFilter) => set({ reviewedFilter, page: 1 }),
      setQ: (q) => set({ q, page: 1 }),
      setSort: (sort) => set({ sort, page: 1 }),
      setDirection: (direction) => set({ direction, page: 1 }),
      toggleSelected: (id) =>
        set((state) => ({
          selectedIds: state.selectedIds.includes(id)
            ? state.selectedIds.filter((item) => item !== id)
            : [...state.selectedIds, id],
        })),
      setSelectedIds: (ids) => set({ selectedIds: ids }),
      clearSelection: () => set({ selectedIds: [] }),
      resetFilters: () =>
        set({
          page: initialFilters.page,
          perPage: initialFilters.perPage,
          statuses: initialFilters.statuses,
          reviewedFilter: initialFilters.reviewedFilter,
          q: initialFilters.q,
          sort: initialFilters.sort,
          direction: initialFilters.direction,
        }),
    }),
    {
      name: 'candidates.ui',
      partialize: (state) => ({
        statuses: state.statuses,
        reviewedFilter: state.reviewedFilter,
        sort: state.sort,
        direction: state.direction,
      }),
    },
  ),
)
