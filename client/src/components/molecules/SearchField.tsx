import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCandidatesUiStore } from '../../state/candidatesUiStore'
import { Input } from '../atoms/Input'

export function SearchField() {
  const { t } = useTranslation()
  const q = useCandidatesUiStore((s) => s.q)
  const setQ = useCandidatesUiStore((s) => s.setQ)
  const [draft, setDraft] = useState(q)

  useEffect(() => {
    const handle = window.setTimeout(() => setQ(draft), 300)
    return () => window.clearTimeout(handle)
  }, [draft, setQ])

  return (
    <label className="flex w-full flex-col gap-1 text-xs font-medium text-slate-600 sm:max-w-xs">
      {t('candidates.search')}
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder={t('candidates.searchPlaceholder')}
      />
    </label>
  )
}
