const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const entries = {
  'pages/index': './src/pages/index.tsx',
  'pages/_app': './src/pages/_app.tsx',
  'pages/404': './src/pages/404.tsx',
  'pages/500': './src/pages/500.tsx',
  'pages/department': './src/pages/[...slug].tsx',
  'pages/product-listing': './src/pages/[slug]/p.tsx',
  'pages/login': './src/pages/login.tsx',
  'pages/checkout': './src/pages/checkout.tsx',
  'pages/_document': './src/pages/_document.tsx',
}

/**
 * @param {LibType} libType
 * @returns {import('webpack').Configuration}
 * */
const config = (libType = 'commonjs2', isCJS = /commonjs/.test(libType)) => ({
  plugins: [new MiniCssExtractPlugin()],
  // devtool: 'source-map',
  mode: process.NODE_ENV !== 'production' ? 'development' : 'production',
  entry: entries,
  target: ['es2020'],
  ignoreWarnings: [
    { message: /autoprefixer:/ },
    { message: /Deprecation Warning/ },
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            targets: 'defaults',
            presets: ['next/babel'],
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(sass|scss|css)$/i,
        use: [
          // Creates `style` nodes from JS strings
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          {
            loader: 'sass-loader',
            options: {
              // api: 'modern',
              // sassOptions: {
              //   includePaths: [path.resolve(__dirname, 'node_modules')],
              // },
              additionalData:
                '@import "@faststore/ui/src/styles/base/utilities.scss";',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    fallback: {
      path: false,
      zlib: false,
      https: false,
      http: false,
      stream: false,
      'crypto-browserify': false,
      crypto: false,
      fs: false,
      tty: false,
    },
  },
  output: {
    chunkFilename: '[name].js',
    clean: true,
    publicPath: '',
    filename: '[name].js',
    chunkFormat: !isCJS ? 'module' : 'commonjs',
    path: path.resolve(__dirname, 'dist', isCJS ? 'cjs' : 'esm'),
    library: {
      // name: '@faststore/core',
      type: libType,
    },
  },
  externals: [
    /^next(\/.+)?$/,
    'react',
    'react/jsx-runtime',
    'react-dom',
    'react-dom/client',
    '@faststore/api',
    '@faststore/ui',
    '@faststore/sdk',
    '@faststore/cli',
    '@faststore/components',
    '@faststore/lighthouse',
    '@faststore/graphql-utils',
    '@faststore/graphql-schema',
    'graphql',
  ],
  experiments: {
    outputModule: !isCJS,
  },
})

module.exports = [config('commonjs-static'), config('modern-module')]

/** @typedef { 'var' | 'module' | 'assign' | 'assign-properties' | 'this' | 'window' | 'self' | 'global' | 'commonjs' | 'commonjs2' | 'commonjs-module' | 'commonjs-static' | 'amd' | 'amd-require' | 'umd' | 'umd2' | 'jsonp' | 'system'} LibType */
