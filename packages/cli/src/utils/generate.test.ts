import { describe, expect, it } from 'vitest'
import { buildFaststorePackageJson } from './generate'

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
})
