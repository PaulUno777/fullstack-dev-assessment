import { useTranslation } from 'react-i18next'
import { useCandidatesUiStore } from '../../state/candidatesUiStore'
import { Button } from '../atoms/Button'

type Props = {
  page: number
  totalPages: number
  total: number
}

export function Pagination({ page, totalPages, total }: Props) {
  const { t } = useTranslation()
  const setPage = useCandidatesUiStore((s) => s.setPage)

  if (totalPages <= 1) {
    return (
      <p className="text-sm text-slate-500">
        {t('candidates.totalCount', { count: total })}
      </p>
    )
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-slate-500">
        {t('candidates.pageOf', { page, totalPages })} ·{' '}
        {t('candidates.totalCount', { count: total })}
      </p>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          {t('candidates.prev')}
        </Button>
        <Button
          variant="secondary"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          {t('candidates.next')}
        </Button>
      </div>
    </div>
  )
}
