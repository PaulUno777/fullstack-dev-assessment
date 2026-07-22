export const LOCALE_STORAGE_KEY = 'candidates.locale'
export const SUPPORTED_LOCALES = ['en', 'de', 'fr'] as const
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

export function isSupportedLocale(value: string): value is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value)
}

export function detectBrowserLocale(
  language = typeof navigator !== 'undefined' ? navigator.language : 'en',
): SupportedLocale {
  const code = language.slice(0, 2).toLowerCase()
  return isSupportedLocale(code) ? code : 'en'
}

export function resolveInitialLocale(
  storage: Pick<Storage, 'getItem'> | null = typeof localStorage !== 'undefined'
    ? localStorage
    : null,
  language = typeof navigator !== 'undefined' ? navigator.language : 'en',
): SupportedLocale {
  const stored = storage?.getItem(LOCALE_STORAGE_KEY)
  if (stored && isSupportedLocale(stored)) return stored
  return detectBrowserLocale(language)
}
