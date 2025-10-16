import { defineConfig } from 'vite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import dts from 'vite-plugin-dts'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@vtex/faststore-ui/src/styles/base/utilities.scss";`,
        silenceDeprecations: ['import', 'legacy-js-api', 'global-builtin'],
      },
    },
  },
  plugins: [dts()],
  build: {
    lib: {
      entry: [
        resolve(__dirname, 'src/server.ts'),
        resolve(__dirname, 'src/client.ts'),
      ],
      formats: ['es'],
      fileName: (_format, name) => {
        return `${name}.js`
      },
    },
    rollupOptions: {
      output: {
        banner: (chunkInfo) => {
          if (chunkInfo.name === 'client') {
            return "'use client';"
          }
          return ''
        },
      },
    },
  },
})
