/** @jsx jsx */
import { jsx, Flex, Heading } from '@vtex/store-ui'
import { FC } from 'react'

interface Props {
  title: string
  variant?: string
}

const ShelfTitle: FC<Props> = ({ title, variant = 'shelfTitle' }) => (
  <Flex p={2} sx={{ justifyContent: 'center' }} marginY={[16, 30]}>
    <Heading variant={variant} as="h2">
      {title}
    </Heading>
  </Flex>
)

export default ShelfTitle
