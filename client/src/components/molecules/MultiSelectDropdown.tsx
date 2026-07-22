import { useTranslation } from 'react-i18next'
import type { CandidateStatus } from '../../domain/candidate'
import { Dropdown } from './Dropdown'

const ALL_STATUSES: CandidateStatus[] = ['pending', 'accepted', 'rejected']

type Props = {
  value: CandidateStatus[]
  onChange: (next: CandidateStatus[]) => void
}

export function MultiSelectDropdown({ value, onChange }: Props) {
  const { t } = useTranslation()

  const triggerLabel =
    value.length === 0
      ? t('candidates.allStatuses')
      : value.map((status) => t(`candidates.statuses.${status}`)).join(' | ')

  function toggle(status: CandidateStatus) {
    if (value.includes(status)) {
      onChange(value.filter((item) => item !== status))
      return
    }
    onChange([...value, status])
  }

  return (
    <div className="flex min-w-[11rem] items-end gap-1">
      <Dropdown
        label={t('candidates.filterStatus')}
        keepOpenOnSelect
        className="min-w-0 flex-1"
        trigger={<span className="truncate">{triggerLabel}</span>}
      >
        {ALL_STATUSES.map((status) => {
          const checked = value.includes(status)
          return (
            <button
              key={status}
              type="button"
              role="option"
              aria-selected={checked}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-800 hover:bg-slate-50"
              onClick={() => toggle(status)}
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded border text-[10px] ${
                  checked
                    ? 'border-teal-800 bg-teal-800 text-white'
                    : 'border-slate-300 bg-white text-transparent'
                }`}
                aria-hidden="true"
              >
                ✓
              </span>
              {t(`candidates.statuses.${status}`)}
            </button>
          )
        })}
      </Dropdown>
      {value.length > 0 ? (
        <button
          type="button"
          className="mb-[1px] rounded-md border border-slate-300 bg-white px-2 py-2 text-sm text-slate-600 hover:bg-slate-50"
          aria-label={t('candidates.clearStatusFilter')}
          onClick={() => onChange([])}
        >
          ×
        </button>
      ) : null}
    </div>
  )
}
