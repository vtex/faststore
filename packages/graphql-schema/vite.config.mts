import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  root: process.env.PWD ?? process.cwd(),
  plugins: [dts()],
  build: {
    lib: {
      entry: './src/index.ts',
      formats: ['cjs', 'es'],
      fileName: '[format]/index',
    },
    rollupOptions: {
      external: ['graphql'],
    },
  },
})
