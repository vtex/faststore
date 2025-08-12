import storeConfig from '../../../../discovery.config'
import type { ImageLoaderProps } from 'next/image'
const THUMBOR_SERVER = `https://${storeConfig.api.storeId}.vtexassets.com`

export default function customImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps) {
  return storeConfig.experimental.enableVtexAssetsLoader
    ? fileServerLoader({ src, width })
    : thumborLoader({ src, width, quality })
}

function thumborLoader({ src, width, quality }: ImageLoaderProps) {
  const preSizeComponents = [THUMBOR_SERVER, 'unsafe']

  // proportional to the width, enter a height of 0,
  const height = 0
  const finalSize = `${width}x${height}`

  const postSizeComponents: string[] = ['center', 'middle']
  quality && postSizeComponents.push(`filters:quality(${quality || 80})`)
  postSizeComponents.push(encodeURIComponent(src))

  return [...preSizeComponents, finalSize, ...postSizeComponents].join('/')
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
