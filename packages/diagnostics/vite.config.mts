import { builtinModules } from 'node:module'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import pkgeJson from './package.json' with { type: 'json' }

const { dependencies = {}, devDependencies } = pkgeJson

export default defineConfig(({ mode }) => ({
  root: process.env.PWD ?? process.cwd(),
  plugins: [dts() as any],
  build: {
    sourcemap: mode === 'production' ? 'hidden' : 'inline',
    outDir: './dist',
    lib: {
      entry: './src/index.ts',
      formats: ['es', 'cjs'],
      fileName: '[format]/index',
    },
    rollupOptions: {
      external: [
        /@vtex\/diagnostics-nodejs/,
        /@opentelemetry/,
        ...builtinModules.concat(builtinModules.map((e) => `node:${e}`)),
        ...Object.keys({
          ...(dependencies ?? {}),
          ...(devDependencies ?? {}),
        }),
      ],
    },
  },
}))
