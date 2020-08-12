import React, { FC } from 'react'
import { Box } from 'theme-ui'

import { Variant } from '../utils/types'

export interface MinicartBadgeProps extends Variant {
  value: number
}

export const MinicartBadge: FC<MinicartBadgeProps> = ({ variant, value }) => {
  const customVariant = `${variant}.badge`

  return (
    <Box variant={customVariant} as="span">
      {value}
    </Box>
  )
}
