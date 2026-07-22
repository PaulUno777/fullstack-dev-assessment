import { describe, expect, it } from 'vitest'
import {
  bulkConfirmCopy,
  partitionSelectedForBulk,
} from './bulkSelection'
import type { Candidate } from './candidate'

function candidate(
  overrides: Partial<Candidate> & Pick<Candidate, 'id' | 'status'>,
): Candidate {
  return {
    name: 'Test',
    years_exp: 1,
    date_applied: '2020-01-01T00:00:00.000Z',
    reviewed: overrides.status !== 'pending',
    description: '',
    created_at: '2020-01-01T00:00:00.000Z',
    updated_at: '2020-01-01T00:00:00.000Z',
    ...overrides,
  }
}

describe('partitionSelectedForBulk', () => {
  it('keeps only pending selected ids actionable', () => {
    const rows = [
      candidate({ id: 1, status: 'pending' }),
      candidate({ id: 2, status: 'accepted' }),
      candidate({ id: 3, status: 'pending' }),
    ]

    expect(partitionSelectedForBulk(rows, [1, 2, 3, 99])).toEqual({
      pendingIds: [1, 3],
      lockedCount: 1,
    })
  })
})

describe('bulkConfirmCopy', () => {
  it('mentions skipped locked selections', () => {
    const t = (key: string, options?: Record<string, unknown>) =>
      `${key}:${JSON.stringify(options ?? {})}`

    const copy = bulkConfirmCopy({
      action: 'accepted',
      pendingCount: 2,
      lockedCount: 1,
      t,
    })

    expect(copy.title).toContain('confirmTitle')
    expect(copy.message).toContain('confirmAcceptMany')
    expect(copy.message).toContain('confirmSkippedLocked')
    expect(copy.message).toContain('"count":2')
    expect(copy.message).toContain('"count":1')
  })
})
