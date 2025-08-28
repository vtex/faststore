import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
// import { generate } from '@graphql-codegen/cli'

export default defineConfig({
  plugins: [dts()],
  build: {
    lib: {
      entry: './src/index.ts',
      formats: ['cjs', 'es'],
      fileName: '[format]/index',
    },
  },
})
