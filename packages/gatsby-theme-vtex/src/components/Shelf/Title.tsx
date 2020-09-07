/** @jsx jsx */
import { jsx, Flex, Heading } from '@vtex/store-ui'
import { FC } from 'react'

interface Props {
  title: string
}

const ShelfTitle: FC<Props> = ({ title }) => (
  <Flex p={2} sx={{ justifyContent: 'center' }} marginY={[16, 30]}>
    <Heading variant="shelfTitle" as="h2">
      {title}
    </Heading>
  </Flex>
)

export default ShelfTitle
