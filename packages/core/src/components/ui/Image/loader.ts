import storeConfig from 'faststore.config'
const THUMBOR_SERVER = `https://${storeConfig.api.storeId}.vtexassets.com`

export default function customImageLoader({ src, width }) {
  const preSizeComponents = [THUMBOR_SERVER, 'unsafe']

  // proportional to the width, enter a height of 0,
  const height = 0
  const finalSize = `${width}x${height}`

  const postSizeComponents: string[] = [
    'center',
    'middle',
    encodeURIComponent(src),
  ]
  return [...preSizeComponents, finalSize, ...postSizeComponents].join('/')
}
