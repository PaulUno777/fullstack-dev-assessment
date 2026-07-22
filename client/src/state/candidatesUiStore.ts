import { create } from 'zustand'
import type { CandidateStatus } from '../domain/candidate'

export type SortField = 'status' | 'date_applied'
export type SortDirection = 'asc' | 'desc'

type CandidatesUiState = {
  page: number
  perPage: number
  statuses: CandidateStatus[]
  q: string
  sort: SortField
  direction: SortDirection
  setPage: (page: number) => void
  setStatuses: (statuses: CandidateStatus[]) => void
  setQ: (q: string) => void
  setSort: (sort: SortField) => void
  setDirection: (direction: SortDirection) => void
  resetFilters: () => void
}

const initialFilters = {
  page: 1,
  perPage: 10,
  statuses: [] as CandidateStatus[],
  q: '',
  sort: 'date_applied' as SortField,
  direction: 'desc' as SortDirection,
}

export const useCandidatesUiStore = create<CandidatesUiState>((set) => ({
  ...initialFilters,
  setPage: (page) => set({ page }),
  setStatuses: (statuses) => set({ statuses, page: 1 }),
  setQ: (q) => set({ q, page: 1 }),
  setSort: (sort) => set({ sort, page: 1 }),
  setDirection: (direction) => set({ direction, page: 1 }),
  resetFilters: () => set({ ...initialFilters }),
}))
