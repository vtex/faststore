import React, { FC } from 'react'
import { Text, Box } from '@vtex/store-ui'

import { useItemContext } from './ItemContext'
import { opaque } from './utils/opaque'
import { TextAlignProp } from './utils/textAlign'
import { FormattedPrice } from '../FormattedPrice/FormattedPrice'
import { FormattedCurrency } from '../FormattedCurrency/FormattedCurrency'

type PriceProps = TextAlignProp & {
  showListPrice?: boolean
}

export const ProductItemPrice: FC<PriceProps> = ({
  textAlign = 'left',
  showListPrice = true,
}) => {
  const { item, loading } = useItemContext()

  if (loading) {
    return <>loading...</>
  }

  return (
    <Box
      sx={{
        textAlign,
        ...opaque(item.availability),
        '@media screen and (min-width: 40em)': {
          width: '7.25rem',
        },
      }}
    >
      {item.listPrice && item.listPrice !== item.price && showListPrice && (
        <Text
          id={`list-price-${item.id}`}
          sx={{
            color: '#727273',
            textDecoration: 'line-through',
            marginBottom: '.25rem',
            fontWeight: 400,
            fontSize: 0,
          }}
        >
          <FormattedCurrency
            value={
              (item.listPrice * (item.unitMultiplier || 1) * item.quantity) /
              100
            }
          />
        </Text>
      )}
      <Text
        id={`price-${item.id}`}
        sx={{
          fontWeight: 600,
          '@media screen and (min-width: 40em)': {
            fontWeight: 500,
          },
        }}
      >
        <FormattedPrice
          value={
            item.sellingPrice != null
              ? (item.sellingPrice * item.quantity) / 100
              : item.sellingPrice
          }
        />
      </Text>
    </Box>
  )
}
