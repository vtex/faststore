import React, { FunctionComponent } from 'react'
import { Box } from '@vtex/store-ui'

import { useItemContext } from './ItemContext'
import { opaque } from './utils/opaque'

export const ProductBrand: FunctionComponent = () => {
  const { item, loading } = useItemContext()

  if (loading) {
    return <>loading...</>
  }

  return (
    <Box
      id={`brand-name-${item.id}`}
      sx={{
        ...opaque(item.availability),
        textTransform: 'uppercase',
        fontSize: '.75rem',
        color: '#727273',
        fontWeight: 600,
        '@media screen and (min-width: 40em)': {
          fontWeight: 500,
        },
      }}
    >
      {item.additionalInfo?.brandName}
    </Box>
  )
}
