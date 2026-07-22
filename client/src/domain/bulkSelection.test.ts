import { describe, expect, it } from 'vitest'
import {
  bulkConfirmCopy,
  partitionSelectedForBulk,
} from './bulkSelection'

describe('partitionSelectedForBulk', () => {
  it('keeps only pending selected ids actionable across pages', () => {
    expect(
      partitionSelectedForBulk([1, 2, 3, 99], {
        1: 'pending',
        2: 'accepted',
        3: 'pending',
      }),
    ).toEqual({
      pendingIds: [1, 3],
      lockedCount: 1,
      unknownCount: 1,
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
