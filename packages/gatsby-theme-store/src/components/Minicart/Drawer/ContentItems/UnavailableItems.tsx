import React from 'react'
import { Flex, Text, Box } from 'theme-ui'
import type { FC } from 'react'

import { HeaderMinicartDrawerContentImage } from '../Image'
import { IMAGE_DEFAULT } from '../../../../sdk/product/constants'
import type { Product } from '../../../../sdk/product/useAvailability'
import type { ItemsProps } from './Item'
import { ItemInfo } from './Item'

export const UnavailableItems: FC<ItemsProps> = ({
  items,
  variant,
  imageElement,
  formats,
}) => (
  <Box>
    {items.map(({ product, index }: Product) => (
      <Flex key={product.id} variant={`${variant}.product`}>
        <HeaderMinicartDrawerContentImage
          as={imageElement}
          src={product.imageUrls?.at2x ?? IMAGE_DEFAULT}
          alt={product.name!}
          variant={`${variant}.product.image`}
        />
        <Flex variant={`${variant}.product.name`}>
          <ItemInfo
            item={{ product, index }}
            variant={variant}
            formats={formats}
          />
          <Flex variant={`${variant}.product.availabilityContainer`}>
            <Text variant={`${variant}.product.availabilityContainer.message`}>
              {formats.formatMessage({ id: 'minicart.warning.unavailable' })}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    ))}
  </Box>
)
