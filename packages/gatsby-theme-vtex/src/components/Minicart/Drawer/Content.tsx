import React, { FC } from 'react'
import { Box, Flex, Text } from 'theme-ui'

import { useNumberFormat } from '../../../sdk/localization/useNumberFormat'
import MinicartDelete from './Delete'
import MinicartQuantity from './Quantity'

export interface DataItem {
  id: number
  image: {
    alt: string
    src: string
  }
  name: string
  price: string | number
}

export interface MinicartContentProps {
  data: DataItem[]
  variant: string
  imageElement: React.ElementType
}

export const HeaderMinicartDrawerContent: FC<MinicartContentProps> = ({
  data,
  variant,
  imageElement,
}) => {
  const customVariant = `${variant}.content`
  const imageProps = (item: DataItem) => ({
    as: imageElement,
    width: 200,
    height: 200,
    src: item.image.src,
    alt: item.image.alt,
    loading: 'lazy',
  })

  const { format } = useNumberFormat()

  return (
    <Flex variant={customVariant}>
      {data.map((item, idx) => (
        <Flex key={item.id} variant={`${customVariant}.product`}>
          <Box variant={`${customVariant}.product.image`}>
            <Box {...imageProps(item)} />
          </Box>
          <Flex variant={`${customVariant}.product.name`}>
            <Flex>
              <Text variant={`${customVariant}.product.name.text`}>
                {item.name}
              </Text>
              <MinicartDelete index={idx} variant={customVariant} />
            </Flex>
            <MinicartQuantity index={idx} variant={customVariant} />
            <Text variant={`${customVariant}.product.name.value`}>
              {format(Number(item.price) / 100)}
            </Text>
          </Flex>
        </Flex>
      ))}
    </Flex>
  )
}
