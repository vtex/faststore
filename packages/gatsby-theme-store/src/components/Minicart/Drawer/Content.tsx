import React from 'react'
import { Flex, Text } from 'theme-ui'
import type { FC } from 'react'

import { useNumberFormat } from '../../../sdk/localization/useNumberFormat'
import MinicartDelete from './Delete'
import { HeaderMinicartDrawerContentImage } from './Image'
import MinicartQuantity from './Quantity'
import type { OrderFormContext } from '../../../sdk/orderForm/Provider'
import { IMAGE_DEFAULT } from '../../../sdk/product/constants'

export interface MinicartContentProps {
  data: NonNullable<OrderFormContext['value']>['items']
  variant: string
  imageElement: React.ElementType
}

export const HeaderMinicartDrawerContent: FC<MinicartContentProps> = ({
  data,
  variant: v,
  imageElement,
}) => {
  const { format } = useNumberFormat()
  const variant = `${v}.content`

  return (
    <Flex variant={variant}>
      {data.map((item, idx) => (
        <Flex key={item.id} variant={`${variant}.product`}>
          <HeaderMinicartDrawerContentImage
            as={imageElement}
            src={item.imageUrls?.at2x ?? IMAGE_DEFAULT}
            alt={item.name!}
            variant={`${variant}.product.image`}
          />
          <Flex variant={`${variant}.product.name`}>
            <Flex>
              <Text variant={`${variant}.product.name.text`}>{item.name}</Text>
              <MinicartDelete index={idx} variant={variant} />
            </Flex>
            <MinicartQuantity index={idx} variant={variant} />
            <Text variant={`${variant}.product.name.value`}>
              {format(Number(item.sellingPrice) / 100)}
            </Text>
          </Flex>
        </Flex>
      ))}
    </Flex>
  )
}
