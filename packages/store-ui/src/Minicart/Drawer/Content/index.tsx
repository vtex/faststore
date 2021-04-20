import React from 'react'
import { Flex, Text } from 'theme-ui'
import { FormattedMessage } from '@vtex/gatsby-plugin-i18n'
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

const getFreeVariant = (price: number) => (price === 0 ? '.free' : '')

const MinicartDrawerContent = <T extends Item>({
  items,
  variant: v,
  removeItem,
  updateItem,
  numberFormat,
}: PropsWithChildren<Props<T>>) => {
  const variant = `${v}.content`

  return (
    <Flex variant={variant}>
      {items.map((item) => {
        const freeVariant = getFreeVariant(item.sellingPrice)

        return (
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
                <Text variant={`${variant}.product.name.text`}>
                  {item.name}
                </Text>
                <MinicartDrawerRemove
                  item={item}
                  variant={variant}
                  removeItem={removeItem}
                />
              </Flex>
              <MinicartDrawerQuantity
                updateItem={updateItem}
                item={item}
                disabled={item.sellingPrice === 0}
                variant={`${variant}${freeVariant}`}
              />
              <Text variant={`${variant}.product.name.value${freeVariant}`}>
                {item.sellingPrice === 0 ? (
                  <FormattedMessage id="minicart.price.free" />
                ) : (
                  numberFormat(Number(item.sellingPrice) / 100)
                )}
              </Text>
            </Flex>
          </Flex>
        )
      })}
    </Flex>
  )
}

export default MinicartDrawerContent
