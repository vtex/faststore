import { printSchema } from 'graphql'
import type { CreateSchemaCustomizationArgs } from 'gatsby'

import type { Options } from './index'

export const createSchemaCustomization = async (
  gatsbyApi: CreateSchemaCustomizationArgs,
  options: Pick<Options, 'getSchema'>
) => {
  const { actions } = gatsbyApi
  const schema = await options.getSchema()
  const typeDefs = printSchema(schema)
    .replace('type StoreCollection {', 'type StoreCollection implements Node {')
    .replace(`type StoreProduct {`, `type StoreProduct implements Node {`)
    .replace(/(\w*)Connection/g, 'Browser$1Connection')

  actions.createTypes(typeDefs)
}
