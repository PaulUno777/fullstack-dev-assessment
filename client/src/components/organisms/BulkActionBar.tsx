import { useTranslation } from 'react-i18next'
import { Button } from '@/components/atoms/Button'

type Props = {
  selectedCount: number
  actionableCount: number
  busy?: boolean
  onAccept: () => void
  onReject: () => void
  onClear: () => void
}

export function BulkActionBar({
  selectedCount,
  actionableCount,
  busy,
  onAccept,
  onReject,
  onClear,
}: Props) {
  const { t } = useTranslation()

  if (selectedCount === 0) return null

  const canAct = actionableCount > 0

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center p-4">
      <div className="pointer-events-auto w-full max-w-3xl rounded-xl border border-teal-800/20 bg-teal-900 px-4 py-3 text-white shadow-lg">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium">
            {t('candidates.selectedCount', { count: selectedCount })}
            {selectedCount !== actionableCount
              ? ` · ${t('candidates.bulkActionableHint', { count: actionableCount })}`
              : null}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              className="bg-white! text-teal-900!"
              disabled={busy || !canAct}
              onClick={onAccept}
            >
              {t('candidates.accept')}
            </Button>
            <Button
              variant="danger"
              disabled={busy || !canAct}
              onClick={onReject}
            >
              {t('candidates.reject')}
            </Button>
            <Button
              variant="ghost"
              className="text-teal-50! hover:bg-teal-800!"
              disabled={busy}
              onClick={onClear}
            >
              {t('candidates.clearSelection')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
