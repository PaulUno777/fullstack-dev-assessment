import { describe, expect, it } from 'vitest'
import { detectBrowserLocale, resolveInitialLocale } from './locale'

describe('detectBrowserLocale', () => {
  it('maps supported browser languages', () => {
    expect(detectBrowserLocale('de-DE')).toBe('de')
    expect(detectBrowserLocale('fr-CA')).toBe('fr')
    expect(detectBrowserLocale('en-US')).toBe('en')
  })

  it('falls back to en for unsupported languages', () => {
    expect(detectBrowserLocale('es-ES')).toBe('en')
    expect(detectBrowserLocale('')).toBe('en')
  })
})

describe('resolveInitialLocale', () => {
  it('prefers an explicit stored locale over the browser', () => {
    const storage = {
      getItem: () => 'fr',
    }
    expect(resolveInitialLocale(storage, 'de-DE')).toBe('fr')
  })

  it('uses browser detection when nothing is stored', () => {
    const storage = {
      getItem: () => null,
    }
    expect(resolveInitialLocale(storage, 'de-DE')).toBe('de')
  })
})
