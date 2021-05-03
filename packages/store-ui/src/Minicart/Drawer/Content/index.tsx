import React, { useMemo } from 'react'
import { Box, Flex, Text } from 'theme-ui'
import { FormattedMessage, useIntl } from '@vtex/gatsby-plugin-i18n'
import type { PropsWithChildren } from 'react'

import type { Item } from '../../types'
import { Items } from './Items'

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
          if (curr.availability === 'available') {
            if (curr.isGift) {
              acc.gifts.push(curr)
            } else {
              acc.products.push(curr)
            }
          } else {
            acc.unavailable.push(curr)
          }

          return acc
        },
        { gifts: [] as T[], products: [] as T[], unavailable: [] as T[] }
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
  const { formatMessage } = useIntl()
  const { gifts, products, unavailable } = useCartSections(items)
  const variant = `${v}.content`

  return (
    <Flex variant={variant}>
      <Box variant={`${variant}.section`}>
        <FormattedMessage id="minicart.drawer.section.products" />
      </Box>
      {unavailable.length > 0 && (
        <Items
          items={unavailable}
          variant={variant}
          numberFormat={numberFormat}
          formatMessage={formatMessage}
          removeItem={removeItem}
          updateItem={updateItem}
        >
          <Flex variant={`${variant}.product.availabilityContainer`}>
            <Text variant={`${variant}.product.availabilityContainer.message`}>
              {formatMessage({ id: 'minicart.warning.unavailable' })}
            </Text>
          </Flex>
        </Items>
      )}
      {unavailable.length > 0 && products.length > 0 && (
        <Box variant={`${variant}.section`}>
          {formatMessage(
            { id: 'minicart.section.available' },
            { count: products.length }
          )}
        </Box>
      )}
      {products.length > 0 && (
        <Items
          items={products}
          variant={variant}
          numberFormat={numberFormat}
          formatMessage={formatMessage}
          removeItem={removeItem}
          updateItem={updateItem}
        />
      )}
      {gifts.length > 0 && (
        <>
          <Box variant={`${variant}.section`}>
            <FormattedMessage id="minicart.drawer.section.gifts" />
          </Box>
          <Items
            items={gifts}
            variant={variant}
            numberFormat={numberFormat}
            formatMessage={formatMessage}
            removeItem={removeItem}
            updateItem={updateItem}
          />
        </>
      )}
    </Flex>
  )
}

export default MinicartDrawerContent
