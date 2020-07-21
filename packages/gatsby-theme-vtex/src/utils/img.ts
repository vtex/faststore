export const IMAGE_DEFAULT =
  'https://tudoparasuaempresa.com.br/assets/img/!product-image.jpg'

export const scaleImage = (
  path: string,
  width: number | 'auto' = 'auto',
  height: number | 'auto' = 'auto'
) => {
  const separator = '/arquivos/ids/'
  const [host, r1] = path.split(separator)
  const fixedHost = host.replace('vteximg.com.br', 'vtexassets.com')

  if (!r1) {
    return path
  }

  const [id] = r1.split('/')
  const idSplited = id.split('-')
  const imageId = idSplited.length ? idSplited[0] : id

  return `${fixedHost}${separator}${imageId}-${width}-${height}`
}
