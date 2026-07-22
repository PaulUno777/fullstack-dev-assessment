import { useTranslation } from 'react-i18next'

const LOCALES = ['en', 'de', 'fr'] as const

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation()

  return (
    <label className="flex items-center gap-2 text-sm text-slate-600">
      <span>{t('language.label')}</span>
      <select
        className="rounded border border-slate-300 bg-white px-2 py-1"
        value={i18n.resolvedLanguage ?? i18n.language}
        onChange={(event) => {
          void i18n.changeLanguage(event.target.value)
        }}
      >
        {LOCALES.map((locale) => (
          <option key={locale} value={locale}>
            {t(`language.${locale}`)}
          </option>
        ))}
      </select>
    </label>
  )
}
