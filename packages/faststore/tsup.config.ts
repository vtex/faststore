import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/navigation.ts',
    'src/font.ts',
    'src/lighthouse.ts',
    'src/script.ts',
    'src/sdk.ts',
    'src/ui.ts',

    // store files
    'src/store/search-page.ts',
    'src/store/product-details-page.ts',
    'src/store/app.ts',
    'src/store/document.ts',
    'src/store/index-page.ts',
    'src/store/product-listing-page.ts',
  ],
  format: ['esm', 'cjs'],
  sourcemap: true,
  clean: true,
  dts: true,
})
