import { useLocation } from '@reach/router'
import { useMemo } from 'react'

import { scaleFileManagerImage } from '../img/fileManager'
import { DETAILS_IMAGE, IMAGE_DEFAULT, SUMMARY_IMAGE } from './constants'

interface Image {
  imageUrl: string
  imageText: string
}

const DEFAULT_IMAGES = [
  {
    imageUrl: IMAGE_DEFAULT,
    imageText: 'Product Image',
  },
]

const maxWidth = DETAILS_IMAGE[DETAILS_IMAGE.length - 1].widthStr
const maxHeight = DETAILS_IMAGE[DETAILS_IMAGE.length - 1].heightStr
const sizes = DETAILS_IMAGE.map(({ media }) => media).join(', ')

export const useDetailsImages = (maybeImages: Image[] | undefined) => {
  const { state }: any = useLocation()
  const images = maybeImages ?? DEFAULT_IMAGES

  return useMemo(
    () =>
      images.map(({ imageUrl, imageText }, index) => {
        const src = imageUrl ?? IMAGE_DEFAULT
        const useSummary = state?.fromSummary && index === 0

        const srcSet = DETAILS_IMAGE.map(
          ({ width, height }) =>
            `${scaleFileManagerImage(src, width, height)} ${width}w`
        ).join(', ')

        const srcSetPlaceholder = useSummary
          ? scaleFileManagerImage(
              src,
              SUMMARY_IMAGE.width,
              SUMMARY_IMAGE.height
            )
          : srcSet

        const sizesPlaceholder = useSummary ? '(minWidth: 0px) 100vw' : sizes

        return {
          type: ('image' as unknown) as 'image',
          props: {
            targetProps: {
              sizes,
              srcSet,
            },
            placeholderProps: {
              sizes: sizesPlaceholder,
              srcSet: srcSetPlaceholder,
            },
            src: imageUrl,
            alt: imageText,
            loading: ('eager' as unknown) as 'eager',
            width: maxWidth,
            height: maxHeight,
          },
        }
      }),
    [images, state.fromSummary]
  )
}
