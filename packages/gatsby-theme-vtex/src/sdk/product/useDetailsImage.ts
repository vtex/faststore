import { useLocation } from '@reach/router'
import { useMemo } from 'react'

import { scaleFileManagerImage } from '../img/fileManager'
import { DETAILS_IMAGE, IMAGE_DEFAULT, SUMMARY_IMAGE } from './constants'

interface Image {
  imageUrl: string
  imageText: string
}

type Loading = 'lazy' | 'eager'

const DEFAULT_IMAGES = [
  {
    imageUrl: IMAGE_DEFAULT,
    imageText: 'Product Image',
  },
]

const lastImage = DETAILS_IMAGE.length - 1

export const useDetailsImage = (maybeImages: Image[] | undefined) => {
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

        const sizes = DETAILS_IMAGE.map(({ media }) => media).join(', ')

        const srcSetPlaceholder = useSummary
          ? scaleFileManagerImage(
              src,
              SUMMARY_IMAGE.width,
              SUMMARY_IMAGE.height
            )
          : srcSet

        const sizesPlaceholder = useSummary ? '(minWidth: 0px) 0px' : sizes

        return {
          props: {
            sizes,
            srcSet,
            src: imageUrl,
            key: srcSet,
            alt: imageText,
            loading: 'eager' as Loading,
            width: DETAILS_IMAGE[lastImage].widthStr,
            height: DETAILS_IMAGE[lastImage].heightStr,
          },
          propsPlaceholder: {
            sizes: sizesPlaceholder,
            srcSet: srcSetPlaceholder,
            src: imageUrl,
            key: srcSetPlaceholder,
            alt: imageText,
            loading: 'eager' as Loading,
            width: DETAILS_IMAGE[lastImage].widthStr,
            height: DETAILS_IMAGE[lastImage].heightStr,
          },
        }
      }),
    [images]
  )
}
