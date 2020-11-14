import { useMemo } from 'react'

interface Video {
  videoUrl: string
}

export const useDetailsVideos = (videos: Video[], productName: string) =>
  useMemo(
    () =>
      videos.map(({ videoUrl }) => ({
        type: ('video' as unknown) as 'video',
        props: { src: videoUrl, title: productName },
      })),
    [videos, productName]
  )
