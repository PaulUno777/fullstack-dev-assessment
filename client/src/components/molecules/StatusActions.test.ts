import { describe, expect, it } from 'vitest'
import { canChangeStatus } from '@/domain/candidate'

describe('StatusActions rule alignment', () => {
  it('mirrors domain lock for final statuses', () => {
    expect(canChangeStatus('pending')).toBe(true)
    expect(canChangeStatus('accepted')).toBe(false)
    expect(canChangeStatus('rejected')).toBe(false)
  })
})
