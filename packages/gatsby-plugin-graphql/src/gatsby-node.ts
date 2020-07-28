import { makeExecutableSchema } from '@graphql-tools/schema'
import { CreateWebpackConfigArgs } from 'gatsby'
import { parse, printSchema } from 'graphql'

import { WebpackPlugin } from './webpack'

// TODO: We should uncomment this when gatsby allows
// plugins to hook into the babel step before it
// removes all queries
// export const onCreateBabelConfig = ({
//   actions: { setBabelPlugin },
// }: CreateBabelConfigArgs) => {
//   setBabelPlugin({
//     name: require.resolve('./babel'),
//     options: {},
//   })
// }

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
