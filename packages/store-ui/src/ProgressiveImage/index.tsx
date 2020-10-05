import { createElement, ElementType, memo, useEffect, useState } from 'react'
import { AspectImageProps, ImageProps } from 'theme-ui'

export interface ProgressiveImageProps extends ImageProps, AspectImageProps {
  src: string
  placeholder: string
  as?: ElementType
}

const ProgressiveImage = memo<ProgressiveImageProps>(
  ({ src, placeholder, as = 'img', ...props }) => {
    const [currentSrc, updateSrc] = useState(placeholder)

    useEffect(() => {
      const imageToLoad = new Image()

      imageToLoad.src = src
      imageToLoad.onload = () => {
        updateSrc(src)
      }
    }, [src])

    const elementProps = {
      ...props,
      src: currentSrc,
    }

    return createElement(as, elementProps)
  }
)

ProgressiveImage.displayName = 'ProgressiveImage'

export default ProgressiveImage
