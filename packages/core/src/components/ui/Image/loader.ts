import type { ImageLoaderProps } from 'next/image'

export default function customImageLoader({ src, width }: ImageLoaderProps) {
  return fileServerLoader({ src, width })
}

function fileServerLoader({ src, width }: ImageLoaderProps) {
  // Regular expression to match the pattern: /ids/{number}/{filename}.{extension}?{queryParams}
  const regex = /(\/ids\/\d+)\/([^/?]+)(\.[^/?]+)(\?.+)?$/

  return src.replace(
    regex,
    (_match, idPart, filename, _extension, queryString = '') => {
      return `${idPart}-${width}-auto/${filename}.webp${queryString}`
    }
  )
}
