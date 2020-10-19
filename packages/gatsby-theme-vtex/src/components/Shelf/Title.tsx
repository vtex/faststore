import React, { FC } from 'react'
import { Box } from '@vtex/store-ui'

interface Props {
  variant: string
}

const ShelfTitle: FC<Props> = ({ children, variant }) => (
  <Box variant={`shelf.${variant}.title`}>{children}</Box>
)

export default ShelfTitle
