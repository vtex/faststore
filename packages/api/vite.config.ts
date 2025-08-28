import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { generate } from '@graphql-codegen/cli'

export default (async () => {
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
