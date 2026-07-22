import { useTranslation } from 'react-i18next'
import { Dropdown } from './molecules/Dropdown'

const LOCALES = ['en', 'de', 'fr'] as const

function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0 text-slate-600"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" />
    </svg>
  )
}

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  const current = (i18n.resolvedLanguage ?? i18n.language).slice(0, 2)
  const currentLabel = t(
    `language.${LOCALES.includes(current as (typeof LOCALES)[number]) ? current : 'en'}`,
  )

  return (
    <Dropdown
      align="right"
      className="w-[10.5rem]"
      trigger={
        <span className="flex items-center gap-2">
          <GlobeIcon />
          <span>{currentLabel}</span>
        </span>
      }
    >
      {({ close }) =>
        LOCALES.map((locale) => (
          <button
            key={locale}
            type="button"
            role="option"
            aria-selected={current === locale}
            className="flex w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-800 hover:bg-slate-50"
            onClick={() => {
              void i18n.changeLanguage(locale)
              close()
            }}
          >
            {t(`language.${locale}`)}
          </button>
        ))
      }
    </Dropdown>
  )
}
