import React from 'react'
import { Flex, Text } from 'theme-ui'
import type { FC } from 'react'

import MinicartDelete from '../Delete'
import MinicartQuantity from '../Quantity'
import type { Product } from '../../../../sdk/product/useAvailability'

export interface ItemsProps {
  items: Product[]
  variant: string
  imageElement: React.ElementType
  formats: { format: (value: number) => string; formatMessage: any }
}

export interface ItemProps {
  item: Product
  variant: string
  formats: { format: (value: number) => string; formatMessage: any }
}

export const freeVariant = (price: Maybe<number>) =>
  price === 0 ? '.free' : ''

export const ItemInfo: FC<ItemProps> = ({
  item: { product, index },
  variant,
  formats: { format, formatMessage },
}) => (
  <>
    <Flex>
      <Text variant={`${variant}.product.name.text`}>{product.name}</Text>
      <MinicartDelete index={index} variant={variant} />
    </Flex>
    <MinicartQuantity
      index={index}
      isDisabled={
        product.sellingPrice === 0 || product.availability !== 'available'
      }
      variant={`${variant}${freeVariant(product.sellingPrice)}`}
    />
    <Text
      variant={`${variant}.product.name.value${freeVariant(
        product.sellingPrice
      )}`}
    >
      {product.sellingPrice === 0
        ? formatMessage({ id: 'minicart.price.free' })
        : format(Number(product.sellingPrice) / 100)}
    </Text>
  </>
)
