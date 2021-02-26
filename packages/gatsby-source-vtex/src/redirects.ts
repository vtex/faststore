import fs from 'fs'

import csv2json from 'csvtojson'

import type { Redirect } from './types'

const csv = `${process.cwd()}/redirects.csv`

export const redirectsFromCSV = ({
  delimiter = ';',
}: {
  delimiter: string
}) => {
  if (!fs.existsSync(csv)) {
    return []
  }

  return csv2json({ delimiter }).fromFile(csv)
}

const removeTrailingSlashes = (str: string) =>
  str.endsWith('/') ? str.substring(0, str.length - 1) : str

export const assertRedirects = (maybeRedirects: any[]): Redirect[] => {
  const redirects: Redirect[] = []
  const seen = new Set()

  for (let it = 0; it < maybeRedirects.length; it++) {
    const { fromPath, toPath, type = 'PERMANENT' } = maybeRedirects[it]
    const line = it + 1

    if (typeof fromPath !== 'string' || typeof toPath !== 'string') {
      throw new Error(
        `[gatsby-source-vtex]: The redirect ${fromPath} -> ${toPath} is not valid in redirects:${line}. Please add a source or target`
      )
    }

    if (!fromPath.startsWith('/') || !toPath.startsWith('/')) {
      throw new Error(
        `[gatsby-source-vtex]: The redirect ${fromPath} -> ${toPath} is not valid in redirects:${line}. The urls must start with "/"`
      )
    }

    if (type !== 'PERMANENT' || type !== 'TEMPORARY') {
      throw new Error(
        `[gatsby-source-vtex]: Invalid redirect type in redirects:${line}. Expected TEMPORARY or PERMANENT by received ${type}`
      )
    }

    if (seen.has(fromPath)) {
      throw new Error(
        `[gatsby-source-vtex]: Redirect ${fromPath} is duplicated in redirects:${line}. Please de-duplicate your redirects before continuing`
      )
    }

    seen.add(fromPath)

    redirects.push({
      fromPath: removeTrailingSlashes(fromPath),
      toPath: removeTrailingSlashes(toPath),
      isPermanent: type === 'PERMANENT',
    })
  }

  return redirects
}

const getRedirects = async () => {
  const maybeRedirects = await redirectsFromCSV({ delimiter: ';' })

  return assertRedirects(maybeRedirects)
}

export default getRedirects
