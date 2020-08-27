import React, { FC, Fragment } from 'react'

import { SummaryItem } from './SummaryItem'
import { useSummary } from './SummaryContext'

const minTotalizerValue = 0
const tba = null
const shippingData = {
  id: 'Shipping',
  name: '',
  value: tba,
  __typename: 'Totalizer',
}

const isShippingPresent = (totalizers: any[]) => {
  return totalizers.some((t) => t.id === 'Shipping')
}

interface SummaryTotalizersProps {
  showTotal?: boolean
  showDeliveryTotal?: boolean
}

export const SummaryTotalizers: FC<SummaryTotalizersProps> = ({
  showTotal = true,
  showDeliveryTotal = true,
}) => {
  const { loading, totalizers, total } = useSummary()

  if (loading) {
    return <>loading...</>
  }

  if (!isShippingPresent(totalizers) && showDeliveryTotal) {
    totalizers.push(shippingData)
  }

  return (
    <Fragment>
      {totalizers.map((totalizer: any) => (
        <SummaryItem
          key={totalizer.id}
          label={totalizer.id}
          name={totalizer.id === 'CustomTax' ? totalizer.name : ''}
          value={totalizer.value}
          large={false}
        />
      ))}

      {showTotal && (
        <SummaryItem label="Total" value={total || minTotalizerValue} large />
      )}
    </Fragment>
  )
}
