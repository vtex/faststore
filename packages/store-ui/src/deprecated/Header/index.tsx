import React from 'react'
import { Flex } from 'theme-ui'
import type { FC } from 'react'

export interface HeaderProps {
  variant?: string
}

export const Header: FC<HeaderProps> = ({ variant = 'header', children }) => (
  <Flex variant={variant} as="header">
    {children}
  </Flex>
)
