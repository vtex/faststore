import React, { FC } from 'react'
import { Flex } from 'theme-ui'

interface Props {
  variant?: string
}

const Card: FC<Props> = ({ children, variant }) => {
  const variantStr = `card${variant ? `.${variant}` : ''}`

  return <Flex variant={variantStr}>{children}</Flex>
}

export default Card
