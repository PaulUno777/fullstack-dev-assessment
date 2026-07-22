import { useTranslation } from 'react-i18next'
import { ReviewedBadge } from '@/components/atoms/Badge'
import type { CandidateListFields } from '@/domain/candidate'
import { formatDate } from '@/i18n/formatDate'

type Props = {
  fields: Pick<CandidateListFields, 'date_applied' | 'reviewed'>
}

export function CandidateMetaFields({ fields }: Props) {
  const { t, i18n } = useTranslation()

  return (
    <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
      <div>
        <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {t('candidates.fields.dateApplied')}
        </dt>
        <dd className="mt-1 text-slate-800">
          {formatDate(fields.date_applied, i18n.language)}
        </dd>
      </div>
      <div>
        <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {t('candidates.fields.reviewed')}
        </dt>
        <dd className="mt-1">
          <ReviewedBadge
            reviewed={fields.reviewed}
            needsLabel={t('candidates.needsReview')}
            reviewedLabel={t('candidates.reviewedDone')}
          />
        </dd>
      </div>
    </dl>
  )
}
