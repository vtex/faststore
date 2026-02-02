import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import pkgeJson from './package.json'

const { dependencies, peerDependencies } = pkgeJson

export default defineConfig({
  root: process.env.PWD ?? process.cwd(),
  plugins: [react(), dts()],
  build: {
    outDir: './dist',
    lib: {
      entry: './src/index.ts',
      formats: ['cjs', 'es'],
      fileName: '[format]/index',
    },
    rollupOptions: {
      external: [
        ...Object.keys({
          ...(dependencies ?? {}),
          ...(peerDependencies ?? {}),
        }),
      ],
    },
  },
})
