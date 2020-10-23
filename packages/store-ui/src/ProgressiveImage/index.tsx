import React, { FC, useEffect, useState, PropsWithoutRef } from 'react'
import { AspectImageProps, ImageProps } from 'theme-ui'

type ImageLikeProps = PropsWithoutRef<AspectImageProps> &
  PropsWithoutRef<ImageProps>

type ImageLike = FC<ImageLikeProps>

interface Props extends ImageLikeProps {
  targetProps: ImageLikeProps
  placeholderProps: ImageLikeProps
  as?: ImageLike
}

const ProgressiveImage: FC<Props> = ({
  targetProps,
  placeholderProps,
  as: Component = 'img',
  ...commonProps
}) => {
  const [current, setCurrent] = useState(placeholderProps)

  useEffect(() => setCurrent(placeholderProps), [placeholderProps])

  useEffect(() => {
    const imageToLoad = new Image()

    imageToLoad.onload = () => setCurrent(targetProps)

    // This order is important. Do NOT change it. Safari requires sizes to
    // be set before than srcSet
    const keys: Array<keyof ImageLikeProps> = ['sizes', 'srcSet', 'src']

    for (const key of keys) {
      if (key in targetProps) {
        imageToLoad.setAttribute(key.toLowerCase(), targetProps[key])
      }
    }
  }, [targetProps])

  return <Component {...commonProps} {...current} />
}

export default ProgressiveImage
