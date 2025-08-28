const { defineConfig } = require('vite')
const dts = require('vite-plugin-dts').default
const { generate } = require('@graphql-codegen/cli')

module.exports = (async () => {
  await generate(
    {
      overwrite: true,
      schema: './src/**/*.graphql',
      documents: undefined,
      generates: {
        'src/__generated__/schema.ts': {
          plugins: ['typescript'],
          config: {
            constEnums: true,
          },
        },
      },
    },
    true
  )

  return defineConfig({
    plugins: [dts()],
    build: {
      lib: {
        entry: './src/index.ts',
        formats: ['cjs', 'es'],
        fileName: '[format]/index',
      },
    },
  })
})()
