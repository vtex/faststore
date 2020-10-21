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
      images.map(({ imageUrl, imageText }) => {
        const src = imageUrl ?? IMAGE_DEFAULT

        const url = scaleFileManagerImage(
          src,
          DETAILS_IMAGE_WIDTH,
          DETAILS_IMAGE_HEIGHT
        )

        const placeholder = state?.fromSummary
          ? scaleFileManagerImage(
              src,
              SUMMARY_IMAGE_WIDTH,
              SUMMARY_IMAGE_HEIGHT
            )
          : url

        console.log({ placeholder, url, state })

        return {
          props: {
            src: url,
            alt: imageText,
            loading: 'eager' as Loading,
            width: DETAILS_IMAGE_WIDTH_STR,
            height: DETAILS_IMAGE_HEIGHT_STR,
          },
          propsPlaceholder: {
            src: placeholder,
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
