import { SummaryItem } from './SummaryItem'
import type { Totalizer } from '../types'

export type SummaryTotalizersProps = {
  totalizers: Totalizer[]
  loading?: boolean
}

export const SummaryTotalizers = ({
  totalizers,
  loading = false,
}: SummaryTotalizersProps) => {
  return (
    <div className="text-text-secondary flex flex-col space-y-4">
      {totalizers?.map((totalizer) => (
        <SummaryItem
          key={totalizer.id}
          label={totalizer.id}
          value={totalizer.value}
          loading={loading}
        />
      ))}
    </div>
  )
}
