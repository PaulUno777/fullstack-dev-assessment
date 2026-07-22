import { describe, expect, it } from 'vitest'
import { canChangeStatus, toListFields } from './candidate'
import type { Candidate } from './candidate'

const sample: Candidate = {
  id: 1,
  name: 'Alan Cruz',
  years_exp: 10,
  status: 'pending',
  date_applied: '2018-06-05T11:55:42.000Z',
  reviewed: false,
  description: 'litigator',
  created_at: '2018-06-05T11:55:42.000Z',
  updated_at: '2018-06-05T11:55:42.000Z',
}

describe('canChangeStatus', () => {
  it('allows pending candidates', () => {
    expect(canChangeStatus('pending')).toBe(true)
  })

  it('locks accepted and rejected candidates', () => {
    expect(canChangeStatus('accepted')).toBe(false)
    expect(canChangeStatus('rejected')).toBe(false)
  })
})

describe('toListFields', () => {
  it('omits id, created_at, and updated_at', () => {
    const fields = toListFields(sample)
    expect(fields).toEqual({
      name: 'Alan Cruz',
      years_exp: 10,
      status: 'pending',
      date_applied: '2018-06-05T11:55:42.000Z',
      reviewed: false,
      description: 'litigator',
    })
    expect(fields).not.toHaveProperty('id')
    expect(fields).not.toHaveProperty('created_at')
    expect(fields).not.toHaveProperty('updated_at')
  })
})
