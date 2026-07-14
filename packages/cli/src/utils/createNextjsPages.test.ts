import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./directory', async () => {
  const nodePath = await import('node:path')

  return {
    withBasePath: (basePath: string) => ({
      tmpDir: nodePath.join(basePath, '.faststore'),
    }),
  }
})

import { createNextJsPages } from './createNextjsPages'

const fixturesDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '__fixtures__/myAccount'
)

describe('createNextJsPages', () => {
  let tempDir: string
  let tmpFaststore: string
  let corePagesDir: string
  let customizationPagesDir: string
  let navigationDir: string

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'faststore-create-pages-'))
    tmpFaststore = path.join(tempDir, '.faststore')
    corePagesDir = path.join(tmpFaststore, 'src', 'pages')
    customizationPagesDir = path.join(
      tmpFaststore,
      'src',
      'customizations',
      'src',
      'pages'
    )
    navigationDir = path.join(
      tmpFaststore,
      'src',
      'customizations',
      'src',
      'myAccount'
    )

    fs.mkdirSync(corePagesDir, { recursive: true })
    fs.mkdirSync(customizationPagesDir, { recursive: true })
    fs.mkdirSync(navigationDir, { recursive: true })
  })

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true })
  })

  function seedNavigation(fixtureName: string) {
    fs.copyFileSync(
      path.join(fixturesDir, fixtureName),
      path.join(navigationDir, 'navigation.ts')
    )
  }

  it('generates a Mode A CMS page when contentType is set and no .tsx exists', () => {
    seedNavigation('navigation-with-cms.ts')

    createNextJsPages(tempDir)

    const generated = path.join(corePagesDir, 'pvt', 'account', 'wishlist.tsx')
    expect(fs.existsSync(generated)).toBe(true)
    const content = fs.readFileSync(generated, 'utf8')
    expect(content).toContain(
      "myAccountCmsServerSideProps('myAccountWishlist', '/pvt/account/wishlist')"
    )
    expect(content).not.toContain('DynamicPage')
  })

  it('generates a Mode B CMS page when contentType and a .tsx body exist', () => {
    seedNavigation('navigation-with-cms.ts')

    const bodyDir = path.join(customizationPagesDir, 'pvt', 'account')
    fs.mkdirSync(bodyDir, { recursive: true })
    fs.writeFileSync(
      path.join(bodyDir, 'wishlist.tsx'),
      'export default function Wishlist() { return null }\n'
    )

    createNextJsPages(tempDir)

    const generated = path.join(corePagesDir, 'pvt', 'account', 'wishlist.tsx')
    const content = fs.readFileSync(generated, 'utf8')
    expect(content).toContain(
      "import DynamicPage from 'src/customizations/src/pages/pvt/account/wishlist'"
    )
    expect(content).toContain('<DynamicPage />')
  })

  it('keeps the legacy template for pages without contentType', () => {
    seedNavigation('navigation-legacy-only.ts')

    const bodyDir = path.join(customizationPagesDir, 'pvt', 'account')
    fs.mkdirSync(bodyDir, { recursive: true })
    fs.writeFileSync(
      path.join(bodyDir, 'legacy.tsx'),
      'export default function Legacy() { return null }\n'
    )

    createNextJsPages(tempDir)

    const generated = path.join(corePagesDir, 'pvt', 'account', 'legacy.tsx')
    expect(fs.existsSync(generated)).toBe(true)
    const content = fs.readFileSync(generated, 'utf8')
    expect(content).toContain('myAccountServerSideProps')
    expect(content).toContain('DynamicPage')
    expect(content).not.toContain('myAccountCmsServerSideProps')
  })

  it('skips CMS generation when the route collides with a native page', () => {
    seedNavigation('navigation-collision.ts')

    const nativeDir = path.join(corePagesDir, 'pvt', 'account')
    fs.mkdirSync(nativeDir, { recursive: true })
    fs.writeFileSync(
      path.join(nativeDir, 'profile.tsx'),
      '// native profile\nexport default function Profile() { return null }\n'
    )

    createNextJsPages(tempDir)

    const content = fs.readFileSync(path.join(nativeDir, 'profile.tsx'), 'utf8')
    expect(content).toContain('// native profile')
    expect(content).not.toContain('myAccountCmsServerSideProps')
  })

  it('does not generate CMS pages outside /pvt/account', () => {
    seedNavigation('navigation-collision.ts')

    createNextJsPages(tempDir)

    expect(
      fs.existsSync(path.join(corePagesDir, 'shop', 'not-account.tsx'))
    ).toBe(false)
  })

  it('wires before/after extensions for hybrid CMS pages', () => {
    seedNavigation('navigation-with-cms.ts')

    const bodyDir = path.join(customizationPagesDir, 'pvt', 'account')
    fs.mkdirSync(bodyDir, { recursive: true })
    fs.writeFileSync(
      path.join(bodyDir, 'wishlist.tsx'),
      'export default function Wishlist() { return null }\n'
    )

    const extensionsDir = path.join(
      tmpFaststore,
      'src',
      'customizations',
      'src',
      'myAccount',
      'extensions',
      'wishlist'
    )
    fs.mkdirSync(extensionsDir, { recursive: true })
    fs.writeFileSync(
      path.join(extensionsDir, 'before.tsx'),
      'export default function Before() { return null }\n'
    )
    fs.writeFileSync(
      path.join(extensionsDir, 'after.tsx'),
      'export default function After() { return null }\n'
    )

    createNextJsPages(tempDir)

    const content = fs.readFileSync(
      path.join(corePagesDir, 'pvt', 'account', 'wishlist.tsx'),
      'utf8'
    )
    expect(content).toContain(
      "import { default as BeforeSection } from 'src/customizations/src/myAccount/extensions/wishlist/before'"
    )
    expect(content).toContain(
      "import { default as AfterSection } from 'src/customizations/src/myAccount/extensions/wishlist/after'"
    )
  })

  it('throws when a customization page is outside the allowed prefix', () => {
    seedNavigation('navigation-legacy-only.ts')

    const badDir = path.join(customizationPagesDir, 'shop')
    fs.mkdirSync(badDir, { recursive: true })
    fs.writeFileSync(
      path.join(badDir, 'home.tsx'),
      'export default function Home() { return null }\n'
    )

    expect(() => createNextJsPages(tempDir)).toThrow(/Only these prefix pages/)
  })
})
