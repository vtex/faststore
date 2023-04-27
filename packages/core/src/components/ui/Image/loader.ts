import storeConfig from 'faststore.config'
const THUMBOR_SERVER = `https://${storeConfig.api.storeId}.vtexassets.com`

export default function customImageLoader({ src, width, quality }) {
  const preSizeComponents = [THUMBOR_SERVER, 'unsafe']

  // proportional to the width, enter a height of 0,
  const height = 0
  const finalSize = `${width}x${height}`

  const postSizeComponents: string[] = ['center', 'middle']
  quality && postSizeComponents.push(`filters:quality(${quality || 80})`)
  postSizeComponents.push(encodeURIComponent(src))

  return [...preSizeComponents, finalSize, ...postSizeComponents].join('/')
}
