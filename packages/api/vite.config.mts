import { builtinModules } from 'node:module'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import pkgeJson from './package.json'

const { dependencies, peerDependencies, devDependencies } = pkgeJson

export default defineConfig(({ mode }) => ({
  root: process.env.PWD ?? process.cwd(),
  plugins: [dts()],
  build: {
    sourcemap: mode === 'production' ? 'hidden' : 'inline',
    outDir: './dist',
    lib: {
      entry: './src/index.ts',
      formats: ['cjs', 'es'],
      fileName: '[format]/index',
    },
    rollupOptions: {
      external: [
        ...builtinModules.concat(builtinModules.map((e) => `node:${e}`)),
        ...Object.keys({
          ...(dependencies ?? {}),
          ...(devDependencies ?? {}),
          ...(peerDependencies ?? {}),
        }),
      ],
    },
  },
}))
