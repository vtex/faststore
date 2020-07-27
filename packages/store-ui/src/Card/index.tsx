import React, { PropsWithChildren } from 'react'
import { Flex } from 'theme-ui'

interface Props {
  variant?: string
}

function Card({ children, variant }: PropsWithChildren<Props>) {
  const variantStr = `card${variant ? `.${variant}` : ''}`

  return <Flex variant={variantStr}>{children}</Flex>
}

export default Card
