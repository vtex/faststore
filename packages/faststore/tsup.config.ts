import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/config/index.ts',
    'src/pages/index.ts',
    'src/navigation/index.ts',
  ],
  format: ['esm', 'cjs'],
  sourcemap: true,
  clean: true,
  dts: true,
})
