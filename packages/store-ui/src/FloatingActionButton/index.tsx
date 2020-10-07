import React, { FC } from 'react'
import { Flex } from 'theme-ui'

export interface FloatingActionButtonProps {
  variant?: string
  href?: string
}

const FloatingActionButton: FC<FloatingActionButtonProps> = ({
  variant = 'floatingActionButton',
  href = '/',
  children,
}) => (
  <Flex variant={variant}>
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  </Flex>
)

export default FloatingActionButton
