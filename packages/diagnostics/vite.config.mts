import { builtinModules } from 'node:module'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import pkgeJson from './package.json' with { type: 'json' }

const { dependencies = {} } = pkgeJson

export default defineConfig({
  root: process.env.PWD ?? process.cwd(),
  plugins: [dts()],
  build: {
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
        }),
      ],
    },
  },
})
