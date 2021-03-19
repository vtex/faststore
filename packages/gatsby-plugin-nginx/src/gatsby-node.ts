import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'

import WebpackAssetsManifest from 'webpack-assets-manifest'
import type { GatsbyNode } from 'gatsby'

import { rankRoutes } from './pathRanking'
import {
  BUILD_HTML_STAGE,
  VTEX_NGINX_CONF_FILENAME,
  FUNCTIONS_REDIRECTS_FILENAME,
  FUNCTIONS_URL_PATH,
} from './constants'
import {
  addPublicCachingHeader,
  addStaticCachingHeader,
  applyUserHeadersTransform,
  cacheHeadersByPath,
  emptyHeadersMapForFiles,
  preloadHeadersByPath,
} from './headers'
import { listFilesRecursively } from './listFiles'
import { generateNginxConfiguration } from './nginx-generator'
import { pluginOptions } from './pluginOptions'

const assetsManifest: Record<string, string> = {}

const Node: GatsbyNode = {
  onCreateWebpackConfig({ actions, stage }) {
    if (stage !== BUILD_HTML_STAGE) {
      return
    }

    actions.setWebpackConfig({
      plugins: [
        new WebpackAssetsManifest({
          assets: assetsManifest,
          merge: true,
        }),
      ],
    })
  },

  async onPostBuild({ store, pathPrefix, reporter }, opt: PluginOptions) {
    const options = pluginOptions(opt)

    const { program, pages: pagesMap, redirects } = store.getState() as {
      pages: Map<string, Page>
      program: { directory: string }
      redirects: Redirect[]
    }

    const pages = Array.from(pagesMap.values())

    const pageRewrites: Redirect[] = pages
      .filter(
        (page) =>
          typeof page.matchPath === 'string' && page.matchPath !== page.path
      )
      .map((page) => ({
        fromPath: page.matchPath!,
        toPath: page.path,
      }))

    const rewrites = rankRoutes([
      ...pageRewrites,
      ...redirects,
      ...getFunctionsRedirects(program.directory),
    ])

    const publicFolder = join(program.directory, 'public')

    const { assetsByChunkName } = require(join(
      publicFolder,
      'webpack.stats.json'
    ))

    const manifest = {
      ...mapObjectValues(assetsManifest, (value) => [value]),
      ...assetsByChunkName,
    }

    const files = await listFilesRecursively(publicFolder)

    let headers = {
      ...emptyHeadersMapForFiles(files),
      ...preloadHeadersByPath(pages, manifest, pathPrefix),
      ...cacheHeadersByPath(pages, manifest),
    }

    if (typeof options.transformHeaders === 'function') {
      headers = applyUserHeadersTransform(headers, options.transformHeaders)
    }

    headers = addStaticCachingHeader(headers)

    headers = addPublicCachingHeader(headers)

    writeFileSync(
      join(program.directory, 'public', VTEX_NGINX_CONF_FILENAME),
      generateNginxConfiguration({
        rewrites,
        headersMap: headers,
        files,
        options,
      })
    )

    reporter.success('write out nginx configuration')
  },
}

function getFunctionsRedirects(basedir: string): Redirect[] {
  const redirectsFile = join(basedir, 'public', FUNCTIONS_REDIRECTS_FILENAME)

  if (!existsSync(redirectsFile)) {
    return []
  }

  const contents = readFileSync(redirectsFile).toString()
  const file = JSON.parse(contents) as Record<string, string>

  return Object.entries(file).map(([key, value]) => ({
    fromPath: join(FUNCTIONS_URL_PATH, key),
    toPath: value,
  }))
}

function mapObjectValues<V, T>(
  obj: Record<string | number | symbol, V>,
  transform: (value: V) => T
): Record<string | number | symbol, T> {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, transform(v)])
  )
}

export const { onCreateWebpackConfig } = Node
export const { onPostBuild } = Node
