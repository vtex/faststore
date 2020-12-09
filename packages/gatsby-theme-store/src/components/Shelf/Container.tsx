import { Box } from '@vtex/store-ui'
import React from 'react'
import type { FC } from 'react'

interface Props {
  variant?: string
}

const ShelfContainer: FC<Props> = ({ children, variant = 'default' }) => (
  <Box variant={`shelf.${variant}.container`}>{children}</Box>
)

export default ShelfContainer
