import React from 'react'
import { Box } from 'theme-ui'
import type { FC } from 'react'

interface Props {
  variant?: string
}

const Container: FC<Props> = ({ variant, children }) => (
  <Box variant={`${variant}.miniature.container`}>{children}</Box>
)

export default Container
