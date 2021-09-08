import { printSchema } from 'graphql'
import type {
  CreateSchemaCustomizationArgs,
  PluginOptionsSchemaArgs,
  SourceNodesArgs,
} from 'gatsby'
import type { GraphQLSchema } from 'graphql'

import { sourceCollections } from './sourceCollections'
import { sourceProducts } from './sourceProducts'

export interface Options {
  sourceProducts?: boolean
  sourceCollections?: boolean
  maxNumProducts?: number
  maxNumCollections?: number
  getSchema: () => Promise<GraphQLSchema>
}

export const pluginOptionsSchema = ({ Joi }: PluginOptionsSchemaArgs) =>
  Joi.object({
    sourceProducts: Joi.boolean(),
    sourceCollections: Joi.boolean(),
    maxNumProducts: Joi.number(),
    maxNumCollections: Joi.number(),
    getSchema: Joi.function().required(),
  })

export const createSchemaCustomization = async (
  gatsbyApi: CreateSchemaCustomizationArgs,
  options: Options
) => {
  const { actions } = gatsbyApi
  const schema = await options.getSchema()
  const typeDefs = printSchema(schema)
    .replace('type StoreCollection {', 'type StoreCollection implements Node {')
    .replace(`type StoreProduct {`, `type StoreProduct implements Node {`)
    .replace(/(\w*)Connection/g, 'Browser$1Connection')

  actions.createTypes(typeDefs)
}

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
