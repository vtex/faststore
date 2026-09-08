import path from 'node:path'

const IGNORED_STOREFRONT_BASENAMES = new Set([
  'package.json',
  'node_modules',
  'cypress.config.ts',
  'base.jsonc', // CP special file, it must not be copied to the merchants' temp dir
  'test',
  '__tests__',
])

const TEST_FILE_RE = /\.(?:test|spec|browser\.test)\.(?:js|jsx|ts|tsx)$/

/**
 * Storefront `.faststore` is a Next.js app, not a test runner. Skip unit-test
 * trees and files so `next build` does not type-check vitest fixtures the
 * store does not install.
 */
export function shouldCopyToStorefront(src: string): boolean {
  const name = path.basename(src)

  if (!name) {
    return true
  }

  if (IGNORED_STOREFRONT_BASENAMES.has(name)) {
    return false
  }

  if (TEST_FILE_RE.test(name)) {
    return false
  }

  return true
}

/**
 * Globs `next build` must not type-check inside `.faststore`. Besides the core
 * test trees, stores keep Storybook stories and Jest manual mocks next to
 * their components under `src/`; those are copied into
 * `.faststore/src/customizations/src` and would otherwise be compiled against
 * dev-only dependencies (`@storybook/*`, `@jest/globals`) the build does not
 * have.
 */
export const STOREFRONT_TEST_EXCLUDE_GLOBS = [
  'test',
  '**/*.test.ts',
  '**/*.test.tsx',
  '**/*.spec.ts',
  '**/*.spec.tsx',
  '**/*.stories.ts',
  '**/*.stories.tsx',
  '**/__tests__/**',
  '**/__mocks__/**',
] as const

type TsConfig = {
  include?: string[]
  exclude?: string[]
  compilerOptions?: Record<string, unknown>
  [key: string]: unknown
}

/**
 * Drop core/plugin test globs from the tsconfig copied into `.faststore`.
 * Defense in depth if a test file still lands under `src/`.
 */
export function prepareStorefrontTsConfig(tsConfig: TsConfig): TsConfig {
  const include = (tsConfig.include ?? []).filter(
    (pattern) => !String(pattern).startsWith('test/')
  )
  const exclude = Array.from(
    new Set([...(tsConfig.exclude ?? []), ...STOREFRONT_TEST_EXCLUDE_GLOBS])
  )

  return {
    ...tsConfig,
    include,
    exclude,
  }
}
