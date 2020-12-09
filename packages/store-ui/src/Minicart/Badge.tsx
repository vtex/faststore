import React from 'react'
import { Box } from 'theme-ui'
import type { FC } from 'react'

import type { Variant } from '../utils/types'

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
