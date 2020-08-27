import React, { FC } from 'react'
import { Box, Flex } from '@vtex/store-ui'

import { useItemContext } from './ItemContext'
import { AVAILABLE, CANNOT_BE_DELIVERED } from './constants/Availability'

interface Props {
  layout: 'cols' | 'rows'
}

export const AvailabilityMessage: FC<Props> = ({ layout = 'cols' }) => {
  const {
    item: { availability },
    loading,
  } = useItemContext()

  if (loading) {
    return null
  }

  if (availability === AVAILABLE) {
    return null
  }

  const Component = layout === 'cols' ? Flex : Box

  return (
    <Component
      sx={{
        backgroundColor: 'warningFaded',
        borderRadius: '.25rem',
        ...(layout === 'cols'
          ? {
              justifyContent: 'space-between',
              alignItems: 'center',
            }
          : null),
      }}
    >
      <Box sx={{ padding: '.75rem', lineHeight: 'title' }}>
        {availability === CANNOT_BE_DELIVERED ? (
          <span>This product cannot be delivered to the address provided.</span>
        ) : (
          <span>This product is no longer available.</span>
        )}
      </Box>
    </Component>
  )
}
