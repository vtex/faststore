import { CreateWebpackConfigArgs } from 'gatsby'

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
  const { schema } = store.getState()

  setWebpackConfig({
    plugins: [new WebpackPlugin(schema)],
  })
}
