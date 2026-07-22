import type { CandidateStatus } from '@/domain/candidate'
import { cn } from '@/lib/cn'

const statusStyles: Record<CandidateStatus, string> = {
  pending: 'bg-amber-100 text-amber-900',
  accepted: 'bg-teal-100 text-teal-900',
  rejected: 'bg-rose-100 text-rose-900',
}

export function StatusBadge({
  status,
  label,
}: {
  status: CandidateStatus
  label: string
}) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide',
        statusStyles[status],
      )}
    >
      {label}
    </span>
  )
}

export function ReviewedBadge({
  reviewed,
  needsLabel,
  reviewedLabel,
}: {
  reviewed: boolean
  needsLabel: string
  reviewedLabel: string
}) {
  if (reviewed) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-900">
        <span aria-hidden="true" className="text-[11px] leading-none">
          ✓
        </span>
        {reviewedLabel}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-950">
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-600"
      />
      {needsLabel}
    </span>
  )
}
