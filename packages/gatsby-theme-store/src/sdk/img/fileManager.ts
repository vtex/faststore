/**
 * WARNING: You should be using this on the backend for critical rendering, a.k.a. gatsby-node.js.
 * If this file in being added to your final bundle, please rethink your rendering strategy
 */

interface ImageParams {
  width?: number
  height?: number
  aspect?: boolean
  quality?: number
}

interface Options {
  ratio: number
}

export const optimize = (
  src: string,
  imageParams: ImageParams,
  options: Options = { ratio: 1 }
) => {
  const url = new URL(src)

  for (const option of Object.keys(imageParams)) {
    let paramValue = imageParams[option as keyof ImageParams]

    if (option === 'width' || option === 'height') {
      paramValue = (paramValue as number) * options.ratio
    }

    url.searchParams.append(option, `${paramValue}`)
  }

  return url.toString()
}
