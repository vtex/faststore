import type { ReactNode } from 'react'

import { SummaryTotalizers } from './SummaryTotalizers'
import { SummaryItem } from './SummaryItem'
import type { Totalizer } from '../types'
import { Separator } from '../Separator'
import { Spacer } from '../Spacer'

type SummaryProps = {
  totalizers: Totalizer[]
  total: number
  loadingTotal?: boolean
  shipping?: ReactNode
  coupon: JSX.Element
}

export const Summary = ({
  coupon,
  totalizers = [],
  total,
  loadingTotal = false,
  shipping,
}: SummaryProps) => {
  return (
    <div className="w-full">
      {shipping != null && (
        <>
          {shipping}
          <Separator />
        </>
      )}
      {totalizers.length > 0 && (
        <>
          <SummaryTotalizers totalizers={totalizers} loading={loadingTotal} />
          <Separator />
        </>
      )}
      {coupon}
      <Spacer />
      <SummaryItem label="Total" value={total} loading={loadingTotal} />
    </div>
  )
}
