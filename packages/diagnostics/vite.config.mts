import { builtinModules } from 'node:module'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import pkgeJson from './package.json' with { type: 'json' }

const bundledPackages = new Set([
  '@vtex/diagnostics-nodejs',
  '@vtex/diagnostics-semconv',
  '@opentelemetry/api',
  '@opentelemetry/instrumentation-http',
])

const externalPackages = Object.keys({
  ...(pkgeJson.dependencies ?? {}),
  ...(pkgeJson.devDependencies ?? {}),
}).filter((name) => !bundledPackages.has(name))

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
        ...builtinModules.concat(builtinModules.map((e) => `node:${e}`)),
        ...externalPackages,
      ],
    },
  },
}))
