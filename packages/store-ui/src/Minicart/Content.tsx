import React, { FC } from 'react'
import { Box, Flex, Text } from 'theme-ui'

export interface DataItem {
  id: string | number
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
  currency: string
  imageElement: React.ElementType
}

export const MinicartContent: FC<MinicartContentProps> = ({
  data,
  variant,
  currency,
  imageElement,
}) => {
  const customVariant = `${variant}.content`
  const imageProps = (item: DataItem) => ({
    as: imageElement,
    width: 96,
    height: 96,
    src: item.image.src,
    alt: item.image.alt,
    loading: 'lazy',
  })

  return (
    <Flex variant={customVariant}>
      {data.map((item) => (
        <Flex key={item.id} variant={`${customVariant}.product`}>
          <Box variant={`${customVariant}.product.image`}>
            <Box {...imageProps(item)} />
          </Box>
          <Flex variant={`${customVariant}.product.name`}>
            <Text variant={`${customVariant}.product.name.text`}>
              {item.name}
            </Text>
            <Text variant={`${customVariant}.product.name.value`}>
              {`${currency} ${item.price}`}
            </Text>
          </Flex>
        </Flex>
      ))}
    </Flex>
  )
}
