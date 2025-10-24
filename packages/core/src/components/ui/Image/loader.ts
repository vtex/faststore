import type { ImageLoaderProps } from 'next/image'

/**
 * Image loader that handles VTEX-specific URLs with custom logic
 * and falls back to Next.js default behavior for other images
 */
export default function customImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps) {
  const customQuality = quality
    ? quality > 10
      ? Math.ceil(quality / 10)
      : quality
    : 8
  if (src.includes('vtex.file-manager-graphql')) {
    const url = new URL(src)
    url.searchParams.set('width', width.toString())
    url.searchParams.set('aspect', 'true')
    url.searchParams.set('quality', customQuality.toString())
    return url.toString()
  }

  // Regular expression to match the pattern: /ids/{number}/{filename}.{extension}?{queryParams}
  const regex = /(\/ids\/\d+)\/([^/?]+)(\.[^/?]+)(\?.+)?$/
  if (regex.test(src)) {
    return src.replace(
      regex,
      (_match, idPart, filename, _extension, queryString = '?') => {
        return `${idPart}-${width}-auto/${filename}.webp${queryString}&quality=${customQuality}`
      }
    )
  }

  try {
    new URL(src)
    const params = new URLSearchParams()
    params.set('url', src)
    params.set('w', width.toString())
    if (quality) {
      params.set('q', quality.toString())
    }

    return `/_next/image?${params.toString()}`
  } catch {
    // If URL parsing fails, it's a local path (/logo.svg) or an invalid URL
    return src
  }
}
