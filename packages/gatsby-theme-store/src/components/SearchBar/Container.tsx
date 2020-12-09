import { Flex } from '@vtex/store-ui'
import React from 'react'
import type { FC } from 'react'

interface Props {
  variant?: string
}

const SearchBarContainer: FC<Props> = ({ children, variant = 'searchbar' }) => (
  <Flex variant={`${variant}.container`}>{children}</Flex>
)

export default SearchBarContainer
