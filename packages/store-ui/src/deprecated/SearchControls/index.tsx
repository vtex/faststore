import React from 'react'
import { Box } from 'theme-ui'
import type { FC } from 'react'

interface Props {
  variant?: string
}

export const SearchControls: FC<Props> = ({ children, variant: v }) => {
  const variant = `searchControls${v ? `.${v}` : ''}`

  return <Box variant={variant}>{children}</Box>
}
