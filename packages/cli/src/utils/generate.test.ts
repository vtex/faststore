import { describe, expect, it } from 'vitest'
import {
  PUBLIC_FILES_ALLOWED_EXTENSIONS,
  buildFaststorePackageJson,
  isPublicFileAllowed,
} from './generate'

describe('buildFaststorePackageJson', () => {
  const coreManifest = {
    name: '@faststore/core',
    version: '4.1.2',
    license: 'MIT',
    browserslist: 'supports es6-module and not dead',
    packageManager: 'pnpm@10.28.0',
    exports: {
      '.': './index.ts',
      './api': './api/index.ts',
    },
    scripts: {
      test: 'vitest run',
      'test:e2e': 'cypress open',
      generate: 'pnpm run gen-types && pnpm run cache-graphql ',
    },
    dependencies: {
      next: '^16.0.0',
      react: '^18.2.0',
    },
    devDependencies: {
      vitest: 'catalog:',
    },
    engines: { node: '>=20' },
    sideEffects: false,
  }

  it('strips the `packageManager` field so Yarn / Corepack do not mangle it in stores', () => {
    const result = buildFaststorePackageJson(coreManifest)

    expect(result).not.toHaveProperty('packageManager')
  })

  it('strips the `exports` field so it does not shadow @faststore/core resolution', () => {
    const result = buildFaststorePackageJson(coreManifest)

    expect(result).not.toHaveProperty('exports')
  })

  it('renames the package to `dot-faststore`', () => {
    const result = buildFaststorePackageJson(coreManifest)

    expect(result.name).toBe('dot-faststore')
  })

  it('overrides the scripts needed by the CLI on top of any pre-existing scripts', () => {
    const result = buildFaststorePackageJson(coreManifest)

    expect(result.scripts).toEqual({
      'test:e2e': 'cypress open',
      test: 'vitest run',
      generate: 'faststore generate',
      build: 'next build --webpack',
      serve: 'next serve',
      dev: 'next dev --webpack',
      'dev-only': 'next dev --webpack',
      predev: 'na run partytown',
      prebuild: 'na run partytown',
    })
  })

  it('preserves dependencies, devDependencies, engines and other metadata fields', () => {
    const result = buildFaststorePackageJson(coreManifest)

    expect(result.dependencies).toEqual(coreManifest.dependencies)
    expect(result.devDependencies).toEqual(coreManifest.devDependencies)
    expect(result.engines).toEqual(coreManifest.engines)
    expect(result.version).toBe(coreManifest.version)
    expect(result.license).toBe(coreManifest.license)
    expect(result.browserslist).toBe(coreManifest.browserslist)
    expect(result.sideEffects).toBe(false)
  })

  it('still injects the required scripts when the source manifest has no scripts entry', () => {
    const { scripts: _, ...withoutScripts } = coreManifest

    const result = buildFaststorePackageJson(withoutScripts)

    expect(result.scripts).toEqual({
      generate: 'faststore generate',
      build: 'next build --webpack',
      serve: 'next serve',
      dev: 'next dev --webpack',
      'dev-only': 'next dev --webpack',
      predev: 'na run partytown',
      prebuild: 'na run partytown',
    })
  })

  it('omits `packageManager` from the output even when it is absent from the source', () => {
    const { packageManager: _, ...withoutPackageManager } = coreManifest

    const result = buildFaststorePackageJson(withoutPackageManager)

    expect(result).not.toHaveProperty('packageManager')
  })

  it('does not mutate the input manifest', () => {
    const input = structuredClone(coreManifest)

    buildFaststorePackageJson(input)

    expect(input).toEqual(coreManifest)
  })

  it('propagates the store `volta` config when provided', () => {
    const volta = { node: '20.19.0', yarn: '1.19.1' }

    const result = buildFaststorePackageJson(coreManifest, volta)

    expect(result.volta).toEqual(volta)
  })

  it('omits `volta` when no config is provided', () => {
    const result = buildFaststorePackageJson(coreManifest)

    expect(result).not.toHaveProperty('volta')
  })
})

describe('isPublicFileAllowed', () => {
  it('always allows directories regardless of their name', () => {
    expect(isPublicFileAllowed('/public', true)).toBe(true)
    expect(isPublicFileAllowed('/public/fonts', true)).toBe(true)
    expect(isPublicFileAllowed('/public/assets/images', true)).toBe(true)
  })

  it('copies self-hosted font files', () => {
    expect(isPublicFileAllowed('/public/fonts/inter.woff', false)).toBe(true)
    expect(isPublicFileAllowed('/public/fonts/inter.woff2', false)).toBe(true)
    expect(isPublicFileAllowed('/public/fonts/inter.ttf', false)).toBe(true)
    expect(isPublicFileAllowed('/public/fonts/inter.otf', false)).toBe(true)
    expect(isPublicFileAllowed('/public/fonts/inter.eot', false)).toBe(true)
  })

  it('still copies the previously supported extensions', () => {
    expect(isPublicFileAllowed('/public/manifest.json', false)).toBe(true)
    expect(isPublicFileAllowed('/public/robots.txt', false)).toBe(true)
    expect(isPublicFileAllowed('/public/sitemap.xml', false)).toBe(true)
    expect(isPublicFileAllowed('/public/favicon.ico', false)).toBe(true)
    expect(isPublicFileAllowed('/public/logo.svg', false)).toBe(true)
  })

  it('matches the extension case-insensitively', () => {
    expect(isPublicFileAllowed('/public/fonts/Inter.WOFF2', false)).toBe(true)
    expect(isPublicFileAllowed('/public/LOGO.SVG', false)).toBe(true)
  })

  it('rejects files whose extension is not allowed', () => {
    expect(isPublicFileAllowed('/public/script.ts', false)).toBe(false)
    expect(isPublicFileAllowed('/public/styles.css', false)).toBe(false)
    expect(isPublicFileAllowed('/public/notes.md', false)).toBe(false)
  })

  it('does not match extensions as a substring of the file name', () => {
    // Regression: the old filter used `endsWith`, so `basico` matched `ico`.
    expect(isPublicFileAllowed('/public/basico', false)).toBe(false)
    expect(isPublicFileAllowed('/public/data.myjson', false)).toBe(false)
    expect(isPublicFileAllowed('/public/nested/public', false)).toBe(false)
  })

  it('exposes the allowed extensions as dot-prefixed values', () => {
    for (const extension of PUBLIC_FILES_ALLOWED_EXTENSIONS) {
      expect(extension.startsWith('.')).toBe(true)
    }
  })
})
