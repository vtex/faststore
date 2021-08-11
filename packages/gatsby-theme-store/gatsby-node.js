const { resolve, relative } = require('path')

exports.onPostBootstrap = (_, { storeId }) => {
  process.env.GATSBY_STORE_ID = storeId
}

exports.pluginOptionsSchema = ({ Joi }) =>
  Joi.object({
    storeId: Joi.string().required(),
    locales: Joi.array().items(Joi.string()).required(),
    defaultLocale: Joi.string().required(),
    profiling: Joi.boolean(),
  })

const resolveToTS = (pkg, file) => {
  const root = `${process.cwd()}/.cache`

  let cjs = require.resolve(`${pkg}/${file}.js`, { paths: [process.cwd()] })

  if (file === 'gatsby-browser') {
    cjs = relative(root, cjs)
  }

  const ts = cjs.replace(`/${file}.js`, `/src/${file}`)

  return {
    [cjs]: ts,
  }
}

exports.onCreateWebpackConfig = (
  { actions: { setWebpackConfig }, stage },
  { profiling = false }
) => {
  const profilingConfig =
    stage === 'build-javascript' && profiling === true
      ? {
          resolve: {
            alias: {
              'react-dom': 'react-dom/profiling',
              'scheduler/tracing': 'scheduler/tracing-profiling',
            },
          },
          optimization: {
            minimize: false,
            moduleIds: 'named',
            chunkIds: 'named',
            concatenateModules: false,
          },
        }
      : null

  setWebpackConfig({
    ...profilingConfig,
    resolve: {
      alias: {
        ...profilingConfig?.resolve.alias,
        // Gatsby-plugin-next-seo does not have a "sideEffects: false" in its package.json. Webpack doesn't know if
        // it can tree shake it or not. This points the webpack directly to the source file so everything is imported
        // using es6 and only the used packages are used
        'gatsby-plugin-next-seo$': resolve(
          require.resolve('gatsby-plugin-next-seo', { paths: [process.cwd()] }),
          stage === 'build-javascript' || stage === 'develop'
            ? '../../src/index'
            : ''
        ),
        '@vtex/store-ui$': resolve(
          require.resolve('@vtex/store-ui', { paths: [process.cwd()] }),
          stage === 'build-javascript' || stage === 'develop'
            ? '../../src/index'
            : ''
        ),
        // Resolve to the .ts versions of gatsby-(browser|ssr) so we don't end up by adding the whole lib.
        ...resolveToTS('gatsby-plugin-next-seo', 'gatsby-browser'),
        ...resolveToTS('gatsby-plugin-next-seo', 'gatsby-ssr'),
        '@vtex/order-manager': require.resolve(
          '@vtex/order-manager/src/index.tsx'
        ),
        '@vtex/order-items': require.resolve('@vtex/order-items/src/index.tsx'),
      },
    },
    module: {
      rules: [
        {
          test: /\.md$/,
          use: [
            { loader: require.resolve('html-loader') },
            { loader: require.resolve('markdown-loader') },
          ],
        },
      ],
    },
  })
}
