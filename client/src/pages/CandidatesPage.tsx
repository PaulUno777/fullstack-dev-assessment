import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ApiError } from '../api/candidates'
import {
  useCandidatesListQuery,
  useUpdateCandidateStatusMutation,
} from '../hooks/useCandidatesQuery'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import { CandidatesToolbar } from '../components/organisms/CandidatesToolbar'
import { CandidateCard } from '../components/organisms/CandidateCard'
import { Pagination } from '../components/organisms/Pagination'

export function CandidatesPage() {
  const { t } = useTranslation()
  const listQuery = useCandidatesListQuery()
  const mutation = useUpdateCandidateStatusMutation()
  const [rowErrors, setRowErrors] = useState<Record<number, string>>({})

  async function changeStatus(
    id: number,
    status: 'accepted' | 'rejected',
  ) {
    setRowErrors((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    try {
      await mutation.mutateAsync({ id, status })
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : t('candidates.unknownError')
      setRowErrors((prev) => ({ ...prev, [id]: message }))
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3efe6] text-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.12),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(180,83,9,0.1),_transparent_35%)]" />
      <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-900/70">
              {t('app.brand')}
            </p>
            <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              {t('app.title')}
            </h1>
            <p className="mt-3 max-w-2xl text-base text-slate-700">
              {t('app.subtitle')}
            </p>
          </div>
          <LanguageSwitcher />
        </header>

        <div className="space-y-6">
          <CandidatesToolbar />

          {listQuery.isLoading ? (
            <p className="rounded-xl border border-dashed border-slate-300 bg-white/60 px-4 py-10 text-center text-slate-600">
              {t('candidates.loading')}
            </p>
          ) : null}

          {listQuery.isError ? (
            <p
              className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-6 text-rose-800"
              role="alert"
            >
              {listQuery.error instanceof Error
                ? listQuery.error.message
                : t('candidates.loadError')}
            </p>
          ) : null}

          {listQuery.data && listQuery.data.data.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-300 bg-white/60 px-4 py-10 text-center text-slate-600">
              {t('candidates.empty')}
            </p>
          ) : null}

          <div className="grid gap-4">
            {listQuery.data?.data.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                busy={mutation.isPending}
                errorMessage={rowErrors[candidate.id]}
                onAccept={() => void changeStatus(candidate.id, 'accepted')}
                onReject={() => void changeStatus(candidate.id, 'rejected')}
              />
            ))}
          </div>

          {listQuery.data ? (
            <Pagination
              page={listQuery.data.meta.page}
              totalPages={listQuery.data.meta.total_pages}
              total={listQuery.data.meta.total}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}
