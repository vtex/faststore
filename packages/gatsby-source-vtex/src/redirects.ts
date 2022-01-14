import type { Redirect } from './types'

export const assertRedirects = (redirects: Redirect[]) => {
  const seen = new Set()

  for (let it = 0; it < redirects.length; it++) {
    const { fromPath, toPath, isPermanent } = redirects[it]

    const line = it + 1

    if (typeof fromPath !== 'string' || typeof toPath !== 'string') {
      throw new Error(
        `[gatsby-source-vtex]: The redirect ${fromPath} -> ${toPath} is not valid in redirects:${line}. Please add a source or target`
      )
    }

    if (!fromPath.startsWith('/')) {
      throw new Error(
        `[gatsby-source-vtex]: The redirect ${fromPath} -> ${toPath} is not valid in redirects:${line}. The "fromPath" must start with "/"`
      )
    }

    if (isPermanent == null) {
      throw new Error(
        `[gatsby-source-vtex]: Invalid redirect type in redirects:${line}. isPermanent is required`
      )
    }

    if (seen.has(fromPath)) {
      throw new Error(
        `[gatsby-source-vtex]: Redirect ${fromPath} is duplicated in redirects:${line}. Please de-duplicate your redirects before continuing`
      )
    }

    seen.add(fromPath)
  }
}
