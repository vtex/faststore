import React, { FC } from 'react'
import { Box, Flex } from 'theme-ui'

interface ProductSpecificationProps {
  variant?: string
  values: Array<{
    title: string
    value: string
  }>
}

export const ProductSpecification: FC<ProductSpecificationProps> = ({
  variant = 'productSpecification',
  values,
}) => (
  <Flex variant={variant}>
    {values.map((item) => (
      <Flex variant={`${variant}.item`} key={item.title}>
        <Box variant={`${variant}.title`}>{item.title}</Box>
        <Box variant={`${variant}.value`}>{item.value}</Box>
      </Flex>
    ))}
  </Flex>
)
