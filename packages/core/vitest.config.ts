import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['./test/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    globals: true,
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
