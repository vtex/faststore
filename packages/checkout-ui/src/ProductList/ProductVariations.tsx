import React, { FC } from 'react'
import { Box } from '@vtex/store-ui'

import { useItemContext } from './ItemContext'
import { opaque } from './utils/opaque'

export const ProductVariations: FC = () => {
  const { item } = useItemContext()

  return item.skuSpecifications && item.skuSpecifications.length > 0 ? (
    <Box
      sx={{
        ...opaque(item.availability),
        color: 'muted1',
        lineHeight: 'copy',
        fontSize: 0,
      }}
    >
      {item.skuSpecifications.map((spec: any) => {
        return (
          <div
            id={`specification-${item.id}-${spec.fieldName}`}
            key={spec.fieldName || undefined}
          >
            {`${spec.fieldName}: ${spec.fieldValues.join(', ')}`}
          </div>
        )
      })}
    </Box>
  ) : null
}
