import { memo } from 'react'

import NextImage, { ImageProps } from 'next/image'
import { useImage } from './useImage'

function MixedImage({ src, width, height, ...otherProps }: ImageProps) {
  const imgProps = useImage({
    src: String(src),
    width: Number(width),
    height: Number(height),
    useNewThumborUrl: true,
    factor: 3,
  })

  const { src: thumborSrc } = imgProps

  return (
    <NextImage
      loader={() => thumborSrc}
      src={thumborSrc}
      data-fs-image
      width={Number(width)}
      height={Number(height)}
      {...otherProps}
      alt={imgProps.alt}
    />
  )
}

export default memo(MixedImage)
