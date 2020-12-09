import { Box } from '@vtex/store-ui'
import React from 'react'
import type { FC } from 'react'

interface Props {
  variant?: string
}

const Container: FC<Props> = ({ variant, children }) => (
  <Box variant={`${variant}.miniature.container`}>{children}</Box>
)

export default Container
