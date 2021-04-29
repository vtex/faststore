import React from 'react'
import type { PropsWithChildren } from 'react'
import { Flex, Box } from 'theme-ui'

import { ItemInfo } from './ItemInfo'
import MinicartDrawerImage from './Image'
import type { Item } from '../../types'
import type { Props } from '.'

export const Items = <T extends Item>({
  children,
  items,
  variant,
  numberFormat,
  formatMessage,
  removeItem,
  updateItem,
}: PropsWithChildren<Props<T>> & {
  formatMessage: (obj: { id: string }) => string
}) => (
  <Box>
    {items.map((item) => (
      <Flex key={item.id} variant={`${variant}.product`}>
        <MinicartDrawerImage
          width="192px"
          height="192px"
          src={item.imageUrls?.at2x}
          alt={item.name!}
          variant={`${variant}.product.image`}
        />
        <Flex variant={`${variant}.product.name`}>
          <ItemInfo
            item={item}
            variant={variant}
            numberFormat={numberFormat}
            formatMessage={formatMessage}
            removeItem={removeItem}
            updateItem={updateItem}
          />
          {children}
        </Flex>
      </Flex>
    ))}
  </Box>
)
