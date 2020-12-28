import { writeFileSync } from 'fs'
import { join } from 'path'

import WebpackAssetsManifest from 'webpack-assets-manifest'
import type { GatsbyNode } from 'gatsby'

import { BUILD_HTML_STAGE, VTEX_NGINX_CONF_FILENAME } from './constants'
import {
  addPublicCachingHeader,
  addStaticCachingHeader,
  applyUserHeadersTransform,
  cacheHeadersByPath,
  emptyHeadersMapForFiles,
  preloadHeadersByPath,
} from './headers'
import { listFilesRecursively } from './listFiles'
import { generateNginxConfiguration, parseRedirect } from './nginx-generator'
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

    const {
      program,
      pages: pagesMap,
      redirects: maybeRedirects,
    } = store.getState() as {
      pages: Map<string, Page>
      program: { directory: string }
      redirects: Redirect[]
    }

    const pages = Array.from(pagesMap.values())

    const pageRewrites: Redirect[] = pages
      .filter((page) => page.matchPath && page.matchPath !== page.path)
      .map((page) => ({
        fromPath: page.matchPath as string,
        toPath: page.path,
      }))

    const { redirects, rewrites: redirectRewrites } = maybeRedirects.reduce(
      (acc, r) => {
        const type = parseRedirect(r)

        if (type === 'proxy') {
          acc.redirects.push(r)
        } else if (type === 'rewrite') {
          acc.rewrites.push(r)
        }

        return acc
      },
      {
        redirects: [],
        rewrites: [],
      } as { redirects: Redirect[]; rewrites: Redirect[] }
    )

    const rewrites = [...pageRewrites, ...redirectRewrites]

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
        redirects,
        headersMap: headers,
        files,
        options,
      })
    )

    reporter.success('write out nginx configuration')
  },
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
