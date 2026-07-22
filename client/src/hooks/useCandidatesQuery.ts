import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  listCandidates,
  updateCandidateStatus,
  type ListCandidatesParams,
} from '../api/candidates'
import type { CandidateStatus } from '../domain/candidate'
import { useCandidatesUiStore } from '../state/candidatesUiStore'

export function useCandidatesListQuery() {
  const { i18n } = useTranslation()
  const page = useCandidatesUiStore((s) => s.page)
  const perPage = useCandidatesUiStore((s) => s.perPage)
  const status = useCandidatesUiStore((s) => s.status)
  const q = useCandidatesUiStore((s) => s.q)
  const sort = useCandidatesUiStore((s) => s.sort)
  const direction = useCandidatesUiStore((s) => s.direction)

  const params: ListCandidatesParams = {
    page,
    per_page: perPage,
    status,
    q: q.trim() || undefined,
    sort,
    direction,
  }

  return useQuery({
    queryKey: ['candidates', params, i18n.language],
    queryFn: () => listCandidates(params, i18n.language),
  })
}

export function useUpdateCandidateStatusMutation() {
  const { i18n } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number
      status: Exclude<CandidateStatus, 'pending'>
    }) => updateCandidateStatus(id, status, i18n.language),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['candidates'] })
    },
  })
}
