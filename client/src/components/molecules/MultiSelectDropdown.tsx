import { useTranslation } from 'react-i18next'
import type { CandidateStatus } from '../../domain/candidate'
import { Dropdown } from './Dropdown'

const ALL_STATUSES: CandidateStatus[] = ['pending', 'accepted', 'rejected']

type Props = {
  value: CandidateStatus[]
  onChange: (next: CandidateStatus[]) => void
}

const chipIdle =
  'inline-flex w-full items-center justify-between gap-2 rounded-2xl border border-dashed border-slate-300 bg-white/80 px-3 py-2 text-left text-sm text-slate-800 outline-none hover:bg-white focus-visible:ring-2 focus-visible:ring-teal-700/30'
const chipActive =
  'inline-flex w-full items-center justify-between gap-2 rounded-2xl border border-solid border-teal-700/50 bg-teal-50 px-3 py-2 text-left text-sm text-teal-950 ring-2 ring-teal-700/50 outline-none focus-visible:ring-2 focus-visible:ring-teal-700/30'

export function MultiSelectDropdown({ value, onChange }: Props) {
  const { t } = useTranslation()
  const active = value.length > 0

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
    <div className="flex min-w-[9rem] items-end gap-1">
      <Dropdown
        keepOpenOnSelect
        showChevron
        className="min-w-0 flex-1"
        triggerClassName={`${active ? chipActive : chipIdle} h-[38px]`}
        trigger={
          <span className="truncate" title={triggerLabel}>
            <span className="sr-only">{t('candidates.filterStatus')}: </span>
            {triggerLabel}
          </span>
        }
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
      {active ? (
        <button
          type="button"
          className="mb-[1px] rounded-2xl border border-dashed border-slate-300 bg-white px-2.5 py-2 text-sm text-slate-600 hover:bg-slate-50"
          aria-label={t('candidates.clearStatusFilter')}
          onClick={() => onChange([])}
        >
          ×
        </button>
      ) : null}
    </div>
  )
}
