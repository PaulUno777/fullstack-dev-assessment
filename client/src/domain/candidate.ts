export type CandidateStatus = 'pending' | 'accepted' | 'rejected'

export type Candidate = {
  id: number
  name: string
  years_exp: number
  status: CandidateStatus
  date_applied: string
  reviewed: boolean
  description: string
  created_at: string
  updated_at: string
}

/** Fields the brief requires on the list UI (excludes id/created/updated). */
export type CandidateListFields = Pick<
  Candidate,
  'name' | 'years_exp' | 'status' | 'date_applied' | 'reviewed' | 'description'
>

export function canChangeStatus(status: CandidateStatus): boolean {
  return status === 'pending'
}

export function toListFields(candidate: Candidate): CandidateListFields {
  const { name, years_exp, status, date_applied, reviewed, description } =
    candidate
  return { name, years_exp, status, date_applied, reviewed, description }
}
