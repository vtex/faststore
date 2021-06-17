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

  const activeEnv =
    process.env.GATSBY_ACTIVE_ENV ?? process.env.NODE_ENV ?? 'development'

  if (activeEnv === 'build-javascript' || activeEnv === 'development') {
    // eslint-disable-next-line no-console
    console.log(`Using environment config: '${activeEnv}'`)
  }
}
