/** @jsx jsx */
import { jsx, Flex, Heading } from '@vtex/store-ui'
import { FC, ReactNode } from 'react'

interface Props {
  title: ReactNode
  variant?: string
}

const ShelfTitle: FC<Props> = ({ title, variant = 'shelf.default.title' }) => (
  <Flex p={2} sx={{ justifyContent: 'center' }} marginY={[16, 30]}>
    <Heading variant={variant} as="h2">
      {title}
    </Heading>
  </Flex>
)

export default ShelfTitle
