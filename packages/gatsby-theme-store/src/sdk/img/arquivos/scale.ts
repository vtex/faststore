const separator = '/arquivos/ids/'

export const scaleImage = (
  path: string,
  width: number | 'auto' = 'auto',
  height: number | 'auto' = 'auto'
) => {
  const [, r1] = path.split(separator)

  if (!r1) {
    return path
  }

  const [r2, query] = r1.split('?')
  const [id] = r2.split('/')
  const idSplited = id.split('-')
  const imageId = idSplited.length ? idSplited[0] : id

  return `${separator}${imageId}-${width}-${height}?${query || ''}`
}
