import { makeExecutableSchema } from '@graphql-tools/schema'
import { parse, printSchema } from 'graphql'
import type { CreateWebpackConfigArgs } from 'gatsby'

import { WebpackPlugin } from './webpack'

export const onCreateWebpackConfig = async ({
  actions: { setWebpackConfig },
  store,
}: CreateWebpackConfigArgs) => {
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

  setWebpackConfig({
    plugins: [new WebpackPlugin(schema)],
  })
}
