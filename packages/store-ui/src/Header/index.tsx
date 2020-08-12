import React, { FC } from 'react'
import { Flex } from 'theme-ui'

export interface HeaderProps {
  variant?: string
}

export const Header: FC<HeaderProps> = ({ variant = 'header', children }) => (
  <Flex variant={variant} as="header">
    {children}
  </Flex>
)
