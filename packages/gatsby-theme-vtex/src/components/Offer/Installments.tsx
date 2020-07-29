import React, { FC } from 'react'
import { Box } from 'theme-ui'

import { useInstallments } from './hooks/useInstallments'
import { OfferBlocksProps } from './OfferBlocks'

const Installments: FC<OfferBlocksProps> = ({ variant, offer }) => {
  const { highestInstallment, formatPrice } = useInstallments(offer)

  if (!highestInstallment) {
    return null
  }

  return (
    <Box variant={`${variant}.installments`}>
      {`Up to ${highestInstallment.NumberOfInstallments}x ${formatPrice(
        highestInstallment.Value
      )} interest-free`}
    </Box>
  )
}

export default Installments
