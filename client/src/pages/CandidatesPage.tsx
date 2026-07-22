import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ApiError } from '../api/candidates'
import {
  useBulkUpdateCandidateStatusMutation,
  useCandidatesListQuery,
  useMarkCandidateReviewedMutation,
  useUpdateCandidateStatusMutation,
} from '../hooks/useCandidatesQuery'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import { ConfirmDialog } from '../components/atoms/ConfirmDialog'
import { CandidatesToolbar } from '../components/organisms/CandidatesToolbar'
import { CandidateCard } from '../components/organisms/CandidateCard'
import { CandidateDetailModal } from '../components/organisms/CandidateDetailModal'
import { BulkActionBar } from '../components/organisms/BulkActionBar'
import {
  bulkConfirmCopy,
  partitionSelectedForBulk,
} from '../domain/bulkSelection'
import type { Candidate } from '../domain/candidate'
import { useCandidatesUiStore } from '../state/candidatesUiStore'

type PendingAction = {
  ids: number[]
  status: 'accepted' | 'rejected'
  lockedCount: number
}

export function CandidatesPage() {
  const { t } = useTranslation()
  const listQuery = useCandidatesListQuery()
  const mutation = useUpdateCandidateStatusMutation()
  const bulkMutation = useBulkUpdateCandidateStatusMutation()
  const markReviewedMutation = useMarkCandidateReviewedMutation()
  const page = useCandidatesUiStore((s) => s.page)
  const setPage = useCandidatesUiStore((s) => s.setPage)
  const selectedIds = useCandidatesUiStore((s) => s.selectedIds)
  const toggleSelected = useCandidatesUiStore((s) => s.toggleSelected)
  const clearSelection = useCandidatesUiStore((s) => s.clearSelection)
  const [rowErrors, setRowErrors] = useState<Record<number, string>>({})
  const [detailCandidate, setDetailCandidate] = useState<Candidate | null>(null)
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)
  const [confirmBusy, setConfirmBusy] = useState(false)

  const candidates = listQuery.data?.data ?? []
  const totalPages = listQuery.data?.meta.total_pages ?? 0

  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages, setPage])

  const partition = useMemo(
    () => partitionSelectedForBulk(candidates, selectedIds),
    [candidates, selectedIds],
  )

  function requestBulk(status: 'accepted' | 'rejected') {
    if (partition.pendingIds.length === 0) return
    setPendingAction({
      ids: partition.pendingIds,
      status,
      lockedCount: partition.lockedCount,
    })
  }

  async function openDetails(candidate: Candidate) {
    setDetailCandidate(candidate)
    if (candidate.reviewed) return
    try {
      const updated = await markReviewedMutation.mutateAsync(candidate.id)
      setDetailCandidate(updated)
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : t('candidates.unknownError')
      setRowErrors((prev) => ({ ...prev, [candidate.id]: message }))
    }
  }

  async function changeStatus(
    id: number,
    status: 'accepted' | 'rejected',
  ) {
    setRowErrors((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    try {
      await mutation.mutateAsync({ id, status })
      setDetailCandidate(null)
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : t('candidates.unknownError')
      setRowErrors((prev) => ({ ...prev, [id]: message }))
    }
  }

  async function applyPendingAction() {
    if (!pendingAction) return
    setConfirmBusy(true)
    try {
      const result = await bulkMutation.mutateAsync({
        ids: pendingAction.ids,
        status: pendingAction.status,
      })
      if (result.meta.failed > 0) {
        setRowErrors((prev) => {
          const next = { ...prev }
          for (const error of result.errors) {
            next[error.id] = error.message
          }
          return next
        })
      }
      clearSelection()
      setPendingAction(null)
      setDetailCandidate(null)
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : t('candidates.unknownError')
      setRowErrors((prev) => {
        const next = { ...prev }
        for (const id of pendingAction.ids) next[id] = message
        return next
      })
      setPendingAction(null)
    } finally {
      setConfirmBusy(false)
    }
  }

  const confirmCopy = pendingAction
    ? bulkConfirmCopy({
        action: pendingAction.status,
        pendingCount: pendingAction.ids.length,
        lockedCount: pendingAction.lockedCount,
        t,
      })
    : null

  return (
    <div className="relative min-h-screen bg-[#f3efe6] text-slate-900">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.12),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(180,83,9,0.1),_transparent_35%)]" />

      <div className="relative mx-auto max-w-5xl px-4 pt-10 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-900/70">
              {t('app.brand')}
            </p>
            <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              {t('app.title')}
            </h1>
            <p className="mt-3 max-w-2xl text-base text-slate-700">
              {t('app.subtitle')}
            </p>
          </div>
          <LanguageSwitcher />
        </header>
      </div>

      <div className="sticky top-0 z-30 border-b border-teal-900/10 bg-teal-900/[0.12] shadow-sm backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6 lg:px-8">
          <CandidatesToolbar
            page={listQuery.data?.meta.page ?? 1}
            totalPages={listQuery.data?.meta.total_pages ?? 0}
            total={listQuery.data?.meta.total ?? 0}
          />
        </div>
      </div>

      <div className="relative mx-auto max-w-5xl space-y-6 px-4 py-6 pb-28 sm:px-6 lg:px-8">
        {listQuery.isLoading ? (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white/60 px-4 py-10 text-center text-slate-600">
            {t('candidates.loading')}
          </p>
        ) : null}

        {listQuery.isError ? (
          <p
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-6 text-rose-800"
            role="alert"
          >
            {listQuery.error instanceof Error
              ? listQuery.error.message
              : t('candidates.loadError')}
          </p>
        ) : null}

        {listQuery.data && listQuery.data.data.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white/60 px-4 py-10 text-center text-slate-600">
            {t('candidates.empty')}
          </p>
        ) : null}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {listQuery.data?.data.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              selected={selectedIds.includes(candidate.id)}
              onToggleSelect={() => toggleSelected(candidate.id)}
              onOpen={() => void openDetails(candidate)}
              errorMessage={rowErrors[candidate.id]}
            />
          ))}
        </div>
      </div>

      <BulkActionBar
        selectedCount={selectedIds.length}
        actionableCount={partition.pendingIds.length}
        busy={bulkMutation.isPending || confirmBusy}
        onAccept={() => requestBulk('accepted')}
        onReject={() => requestBulk('rejected')}
        onClear={clearSelection}
      />

      <CandidateDetailModal
        candidate={detailCandidate}
        busy={mutation.isPending}
        errorMessage={
          detailCandidate ? rowErrors[detailCandidate.id] : undefined
        }
        onClose={() => setDetailCandidate(null)}
        onAccept={() => {
          if (detailCandidate) void changeStatus(detailCandidate.id, 'accepted')
        }}
        onReject={() => {
          if (detailCandidate) void changeStatus(detailCandidate.id, 'rejected')
        }}
      />

      <ConfirmDialog
        open={Boolean(pendingAction && confirmCopy)}
        title={confirmCopy?.title ?? ''}
        message={confirmCopy?.message ?? ''}
        confirmLabel={t('candidates.confirm')}
        cancelLabel={t('candidates.cancel')}
        variant={pendingAction?.status === 'rejected' ? 'danger' : 'primary'}
        busy={confirmBusy}
        onCancel={() => {
          if (!confirmBusy) setPendingAction(null)
        }}
        onConfirm={() => void applyPendingAction()}
      />
    </div>
  )
}
