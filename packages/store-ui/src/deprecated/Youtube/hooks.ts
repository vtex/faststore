const videoRegExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/

export const useYoutubeVideoID = (videoUrl: string) => {
  const match = videoUrl.match(videoRegExp)

  if (match && match[7].length === 11) {
    return match[7]
  }

  return null
}

interface EmbeddedProps {
  src: string
  title: string
  loop?: boolean
  autoplay?: boolean
}

export const useYoutubeEmbeddedSrc = ({
  title,
  src: videoUrl,
  loop = false,
  autoplay = false,
}: EmbeddedProps) => {
  const videoId = useYoutubeVideoID(videoUrl)

  return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay}&loop=${loop}&title=${title}&enablejsapi=1&iv_load_policy=3&modestbranding=1`
}

export const useYoutubeThumbSrc = (videoUrl: string) => {
  const videoId = useYoutubeVideoID(videoUrl)

  return `https://img.youtube.com/vi/${videoId}/default.jpg`
}
