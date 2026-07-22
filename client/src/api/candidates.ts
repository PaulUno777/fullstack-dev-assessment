import type { Candidate, CandidateStatus } from '../domain/candidate'

export type ListMeta = {
  page: number
  per_page: number
  total: number
  total_pages: number
}

export type ListCandidatesParams = {
  page?: number
  per_page?: number
  status?: CandidateStatus | CandidateStatus[] | ''
  q?: string
  sort?: 'status' | 'date_applied'
  direction?: 'asc' | 'desc'
}

export type ListCandidatesResponse = {
  data: Candidate[]
  meta: ListMeta
}

export type ApiErrorBody = {
  errors: Array<{ code: string; message: string }>
}

export class ApiError extends Error {
  code: string
  status: number

  constructor(status: number, code: string, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

function apiBase(): string {
  const raw = import.meta.env.VITE_API_URL as string | undefined
  return raw?.replace(/\/$/, '') ?? ''
}

async function parseJson<T>(response: Response): Promise<T> {
  const body = (await response.json()) as T | ApiErrorBody
  if (!response.ok) {
    const first = (body as ApiErrorBody).errors?.[0]
    throw new ApiError(
      response.status,
      first?.code ?? 'unknown',
      first?.message ?? response.statusText,
    )
  }
  return body as T
}

export async function listCandidates(
  params: ListCandidatesParams,
  locale: string,
): Promise<ListCandidatesResponse> {
  const query = new URLSearchParams()
  if (params.page) query.set('page', String(params.page))
  if (params.per_page) query.set('per_page', String(params.per_page))
  if (Array.isArray(params.status) && params.status.length > 0) {
    query.set('status', params.status.join(','))
  } else if (typeof params.status === 'string' && params.status) {
    query.set('status', params.status)
  }
  if (params.q) query.set('q', params.q)
  if (params.sort) query.set('sort', params.sort)
  if (params.direction) query.set('direction', params.direction)

  const qs = query.toString()
  const response = await fetch(`${apiBase()}/candidates${qs ? `?${qs}` : ''}`, {
    headers: {
      Accept: 'application/json',
      'Accept-Language': locale,
    },
  })
  return parseJson<ListCandidatesResponse>(response)
}

export async function updateCandidateStatus(
  id: number,
  status: Exclude<CandidateStatus, 'pending'>,
  locale: string,
): Promise<Candidate> {
  const response = await fetch(`${apiBase()}/candidates/${id}`, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': locale,
    },
    body: JSON.stringify({ candidate: { status } }),
  })
  return parseJson<Candidate>(response)
}

export type BulkUpdateResponse = {
  data: Candidate[]
  meta: { updated: number; failed: number }
  errors: Array<{ id: number; code: string; message: string }>
}

export async function bulkUpdateCandidateStatus(
  ids: number[],
  status: Exclude<CandidateStatus, 'pending'>,
  locale: string,
): Promise<BulkUpdateResponse> {
  const response = await fetch(`${apiBase()}/candidates/bulk`, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': locale,
    },
    body: JSON.stringify({ ids, status }),
  })
  return parseJson<BulkUpdateResponse>(response)
}
