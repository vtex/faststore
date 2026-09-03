import { describe, expect, it } from 'vitest'
import {
  STOREFRONT_TEST_EXCLUDE_GLOBS,
  prepareStorefrontTsConfig,
  shouldCopyToStorefront,
} from './storefrontCopy'

describe('shouldCopyToStorefront', () => {
  it('copies regular core source files', () => {
    expect(shouldCopyToStorefront('/core/src/sdk/session/index.ts')).toBe(true)
    expect(shouldCopyToStorefront('/core/src')).toBe(true)
    expect(shouldCopyToStorefront('/core/index.ts')).toBe(true)
  })

  it('copies a path whose basename is empty so the filter does not drop the copy root', () => {
    expect(shouldCopyToStorefront('')).toBe(true)
    expect(shouldCopyToStorefront('/')).toBe(true)
  })

  it('skips the core unit-test tree and plugin __tests__ folders', () => {
    expect(shouldCopyToStorefront('/core/test')).toBe(false)
    expect(shouldCopyToStorefront('/core/test/utils/retry.test.ts')).toBe(false)
    expect(shouldCopyToStorefront('/plugin/src/__tests__')).toBe(false)
    expect(
      shouldCopyToStorefront('/plugin/src/__tests__/checkout.test.ts')
    ).toBe(false)
  })

  it('skips colocated test files under src', () => {
    expect(shouldCopyToStorefront('/core/src/utils/retry.test.ts')).toBe(false)
    expect(shouldCopyToStorefront('/core/src/Layout.test.tsx')).toBe(false)
    expect(
      shouldCopyToStorefront('/core/src/sdk/session/index.browser.test.ts')
    ).toBe(false)
    expect(shouldCopyToStorefront('/plugin/src/foo.spec.ts')).toBe(false)
    expect(shouldCopyToStorefront('/plugin/src/foo.spec.tsx')).toBe(false)
    expect(shouldCopyToStorefront('/plugin/src/foo.test.js')).toBe(false)
    expect(shouldCopyToStorefront('/plugin/src/foo.test.jsx')).toBe(false)
  })

  it('still skips package.json, node_modules and CP base.jsonc', () => {
    expect(shouldCopyToStorefront('/core/package.json')).toBe(false)
    expect(shouldCopyToStorefront('/core/node_modules')).toBe(false)
    expect(shouldCopyToStorefront('/core/cms/faststore/base.jsonc')).toBe(false)
    expect(shouldCopyToStorefront('/core/cypress.config.ts')).toBe(false)
  })
})

describe('prepareStorefrontTsConfig', () => {
  const coreTsConfig = {
    compilerOptions: { noImplicitAny: false, strict: false },
    include: [
      '*.d.ts',
      'index.ts',
      'src/**/*.ts',
      'src/**/*.tsx',
      '@generated/**/*.ts',
      'test/**/*.ts',
      'test/**/*.tsx',
    ],
    exclude: ['node_modules', 'public'],
  }

  it('removes test/ includes so Next does not type-check core tests', () => {
    const result = prepareStorefrontTsConfig(coreTsConfig)

    expect(result.include).toEqual([
      '*.d.ts',
      'index.ts',
      'src/**/*.ts',
      'src/**/*.tsx',
      '@generated/**/*.ts',
    ])
  })

  it('adds test exclude globs without dropping existing excludes', () => {
    const result = prepareStorefrontTsConfig(coreTsConfig)

    expect(result.exclude).toEqual([
      'node_modules',
      'public',
      ...STOREFRONT_TEST_EXCLUDE_GLOBS,
    ])
  })

  it('excludes store stories and Jest manual mocks copied under src/customizations', () => {
    const { exclude = [] } = prepareStorefrontTsConfig(coreTsConfig)

    expect(exclude).toEqual(
      expect.arrayContaining([
        '**/*.stories.ts',
        '**/*.stories.tsx',
        '**/__mocks__/**',
      ])
    )
  })

  it('does not mutate the input tsconfig', () => {
    const input = structuredClone(coreTsConfig)

    prepareStorefrontTsConfig(input)

    expect(input).toEqual(coreTsConfig)
  })

  it('defaults missing include and exclude arrays', () => {
    const result = prepareStorefrontTsConfig({
      compilerOptions: { strict: false },
    })

    expect(result.include).toEqual([])
    expect(result.exclude).toEqual([...STOREFRONT_TEST_EXCLUDE_GLOBS])
    expect(result.compilerOptions).toEqual({ strict: false })
  })
})
