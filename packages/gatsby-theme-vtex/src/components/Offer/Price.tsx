import React, { FC } from 'react'
import { Box } from '@vtex/store-ui'

import { useNumberFormat } from '../../sdk/localization/useNumberFormat'

interface Props {
  price: number
  variant?: string
}

const Price: FC<Props> = ({ price, children, variant = 'offer' }) => {
  const { format } = useNumberFormat()

  return (
    <Box variant={`${variant}.price`}>
      {format(price)}
      {children}
    </Box>
  )
}

export default Price
