import React, { FC } from 'react'
import { Box } from '@vtex/store-ui'

import { useNumberFormat } from '../../sdk/localization/useNumberFormat'

interface Props {
  price: number
  listPrice: number
  variant: string
}

const ListPrice: FC<Props> = ({ variant, listPrice, children, price }) => {
  const { format } = useNumberFormat()

  if (price === listPrice) {
    return null
  }

  return (
    <Box variant={`${variant}.listPrice`}>
      {format(listPrice)}
      {children}
    </Box>
  )
}

export default ListPrice
