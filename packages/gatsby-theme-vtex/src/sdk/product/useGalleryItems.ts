import { ComponentPropsWithoutRef, useMemo } from 'react'
import { ProgressiveImage } from '@vtex/store-ui'

import { Item } from '../../components/ProductImageGallery/Page'

type Video = {
  videoUrl: string
}

type Image = ComponentPropsWithoutRef<typeof ProgressiveImage>

export const useGalleryItems = (images: Image[], videos: Video[], productName: string): Item[] =>
  useMemo(() => {
    const imagesMapped = images.map((props) => ({
      type: 'image',
      props,
    })) as Item[]

    const videosMapped = videos.map(({ videoUrl }) => ({
      type: 'video',
      props: { src: videoUrl, title: productName },
    })) as Item[]

    return [...imagesMapped, ...videosMapped]
  }, [images, videos])
