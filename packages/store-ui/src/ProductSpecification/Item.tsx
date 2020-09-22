import React, { FC } from 'react'
import { Box, Flex } from 'theme-ui'

export interface ProductSpecificationItemProps {
  variant?: string
  data?: Array<{
    name?: string
    values?: string[]
  }>
}

export const ProductSpecificationItem: FC<ProductSpecificationItemProps> = ({
  variant = 'productSpecification',
  data,
}) => (
  <Flex variant={variant}>
    {data?.map((specification) => (
      <Flex variant={`${variant}.item`} key={specification?.name}>
        <Box variant={`${variant}.item.name`}>{specification?.name}</Box>
        {specification?.values?.map((value) => (
          <Box key={value} variant={`${variant}.item.value`}>
            <div dangerouslySetInnerHTML={{ __html: value }} />
          </Box>
        ))}
      </Flex>
    ))}
  </Flex>
)
