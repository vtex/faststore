import React, { FunctionComponent } from 'react'
import { Box, Image } from '@vtex/store-ui'

import { useItemContext } from './ItemContext'
import { NoImageIcon } from './NoImageIcon'
import { opaque } from './utils/opaque'

interface ImageUrls {
  at1x: string
  at2x: string
  at3x: string
}

const getImageUrl = (imageUrls: ImageUrls) => {
  if (!imageUrls) {
    return null
  }

  if (!window || !window.devicePixelRatio) {
    return imageUrls.at1x
  }

  if (window.devicePixelRatio <= 1.25) {
    return imageUrls.at1x
  }

  if (window.devicePixelRatio <= 2.25) {
    return imageUrls.at2x
  }

  return imageUrls.at3x
}

interface ImageProps {
  width?: number
}

export const ProductItemImage: FunctionComponent<ImageProps> = ({
  width = 96,
}) => {
  const { item, loading } = useItemContext()

  if (loading) {
    return <>loading..</>
  }

  const imageUrl = getImageUrl(item.imageUrls)

  return (
    <Box
      id={`image-${item.id}`}
      sx={opaque(item.availability)}
      style={{ width }}
    >
      <a href={item.detailUrl || undefined}>
        {imageUrl ? (
          <Image
            sx={{ borderRadius: '.75rem' }}
            alt={item.name || undefined}
            src={imageUrl}
            width="100%"
          />
        ) : (
          <NoImageIcon />
        )}
      </a>
    </Box>
  )
}
