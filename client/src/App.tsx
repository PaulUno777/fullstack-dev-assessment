import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from './components/LanguageSwitcher'

function App() {
  const { t } = useTranslation()

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm font-medium tracking-wide text-slate-500">
            {t('app.brand')}
          </p>
          <LanguageSwitcher />
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          {t('app.title')}
        </h1>
        <p className="mt-3 max-w-prose text-slate-600">{t('app.subtitle')}</p>
      </div>
    </main>
  )
}

export default App
