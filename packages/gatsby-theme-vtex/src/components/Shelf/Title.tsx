/** @jsx jsx */
import { jsx, Flex, Heading } from '@vtex/store-ui'
import { FC } from 'react'

interface Props {
  title: string
  variant: string
}

const ShelfTitle: FC<Props> = ({ title, variant }) => (
  <Flex
    p={2}
    sx={{ justifyContent: 'center' }}
    marginY={[16, 30]}
    variant={`${variant}.title.container`}
  >
    <Heading variant={`${variant}.title.text`} as="h2">
      {title}
    </Heading>
  </Flex>
)

export default ShelfTitle
