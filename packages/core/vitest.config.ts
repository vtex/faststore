import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { Plugin } from 'vite'
import { defineConfig } from 'vitest/config'

const rootDir = fileURLToPath(new URL('.', import.meta.url))
const discoveryJs = path.join(rootDir, 'discovery.config.js')
const discoveryDefaultJs = path.join(rootDir, 'discovery.config.default.js')

/**
 * Resolve bare and relative `discovery.config` imports (including `.default.js`) for Vitest.
 */
function discoveryConfigResolvePlugin(): Plugin {
  return {
    name: 'vitest-discovery-config-resolve',
    enforce: 'pre',
    resolveId(id) {
      if (
        id === 'discovery.config.default.js' ||
        id.endsWith('/discovery.config.default.js')
      ) {
        return discoveryDefaultJs
      }
      if (
        id === 'discovery.config' ||
        id.endsWith('/discovery.config') ||
        id.endsWith('\\discovery.config')
      ) {
        return discoveryJs
      }
      return undefined
    },
  }
}

export default defineConfig({
  test: {
    globals: true,
    projects: [
      {
        extends: true,
        test: {
          name: 'browser',
          environment: 'jsdom',
          include: ['./test/**/*.browser.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        },
      },
      {
        extends: true,
        test: {
          name: 'node',
          include: ['./test/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
          exclude: ['./test/**/*.browser.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        },
      },
    ],
  },
  resolve: {
    alias: {
      src: fileURLToPath(new URL('./src', import.meta.url)),
      '@generated': fileURLToPath(new URL('./@generated', import.meta.url)),
      'discovery.config': fileURLToPath(
        new URL('./discovery.config.js', import.meta.url)
      ),
      'graphql/language/printer': 'graphql/language/printer.js',
      'graphql/language': 'graphql/language/index.js',
      graphql: 'graphql/index.js',
    },
  },
  plugins: [
    discoveryConfigResolvePlugin(),
    react(),
    {
      name: 'virtual-module',
      resolveId(id) {
        if (id.endsWith('persisted-documents.json')) {
          return id
        }
        return null
      },
      load(id) {
        if (id.endsWith('persisted-documents.json')) {
          return JSON.stringify({
            '4b33c5c07f440dc7489e55619dc2211a13786e72':
              'fragment ServerCollectionPage on Query { collection(slug: $slug) { id } } query ServerCollectionPageQuery($slug: String!) { collection(slug: $slug) { breadcrumbList { itemListElement { item name position } } meta { selectedFacets { key value } } seo { description title } } ...ServerCollectionPage }',
          })
        }
        return null
      },
    },
  ],
})
