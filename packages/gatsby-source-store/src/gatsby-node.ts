import type { PluginOptionsSchemaArgs, SourceNodesArgs } from 'gatsby'
import type { GraphQLSchema } from 'graphql'

import { sourceCollections } from './sourceCollections'
import { sourceProducts } from './sourceProducts'

export interface Options {
  sourceProducts?: boolean
  sourceCollections?: boolean
  getSchema: () => Promise<GraphQLSchema>
}

export const pluginOptionsSchema = ({ Joi }: PluginOptionsSchemaArgs) =>
  Joi.object({
    sourceProducts: Joi.boolean(),
    sourceCollections: Joi.boolean(),
    getSchema: Joi.function().required(),
  })

export const sourceNodes = async (
  gatsbyApi: SourceNodesArgs,
  options: Options
) => {
  const { reporter } = gatsbyApi
  const lastBuildTime = await gatsbyApi.cache.get(`LAST_BUILD_TIME`)

  await gatsbyApi.cache.set(`LAST_BUILD_TIME`, Date.now())

  if (lastBuildTime) {
    reporter.info(
      '[gatsby-source-vtex]: CACHE FOUND! We are about to go FAST! Skipping FETCH'
    )
  } else {
    reporter.info(
      '[gatsby-source-vtex]: No cache found. Sourcing all data from scratch'
    )
  }

  await Promise.all([
    sourceProducts(gatsbyApi, options),
    sourceCollections(gatsbyApi, options),
  ])
}
