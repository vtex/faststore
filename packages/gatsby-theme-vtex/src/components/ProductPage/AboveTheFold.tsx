import { Center, Text } from '@vtex/store-ui'
import { graphql } from 'gatsby'
import React, { FC } from 'react'

import { ProductPageProps } from '../../templates/product'

const format = (x: string) =>
  x.length > 100 ? `${x.slice(0, 100)} ...Truncated` : x

const AboveTheFold: FC<ProductPageProps> = (props) => (
  <>
    <Center height="150px">
      <Text sx={{ width: '50%' }}>
        This is the Above the fold part of your product template. All sync items
        should be rendered in here. Thus, make sure all data rendered in this
        part is fetched during Server Side Rendering and revalidated on the
        client if necessary
      </Text>
    </Center>
    <Center height="150px">
      <Text sx={{ width: '50%' }}>
        Product info will be available via the &quot;data.vtex.product&quot;
        prop. Also, if you want to fetch more fields, you can add these fields
        in the &quot;ProductDetailsTemplate_product&quot; fragment. These fields
        will be available in the same prop as above.
      </Text>
    </Center>
    <Center>
      <Text sx={{ width: '50%' }}>
        Currently, this page&apos;s props are:
        <ul>
          {Object.keys(props)
            .filter(
              (k) =>
                typeof (props as any)[k] === 'object' ||
                typeof (props as any)[k] === 'string' ||
                typeof (props as any)[k] === 'number'
            )
            .map((key) => (
              <li key={key}>
                {key}: {format(JSON.stringify((props as any)[key]))}
              </li>
            ))}
        </ul>
      </Text>
    </Center>
  </>
)

export const fragment = graphql`
  fragment ProductDetailsTemplate_product on VTEX_Product {
    productReference
    productName
    linkText
    items {
      images {
        imageUrl
        imageText
      }
    }
    productClusters {
      name
    }
  }
`

export default AboveTheFold
