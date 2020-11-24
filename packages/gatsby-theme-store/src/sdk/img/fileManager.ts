const separator = '/arquivos/ids/'

export const scaleFileManagerImage = (
  path: string,
  width: number | 'auto' = 'auto',
  height: number | 'auto' = 'auto'
) => {
  const [host, r1] = path.split(separator)
  const fixedHost = host.replace('vteximg.com.br', 'vtexassets.com')

  if (!r1) {
    return path
  }

  const [r2, query] = r1.split('?')
  const [id] = r2.split('/')
  const idSplited = id.split('-')
  const imageId = idSplited.length ? idSplited[0] : id

  return `${fixedHost}${separator}${imageId}-${width}-${height}?${query || ''}`
}
