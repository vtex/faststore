import { makeExecutableSchema } from '@graphql-tools/schema'
import { CreateWebpackConfigArgs } from 'gatsby'
import { printSchema } from 'graphql'

import { WebpackPlugin } from './webpack'

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
  const typeDefs = printSchema(dirtySchema)
  const schema = makeExecutableSchema({ typeDefs })

  setWebpackConfig({
    plugins: [new WebpackPlugin(schema)],
  })
}
