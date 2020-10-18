import React, { FC } from 'react'
import { Box } from '@vtex/store-ui'

interface Props {
  variant?: string
}

const ShelfContainer: FC<Props> = ({ children, variant = 'default' }) => (
  <Box variant={`shelf.${variant}.container`}>{children}</Box>
)

export default ShelfContainer
