import React from 'react'
import { Flex, Heading, Text } from 'theme-ui'
import type { FC } from 'react'

interface Props {
  title?: string
  description?: string
}

const InfoCardInfo: FC<Props> = ({ title, description, children }) => (
  <Flex variant="card.info">
    {title && <Heading variant="card.info.title">{title}</Heading>}
    {description && <Text variant="card.info.description">{description}</Text>}
    {children && <Flex variant="card.info.children">{children}</Flex>}
  </Flex>
)

export default InfoCardInfo
