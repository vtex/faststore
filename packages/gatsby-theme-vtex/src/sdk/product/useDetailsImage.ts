import { useLocation } from '@reach/router'
import { useMemo } from 'react'

import { scaleFileManagerImage } from '../img/fileManager'
import {
  DETAILS_IMAGE_HEIGHT,
  DETAILS_IMAGE_HEIGHT_STR,
  DETAILS_IMAGE_WIDTH,
  DETAILS_IMAGE_WIDTH_STR,
  IMAGE_DEFAULT,
  SUMMARY_IMAGE_HEIGHT,
  SUMMARY_IMAGE_WIDTH,
} from './constants'

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

export const useDetailsImage = (maybeImages: Image[] | undefined) => {
  const { state }: any = useLocation()
  const images = maybeImages ?? DEFAULT_IMAGES

  return useMemo(
    () =>
      images.map(({ imageUrl, imageText }, index) => {
        const src = imageUrl ?? IMAGE_DEFAULT
        const useSummary = state?.fromSummary && index === 0

        const url = scaleFileManagerImage(
          src,
          DETAILS_IMAGE_WIDTH,
          DETAILS_IMAGE_HEIGHT
        )

        const placeholder = useSummary
          ? scaleFileManagerImage(
              src,
              SUMMARY_IMAGE_WIDTH,
              SUMMARY_IMAGE_HEIGHT
            )
          : url

        return {
          props: {
            src: url,
            key: url,
            alt: imageText,
            loading: 'eager' as Loading,
            width: DETAILS_IMAGE_WIDTH_STR,
            height: DETAILS_IMAGE_HEIGHT_STR,
          },
          propsPlaceholder: {
            src: placeholder,
            key: placeholder,
            alt: imageText,
            loading: 'eager' as Loading,
            width: DETAILS_IMAGE_WIDTH_STR,
            height: DETAILS_IMAGE_HEIGHT_STR,
          },
        }
      }),
    [images]
  )
}
