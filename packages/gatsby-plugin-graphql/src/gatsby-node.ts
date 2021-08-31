import { join } from 'path'

import { makeExecutableSchema } from '@graphql-tools/schema'
import { parse, printSchema } from 'graphql'
import type { CreateWebpackConfigArgs, PluginOptionsSchemaArgs } from 'gatsby'

import { WebpackPlugin } from './webpack'

interface Options {
  schemaPath?: string
  rootPath?: string
}

export const pluginOptionsSchema = ({ Joi }: PluginOptionsSchemaArgs) => {
  return Joi.object({
    schemaPath: Joi.string(),
    rootPath: Joi.string(),
  })
}

export const onCreateWebpackConfig = async (
  { actions: { setWebpackConfig }, store, stage }: CreateWebpackConfigArgs,
  options: Options
) => {
  if (stage === 'build-html' || stage === 'develop-html') {
    return
  }

  /**
   * Here be Unicorns 🦄
   *
   * For some reason, gatsby's schema does not work well with
   * graphql-tools. We then stringify/parse the schema so
   * it works well with graphql-tools
   */
  const { schema: dirtySchema } = store.getState()
  const typeDefs = parse(printSchema(dirtySchema))
  const schema = makeExecutableSchema({ typeDefs })
  const rootPath = join(process.cwd(), options.rootPath ?? '__generated__')
  const schemaPath = join(
    process.cwd(),
    options.schemaPath ?? '/src/typings/schema.graphql.d.ts'
  )

  setWebpackConfig({
    plugins: [new WebpackPlugin(schema, { schemaPath, rootPath })],
  })
}
