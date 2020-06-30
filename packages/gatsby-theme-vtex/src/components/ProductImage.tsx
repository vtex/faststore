import { Product } from '@vtex/gatsby-source-vtex'
import React, { FC } from 'react'
import { AspectImage } from 'theme-ui'
import { useInView } from 'react-intersection-observer'

import { IMAGE_DEFAULT, scaleImage } from '../utils/img'

interface Props {
  width: number
  height: number
  product: Product
  lazyLoad?: boolean
}

const ProductImage: FC<Props> = ({
  width,
  height,
  product,
  lazyLoad = true,
}) => {
  const [ref, inView] = useInView({
    rootMargin: '50px',
    triggerOnce: true,
  })
  const image = product.items?.[0]?.images?.[0]
  const imageAlt = image ? image.imageText : 'Product Image'
  const imageUrl = image
    ? scaleImage(image.imageUrl, width, height)
    : IMAGE_DEFAULT

  return (
    <AspectImage
      ref={ref}
      ratio={1}
      src={!inView && lazyLoad ? '' : imageUrl}
      alt={imageAlt}
      width={`${width}px`}
      height={`${height}px`}
    />
  )
}

export default ProductImage
