import React, { FC } from 'react'
import { Box } from 'theme-ui'

interface Props {
  totalCount: number
  label: string
  variant?: string
}

export const SearchControlsTotalCount: FC<Props> = ({
  totalCount,
  label,
  variant: v,
}) => {
  const variant = `searchControls${v ? `.${v}` : ''}.totalCount`

  return (
    <Box variant={variant}>
      <span>{totalCount}</span>
      {label}
    </Box>
  )
}
