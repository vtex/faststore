import type {
  CreateWebpackConfigArgs,
  ParentSpanPluginArgs,
  CreatePagesArgs,
  Page,
  PluginOptionsSchemaArgs,
} from 'gatsby'
import { getAbsolutePathForVirtualModule } from 'gatsby/dist/utils/gatsby-webpack-virtual-modules'

import { copyToCacheDir, getPageDataJsonPath } from './utils'

interface Options {
  enableServerRouting?: boolean
}

const isProduction = process.env.NODE_ENV === 'production'

export const pluginOptionsSchema = ({ Joi }: PluginOptionsSchemaArgs) =>
  Joi.object({
    enableServerRouting: Joi.boolean(),
  })

export const onCreateWebpackConfig = (
  { actions: { setWebpackConfig } }: CreateWebpackConfigArgs,
  { enableServerRouting }: Options
) => {
  if (!enableServerRouting || !isProduction) {
    return
  }

  const emptyMatchPaths = require.resolve('../match-paths.json')
  const gatsbyMatchPaths = getAbsolutePathForVirtualModule(
    '$virtual/match-paths.json'
  )

  setWebpackConfig({
    resolve: {
      alias: {
        [gatsbyMatchPaths]: emptyMatchPaths,
      },
    },
  })
}

/**
 * TODO: Remove this file once Gatsby solves this issue
 *
 * Gatsby has a file called .cache/match-paths.json. This file is responsible for gatsby's router.
 * When SSG pages, all SSG pages that matches a client-side page are added to this json so the
 * Gatsby router knows which javascript to include. This file is eventually included in `app.js` entrypoint.
 *
 * Since we are now generating a lot of product pages, all SSG paths end up in the `app.js` final bundle. This has
 * a huge performance issue and also creates unecessary invalidation in our assets, breaking incremental builds.
 *
 * To prevent the aforementioned issue, we remove the `matchPath` from page and create a redirect instead.
 * This redirect is performed on the browser and everything should work just fine. The problem with that is that we
 * now miss the automatic gatsby parameter parsing, however I think this is an ok-ish price to pay for the huge
 * benefits in stability and performance
 *
 * Also, we could just generate this on our createPage hook. We don't do this because we eventually want to use the
 * Gatsby Route Filesystem API to be more declarative instead of imperatively.
 *
 * More infos on the issue: https://github.com/gatsbyjs/gatsby/issues/21701
 */
export const onCreatePage = (
  {
    page,
    actions: { createRedirect },
  }: CreatePagesArgs & { page: Page<unknown> },
  { enableServerRouting }: Options
) => {
  if (!enableServerRouting || !isProduction) {
    return
  }

  if (typeof page.matchPath !== 'string' || typeof page.path !== 'string') {
    return
  }

  createRedirect({
    fromPath: getPageDataJsonPath(page.matchPath),
    toPath: getPageDataJsonPath(page.path),
  })
}

export const onPostBootstrap = async (
  _: ParentSpanPluginArgs,
  { enableServerRouting }: Options
) => {
  if (!enableServerRouting || !isProduction) {
    return
  }

  await copyToCacheDir(
    require.resolve('../cache-dir/find-path.js', { paths: [__dirname] })
  )
}
