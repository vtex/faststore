import React from 'react'
import { Center, Flex, Text } from '@vtex/store-ui'
import type { FC } from 'react'

export interface Props {
  product: any
}

const ProductSummary: FC<Props> = () => (
  <Flex sx={{ flexWrap: 'wrap' }}>
    <Center height="50px">
      <Text>This is the product summary component</Text>
    </Center>
    <Center height="120px">
      <Text>
        This component is used in many different parts of your store, like in
        the shelf and search results
      </Text>
    </Center>
    <Center height="120px">
      <Text>
        Base building blocks are available in <strong>@vtex/store-ui</strong>.
        Use them to create your own cusstom version of product summary via
        Shadowing.
      </Text>
    </Center>
  </Flex>
)

export default ProductSummary
