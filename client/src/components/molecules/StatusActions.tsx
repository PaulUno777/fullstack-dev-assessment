import { useTranslation } from 'react-i18next'
import { Button } from '@/components/atoms/Button'
import { canChangeStatus } from '@/domain/candidate'
import type { CandidateStatus } from '@/domain/candidate'

type Props = {
  status: CandidateStatus
  disabled?: boolean
  onAccept: () => void
  onReject: () => void
}

export function StatusActions({ status, disabled, onAccept, onReject }: Props) {
  const { t } = useTranslation()
  const unlocked = canChangeStatus(status)

  if (!unlocked) {
    return (
      <p className="text-xs text-slate-500">{t('candidates.statusLocked')}</p>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="primary" disabled={disabled} onClick={onAccept}>
        {t('candidates.accept')}
      </Button>
      <Button variant="danger" disabled={disabled} onClick={onReject}>
        {t('candidates.reject')}
      </Button>
    </div>
  )
}
