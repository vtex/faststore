import React, { FC } from 'react'

import { Flex } from '../index'

export interface HeaderProps {
  variant?: string
}

export const Header: FC<HeaderProps> = ({ variant = 'header', children }) => (
  <Flex variant={variant} as="header">
    {children}
  </Flex>
)
