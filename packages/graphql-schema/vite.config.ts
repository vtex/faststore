import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [dts()],
  build: {
    lib: {
      entry: './index.ts',
      formats: ['cjs'],
      fileName: 'index',
    },
  },
})
