export const IMAGE_DEFAULT =
  'https://tudoparasuaempresa.com.br/assets/img/!product-image.jpg'

export const scaleImage = (
  path: string,
  width: number | 'auto' = 'auto',
  height: number | 'auto' = 'auto'
) => {
  const separator = '/arquivos/ids/'
  const [host, r1] = path.split(separator)

  if (!r1) {
    return path
  }

  const [id, ...r2] = r1.split('/')
  const scaledImg = [`${host}${separator}${id}-${width}-${height}`, ...r2].join(
    '/'
  )

  return scaledImg
}
