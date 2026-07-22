import type { CandidateStatus } from './candidate'
import { canChangeStatus } from './candidate'

export type BulkPartition = {
  pendingIds: number[]
  lockedCount: number
  unknownCount: number
}

export function partitionSelectedForBulk(
  selectedIds: number[],
  statusById: Record<number, CandidateStatus>,
): BulkPartition {
  const pendingIds: number[] = []
  let lockedCount = 0
  let unknownCount = 0

  for (const id of selectedIds) {
    const status = statusById[id]
    if (!status) {
      unknownCount += 1
      continue
    }
    if (canChangeStatus(status)) {
      pendingIds.push(id)
    } else {
      lockedCount += 1
    }
  }

  return { pendingIds, lockedCount, unknownCount }
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
