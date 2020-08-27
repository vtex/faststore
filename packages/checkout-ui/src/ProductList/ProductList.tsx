import { Box } from '@vtex/store-ui'
import React, { Fragment } from 'react'

import { ItemContextProvider } from './ItemContext'
import { AVAILABLE } from './constants/Availability'

interface Props {
  items: any[]
  loading: boolean
  onQuantityChange: (uniqueId: string, value: number, item?: any) => void
  onRemove: (uniqueId: string, item?: any) => void
}

export const ProductList: React.FC<Props> = ({
  items,
  loading,
  onQuantityChange,
  onRemove,
  children,
}) => {
  const [availableItems, unavailableItems] = items.reduce(
    (acc: any, item) => {
      acc[item.availability === AVAILABLE ? 0 : 1].push(item)

      return acc
    },
    [[], []]
  )

  const productList = (itemList: any) =>
    itemList.map((item: any) => (
      <ItemContextProvider
        key={item.uniqueId}
        value={{
          item,
          loading,
          onQuantityChange: (value: number) =>
            onQuantityChange(item.uniqueId, value, item),
          onRemove: () => onRemove(item.uniqueId, item),
        }}
      >
        <Box
          pt="1.5rem"
          pb={4}
          sx={{ borderBottom: '1px solid', borderColor: 'muted' }}
        >
          {children}
        </Box>
      </ItemContextProvider>
    ))

  return (
    <Fragment>
      {unavailableItems.length > 0 ? (
        <Box
          id="unavailable-items"
          py={3}
          sx={{
            color: 'muted1',
            borderColor: 'muted4',
            borderBottom: '1px solid',
            fontWeight: 500,
            paddingLeft: '1rem',
            fontSize: '1.25rem',
            '@media screen and (min-width: 40em)': {
              paddingLeft: '1.5rem',
            },
            '@media screen and (min-width: 64em)': {
              paddingLeft: 0,
            },
          }}
        >
          {unavailableItems.length} unavailable products
        </Box>
      ) : null}
      {productList(unavailableItems)}
      {unavailableItems.length > 0 && availableItems.length > 0 ? (
        <Box
          py={3}
          sx={{
            marginTop: '2rem',
            color: 'muted1',
            borderColor: 'muted4',
            borderBottom: '1px solid',
            fontWeight: 500,
            paddingLeft: '1rem',
            fontSize: '1.25rem',
            '@media screen and (min-width: 40em)': {
              paddingLeft: '1.5rem',
            },
            '@media screen and (min-width: 64em)': {
              paddingLeft: 0,
            },
          }}
        >
          {availableItems.length} available products
        </Box>
      ) : null}
      {productList(availableItems)}
    </Fragment>
  )
}
