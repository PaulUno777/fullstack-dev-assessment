import type { Candidate, CandidateStatus } from './candidate'
import { canChangeStatus } from './candidate'

export type BulkPartition = {
  pendingIds: number[]
  lockedCount: number
}

export function partitionSelectedForBulk(
  candidates: Candidate[],
  selectedIds: number[],
): BulkPartition {
  const byId = new Map(candidates.map((row) => [row.id, row]))
  const pendingIds: number[] = []
  let lockedCount = 0

  for (const id of selectedIds) {
    const row = byId.get(id)
    if (!row) continue
    if (canChangeStatus(row.status)) {
      pendingIds.push(id)
    } else {
      lockedCount += 1
    }
  }

  return { pendingIds, lockedCount }
}

export function bulkConfirmCopy(input: {
  action: Exclude<CandidateStatus, 'pending'>
  pendingCount: number
  lockedCount: number
  t: (key: string, options?: Record<string, unknown>) => string
}): { title: string; message: string } {
  const { action, pendingCount, lockedCount, t } = input
  const title = t('candidates.confirmTitle')
  const baseKey =
    action === 'accepted'
      ? 'candidates.confirmAcceptMany'
      : 'candidates.confirmRejectMany'
  let message = t(baseKey, { count: pendingCount })
  if (lockedCount > 0) {
    message = `${message} ${t('candidates.confirmSkippedLocked', { count: lockedCount })}`
  }
  return { title, message }
}
