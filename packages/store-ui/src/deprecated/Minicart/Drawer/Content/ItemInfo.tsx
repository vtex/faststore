import React from 'react'
import { Flex, Text } from 'theme-ui'

import MinicartDrawerRemove from './Remove'
import MinicartDrawerQuantity from './Quantity'
import type { Item } from '../../types'

interface Props<T> {
  item: T
  variant: string
  removeItem: (item: T) => Promise<void> | void
  updateItem: (item: T) => Promise<void> | void
  numberFormat: (num: number) => string
  formatMessage: (obj: { id: string }) => string
}

export const freeVariant = (price: number) => (price === 0 ? '.free' : '')

export const ItemInfo = <T extends Item>({
  item,
  variant,
  numberFormat,
  formatMessage,
  removeItem,
  updateItem,
}: Props<T>) => (
  <>
    <Flex>
      <Text variant={`${variant}.product.name.text`}>{item.name}</Text>
      <MinicartDrawerRemove
        item={item}
        variant={variant}
        removeItem={removeItem}
      />
    </Flex>
    <MinicartDrawerQuantity
      updateItem={updateItem}
      item={item}
      variant={`${variant}${freeVariant(item.sellingPrice)}`}
      disabled={item.sellingPrice === 0 || item.availability !== 'available'}
    />
    <Text
      variant={`${variant}.product.name.value${freeVariant(item.sellingPrice)}`}
    >
      {item.sellingPrice === 0
        ? formatMessage({ id: 'minicart.price.free' })
        : numberFormat(Number(item.sellingPrice) / 100)}
    </Text>
  </>
)
