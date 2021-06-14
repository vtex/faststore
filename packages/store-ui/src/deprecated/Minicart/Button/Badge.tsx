import React from 'react'
import { Box } from 'theme-ui'
import type { FC } from 'react'

interface Props {
  variant: string
  value: number
}

const MinicartButtonBadge: FC<Props> = ({ variant, value }) => (
  <Box variant={`${variant}.badge`} as="span">
    {value}
  </Box>
)

export default MinicartButtonBadge
