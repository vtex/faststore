import { Center, Text } from '@vtex/store-ui'
import { graphql } from 'gatsby'
import React, { FC } from 'react'

import { Props } from '../../templates/product'

const AboveTheFold: FC<Props> = ({
  data: {
    vtex: { product },
  },
  slug,
}) => (
  <Center height="800px">
    <Text>
      This is the Above the fold part of your product template. All sync items
      should be rendered in here. Thus, make sure all data rendered in this part
      is fetched during Server Side Rendering and revalidated on the client if
      necessary
    </Text>
    <Text>
      Product info will be available via the &quot;data.vtex.product&quot; prop.
      Also, if you want to fetch more fields, you can add these fields in the
      &quot;ProductDetailsTemplate_product&quot; fragment. These fields will be
      available in the same prop as above.
      <br />
      Currently, the only info in this page&apos;s context are:
      <ul>
        <li>slug: {slug}</li>
        <li>productName: {product!.productName}</li>
      </ul>
    </Text>
  </Center>
)

export const query = graphql`
  fragment ProductDetailsTemplate_product on VTEX_Product {
    productName
  }
`

export default AboveTheFold
