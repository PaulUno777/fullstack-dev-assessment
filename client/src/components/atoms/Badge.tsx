import type { CandidateStatus } from '../../domain/candidate'

const styles: Record<CandidateStatus, string> = {
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
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ${styles[status]}`}
    >
      {label}
    </span>
  )
}
