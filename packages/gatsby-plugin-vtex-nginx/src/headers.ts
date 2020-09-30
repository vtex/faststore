import { parse, posix } from 'path'

import kebabHash from 'kebab-hash'

import {
  CACHING_HEADERS,
  COMMON_BUNDLES,
  IMMUTABLE_CACHING_HEADER,
  PAGE_DATA_DIR,
  PUBLIC_CACHING_HEADER,
} from './constants'

function preloadHeadersByPath(
  pages: Page[],
  manifest: Manifest,
  pathPrefix: string
): PathHeadersMap {
  return Object.fromEntries(
    pages.map((page) => {
      const scripts: string[] = ([] as string[]).concat(
        ...COMMON_BUNDLES.map((file) => getScriptsPaths(file, manifest))
      )

      scripts.push(...getScriptsPaths(pathChunkName(page.path), manifest))
      scripts.push(...getScriptsPaths(page.componentChunkName, manifest))

      const jsons: string[] = [
        posix.join(PAGE_DATA_DIR, 'app-data.json'),
        getPageDataPath(page.path),
      ]

      return [
        normalizePath(pathPrefix + page.path),
        [
          ...scripts.filter(Boolean).map((script) => ({
            name: 'Link',
            value: linkTemplate(script, pathPrefix),
          })),
          ...jsons.map((json) => ({
            name: 'Link',
            value: linkTemplate(json, pathPrefix, 'fetch'),
          })),
        ],
      ]
    })
  )
}

function cacheHeadersByPath(pages: Page[], manifest: Manifest): PathHeadersMap {
  const chunks = pages.map((page) => page.componentChunkName)

  chunks.push(`pages-manifest`, `app`)

  const files = ([] as string[]).concat(
    ...chunks.map((chunk) => manifest[chunk] || [])
  )

  return Object.fromEntries(
    files
      .map((file) => [`/${file}`, [IMMUTABLE_CACHING_HEADER]])
      .concat(CACHING_HEADERS)
  )
}

// removes trailing slash if possible
function normalizePath(path: string) {
  if (!path.endsWith('/') || path === '/') {
    return path
  }

  return path.slice(0, -1)
}

function getScriptsPaths(file: string, manifest: Manifest): string[] {
  const chunks = manifest[file]

  if (!chunks) {
    return []
  }

  return chunks.filter((script) => parse(script).ext === '.js')
}

function linkTemplate(
  asset: string,
  pathPrefix: string,
  type: 'script' | 'fetch' = 'script'
) {
  return `<${pathPrefix}/${asset}>; rel=preload; as=${type}${
    type === 'fetch' ? '; crossorigin' : ''
  }`
}

function pathChunkName(path: string) {
  const name = path === '/' ? 'index' : kebabHash(path)

  return `path---${name}`
}

function getPageDataPath(path: string) {
  const fixedPagePath = path === `/` ? `index` : path

  return posix.join(PAGE_DATA_DIR, fixedPagePath, `page-data.json`)
}

function applyUserHeadersTransform(
  headersMap: PathHeadersMap,
  transform: (headers: string[], path: string) => string[]
): PathHeadersMap {
  return Object.fromEntries(
    Object.entries(headersMap).map(([path, headers]) => {
      const headersAsStrings = headers.map(
        ({ name, value }) => `${name}: ${value}`
      )

      return [path, transform(headersAsStrings, path).map(headerFromString)]
    })
  )
}

function addPublicCachingHeader(headersMap: PathHeadersMap) {
  return Object.fromEntries(
    Object.entries(headersMap).map(([path, headers]) => {
      if (headers.find((h) => h.name.toLowerCase() === 'cache-control')) {
        return [path, headers]
      }

      return [path, [...headers, PUBLIC_CACHING_HEADER]]
    })
  )
}

function headerFromString(header: string): Header {
  const [name, ...rest] = header.split(':')

  return {
    name,
    value: rest.join('').trim(),
  }
}

export {
  addPublicCachingHeader,
  preloadHeadersByPath,
  cacheHeadersByPath,
  applyUserHeadersTransform,
}
