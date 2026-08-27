import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  PUBLIC_FILES_ALLOWED_EXTENSIONS,
  buildFaststorePackageJson,
  relativeNextBin,
  copyPublicFiles,
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

  it('invokes Next through the resolved path when one is given', () => {
    const nextBin = '../node_modules/next/dist/bin/next'

    const result = buildFaststorePackageJson(coreManifest, undefined, nextBin)

    expect(result.scripts).toMatchObject({
      build: `node ${nextBin} build --webpack`,
      serve: `node ${nextBin} serve`,
      dev: `node ${nextBin} dev --webpack`,
      'dev-only': `node ${nextBin} dev --webpack`,
    })
  })

  /**
   * The path is relative to `.faststore`, so it only ever spans node_modules
   * segments — a store directory containing a quote, a `$` or a backtick never
   * reaches the script at all.
   */
  it('keeps a store path with shell metacharacters out of the script', () => {
    const tmpDir = '/Users/dev/my "store" $(x)`y`/.faststore'
    const nextBin = path.relative(
      tmpDir,
      '/Users/dev/my "store" $(x)`y`/node_modules/next/dist/bin/next'
    )

    const result = buildFaststorePackageJson(coreManifest, undefined, nextBin)
    const build = (result.scripts as Record<string, string>).build

    expect(build).toBe(
      'node ../node_modules/next/dist/bin/next build --webpack'
    )
    for (const char of ['"', '$', '`', "'"]) {
      expect(build).not.toContain(char)
    }
  })

  it('leaves the partytown steps alone', () => {
    const result = buildFaststorePackageJson(
      coreManifest,
      undefined,
      '/store/node_modules/next/dist/bin/next'
    )

    expect(result.scripts).toMatchObject({
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

  it('copies image assets used for favicons and social previews', () => {
    expect(isPublicFileAllowed('/public/favicon.png', false)).toBe(true)
    expect(isPublicFileAllowed('/public/apple-touch-icon.jpg', false)).toBe(
      true
    )
    expect(isPublicFileAllowed('/public/og-image.jpeg', false)).toBe(true)
    expect(isPublicFileAllowed('/public/hero.webp', false)).toBe(true)
    expect(isPublicFileAllowed('/public/loading.gif', false)).toBe(true)
    expect(isPublicFileAllowed('/public/banner.avif', false)).toBe(true)
  })

  it('copies the PWA web app manifest', () => {
    expect(isPublicFileAllowed('/public/site.webmanifest', false)).toBe(true)
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
    expect(isPublicFileAllowed('/public/Favicon.PNG', false)).toBe(true)
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

describe('copyPublicFiles', () => {
  let basePath: string

  const publicDir = () => path.join(basePath, 'public')
  const buildDir = () => path.join(basePath, '.faststore', 'public')

  beforeEach(() => {
    basePath = fs.mkdtempSync(path.join(os.tmpdir(), 'faststore-public-'))
    fs.mkdirSync(path.join(publicDir(), 'fonts'), { recursive: true })
  })

  afterEach(() => {
    fs.rmSync(basePath, { recursive: true, force: true })
  })

  it('copies allowed files, including fonts in nested folders, and skips the rest', () => {
    fs.writeFileSync(path.join(publicDir(), 'inter.woff2'), 'font')
    fs.writeFileSync(path.join(publicDir(), 'readme.md'), 'nope')
    fs.writeFileSync(path.join(publicDir(), 'fonts', 'bold.woff'), 'font')
    fs.writeFileSync(path.join(publicDir(), 'fonts', 'notes.ts'), 'nope')

    copyPublicFiles(basePath)

    expect(fs.existsSync(path.join(buildDir(), 'inter.woff2'))).toBe(true)
    expect(fs.existsSync(path.join(buildDir(), 'fonts', 'bold.woff'))).toBe(
      true
    )
    expect(fs.existsSync(path.join(buildDir(), 'readme.md'))).toBe(false)
    expect(fs.existsSync(path.join(buildDir(), 'fonts', 'notes.ts'))).toBe(
      false
    )
  })

  it('does not abort the whole copy when a single entry cannot be stat-ed', () => {
    fs.writeFileSync(path.join(publicDir(), 'inter.woff2'), 'font')
    // Dangling symlink: statSync (with dereference) throws for this entry.
    fs.symlinkSync(
      path.join(publicDir(), 'does-not-exist'),
      path.join(publicDir(), 'broken.woff2')
    )

    expect(() => copyPublicFiles(basePath)).not.toThrow()

    expect(fs.existsSync(path.join(buildDir(), 'inter.woff2'))).toBe(true)
    expect(fs.existsSync(path.join(buildDir(), 'broken.woff2'))).toBe(false)
  })
})

describe('relativeNextBin', () => {
  let root: string

  /** Writes a package that exposes the Next executable at the given path. */
  function installNext(at: string) {
    fs.mkdirSync(path.join(at, 'dist', 'bin'), { recursive: true })
    fs.writeFileSync(
      path.join(at, 'package.json'),
      JSON.stringify({
        name: 'next',
        version: '16.3.1',
        main: 'index.js',
        exports: { '.': './index.js', './dist/bin/next': './dist/bin/next' },
      })
    )
    fs.writeFileSync(path.join(at, 'index.js'), 'module.exports = {}\n')
    fs.writeFileSync(
      path.join(at, 'dist', 'bin', 'next'),
      '#!/usr/bin/env node\n'
    )
  }

  /** A core package and the `.faststore` its generated scripts run from. */
  function tree() {
    root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'fsp-next-')))

    const coreDir = path.join(root, 'node_modules', '@faststore', 'core')
    fs.mkdirSync(coreDir, { recursive: true })
    fs.writeFileSync(
      path.join(coreDir, 'package.json'),
      JSON.stringify({
        name: '@faststore/core',
        version: '1.0.0',
        main: 'index.js',
      })
    )
    fs.writeFileSync(path.join(coreDir, 'index.js'), 'module.exports = {}\n')

    const tmpDir = path.join(root, '.faststore')
    fs.mkdirSync(tmpDir, { recursive: true })

    return { coreDir, tmpDir }
  }

  afterEach(() => {
    if (root) {
      fs.rmSync(root, { recursive: true, force: true })
      root = undefined as unknown as string
    }
  })

  it('points at the Next that core resolves, relative to .faststore', () => {
    const { coreDir, tmpDir } = tree()
    installNext(path.join(coreDir, 'node_modules', 'next'))

    // .faststore sits beside node_modules, so the path climbs out of it once
    expect(relativeNextBin(coreDir, tmpDir)).toBe(
      '../node_modules/@faststore/core/node_modules/next/dist/bin/next'
    )
  })

  /**
   * Resolution climbs to an ancestor when a package has no copy of its own,
   * which is what makes a hoisted install work at all.
   */
  it('finds an ancestor copy when core has none of its own', () => {
    const { coreDir, tmpDir } = tree()
    installNext(path.join(root, 'node_modules', 'next'))

    expect(relativeNextBin(coreDir, tmpDir)).toBe(
      '../node_modules/next/dist/bin/next'
    )
  })
})
