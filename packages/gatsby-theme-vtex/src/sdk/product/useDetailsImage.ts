import { useLocation } from '@reach/router'
import { useMemo } from 'react'

import { scaleFileManagerImage } from '../img/fileManager'
import {
  DETAILS_IMAGE,
  DETAILS_IMAGES_HEIGHTS,
  IMAGE_DEFAULT,
  SUMMARY_IMAGE,
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

        const sources = DETAILS_IMAGE.map(({ width, height, media }) => ({
          srcSet: `${scaleFileManagerImage(src, width, height)} ${width}w`,
          media,
        }))

        const placeholder = useSummary
          ? [
              {
                srcSet: scaleFileManagerImage(
                  src,
                  SUMMARY_IMAGE.width,
                  SUMMARY_IMAGE.height
                ),
                media: '(min-width: 0px)',
              },
            ]
          : sources

        return {
          props: {
            sources,
            src: imageUrl,
            key: sources[0].srcSet,
            alt: imageText,
            loading: 'eager' as Loading,
            width: DETAILS_IMAGE[1].widthStr,
            height: DETAILS_IMAGE[1].heightStr,
            heights: DETAILS_IMAGES_HEIGHTS,
          },
          propsPlaceholder: {
            sources: placeholder,
            src: imageUrl,
            key: placeholder[0].srcSet,
            alt: imageText,
            loading: 'eager' as Loading,
            width: DETAILS_IMAGE[1].widthStr,
            height: DETAILS_IMAGE[1].heightStr,
            heights: DETAILS_IMAGES_HEIGHTS,
          },
        }
      }),
    [images]
  )
}
