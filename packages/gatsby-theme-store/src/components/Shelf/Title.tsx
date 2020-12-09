import { Box } from '@vtex/store-ui'
import React from 'react'
import type { FC } from 'react'

interface Props {
  variant: string
}

const ShelfTitle: FC<Props> = ({ children, variant }) => (
  <Box variant={`shelf.${variant}.title`}>{children}</Box>
)

export default ShelfTitle
