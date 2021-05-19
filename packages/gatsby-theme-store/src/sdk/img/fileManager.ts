/**
 * WARNING: You should be using this on the backend for critical rendering, a.k.a. gatsby-node.js.
 * If this file in being added to your final bundle, please rethink your rendering strategy
 */

interface Options {
  width?: number
  height?: number
  aspect?: boolean
  quality?: number
}

export const optimize = (src: string, opts: Options, ratio = 1) => {
  const url = new URL(src)

  for (const option of Object.keys(opts)) {
    let paramValue = opts[option as keyof Options]

    if (paramValue && ['width', 'height'].includes(option)) {
      paramValue = (paramValue as number) * ratio
    }

    url.searchParams.append(option, `${paramValue}`)
  }

  return url.toString()
}
