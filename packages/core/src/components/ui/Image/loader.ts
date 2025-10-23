import type { ImageLoaderProps } from 'next/image'

export default function customImageLoader({ src, width }: ImageLoaderProps) {
  if (src.includes('vtex.file-manager-graphql')) {
    const url = new URL(src)
    url.searchParams.set('width', width.toString())
    url.searchParams.set('aspect', 'true')
    return url.toString()
  }
  // Regular expression to match the pattern: /ids/{number}/{filename}.{extension}?{queryParams}
  const regex = /(\/ids\/\d+)\/([^/?]+)(\.[^/?]+)(\?.+)?$/

  return src.replace(
    regex,
    (_match, idPart, filename, _extension, queryString = '') => {
      return `${idPart}-${width}-auto/${filename}.webp${queryString}`
    }
  )
}
