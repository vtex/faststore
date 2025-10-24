import type { ImageLoaderProps } from 'next/image'

function handleVtexUrls(src: string, width: number, quality?: number) {
  const customQuality = quality
    ? quality > 10
      ? Math.ceil(quality / 10)
      : quality
    : 8
  // Handle VTEX file manager URLs (CMS Images)
  if (src.includes('vtex.file-manager-graphql')) {
    const url = new URL(src)
    url.searchParams.set('width', width.toString())
    url.searchParams.set('aspect', 'true')
    url.searchParams.set('quality', customQuality.toString())
    return url.toString()
  }

  // Handle VTEX IDs pattern: /ids/{number}/{filename}.{extension}?{queryParams} (Product Images)
  const regex = /(\/ids\/\d+)\/([^/?]+)(\.[^/?]+)(\?.+)?$/
  if (regex.test(src)) {
    return src.replace(
      regex,
      (_match, idPart, filename, _extension, queryString = '') => {
        const qs = new URLSearchParams(queryString)
        qs.set('quality', customQuality.toString())
        return `${idPart}-${width}-auto/${filename}.webp?${qs.toString()}`
      }
    )
  }

  return null
}

/**
 * Global loader that handles VTEX-specific URLs with custom logic
 * and falls back to Next.js default behavior for other images
 */
export default function customImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps) {
  const vtexResult = handleVtexUrls(src, width, quality)
  if (vtexResult) {
    return vtexResult
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

/**
 * Loader used by FastStore Image component that only handles VTEX URLs
 * Returns src directly for other images (no Next.js optimization)
 */
export function faststoreLoader({ src, width, quality }: ImageLoaderProps) {
  const vtexResult = handleVtexUrls(src, width, quality)
  if (vtexResult) {
    return vtexResult
  }

  return src
}
