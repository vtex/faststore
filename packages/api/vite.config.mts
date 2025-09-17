import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import pkgeJson from './package.json'

const { dependencies, peerDependencies, devDependencies } = pkgeJson
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
      external: [
        ...Object.keys({
          ...(dependencies ?? {}),
          ...(devDependencies ?? {}),
          ...(peerDependencies ?? {}),
        }),
      ],
    },
  },
})
