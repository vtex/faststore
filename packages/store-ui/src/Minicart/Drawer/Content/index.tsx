import React, { useMemo } from 'react'
import { Box, Flex, Text } from 'theme-ui'
import { FormattedMessage } from 'react-intl'
import type { PropsWithChildren } from 'react'

import MinicartDrawerRemove from './Remove'
import MinicartDrawerImage from './Image'
import MinicartDrawerQuantity from './Quantity'
import type { Item } from '../../types'

export interface Props<T> {
  items: T[]
  variant: string
  removeItem: (item: T) => Promise<void> | void
  updateItem: (item: T) => Promise<void> | void
  numberFormat: (num: number) => string
}

const useCartSections = <T extends Item>(items: T[]) =>
  useMemo(
    () =>
      items.reduce(
        (acc, curr) => {
          if (curr.sellingPrice === 0) {
            acc.gifts.push(curr)
          } else {
            acc.products.push(curr)
          }

          return acc
        },
        { gifts: [] as T[], products: [] as T[] }
      ),
    [items]
  )

const MinicartDrawerContent = <T extends Item>({
  items,
  variant: v,
  removeItem,
  updateItem,
  numberFormat,
}: PropsWithChildren<Props<T>>) => {
  const { gifts, products } = useCartSections(items)
  const variant = `${v}.content`

  return (
    <Flex variant={variant}>
      <Box variant={`${variant}.section`}>
        <FormattedMessage id="minicart.drawer.section.products" />
      </Box>
      {products.map((item) => (
        <Flex key={item.id} variant={`${variant}.product`}>
          <MinicartDrawerImage
            width="192px"
            height="192px"
            src={item.imageUrls?.at2x}
            alt={item.name!}
            variant={`${variant}.product.image`}
          />
          <Flex variant={`${variant}.product.name`}>
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
              variant={variant}
            />
            <Text variant={`${variant}.product.name.value`}>
              {numberFormat(Number(item.sellingPrice) / 100)}
            </Text>
          </Flex>
        </Flex>
      ))}
      {gifts.length > 0 && (
        <Box variant={`${variant}.section`}>
          <FormattedMessage id="minicart.drawer.section.gifts" />
        </Box>
      )}
      {gifts.map((item) => (
        <Flex key={item.id} variant={`${variant}.product`}>
          <MinicartDrawerImage
            width="192px"
            height="192px"
            src={item.imageUrls?.at2x}
            alt={item.name!}
            variant={`${variant}.product.image`}
          />
          <Flex variant={`${variant}.product.name`}>
            <Flex>
              <Text variant={`${variant}.product.name.text`}>{item.name}</Text>
            </Flex>
          </Flex>
        </Flex>
      ))}
    </Flex>
  )
}

export default MinicartDrawerContent
