import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { afterEach, describe, expect, it } from 'vitest'

import { readMyAccountCmsRoutes } from './readMyAccountCmsRoutes'

const fixturesDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '__fixtures__/myAccount'
)

describe('readMyAccountCmsRoutes', () => {
  it('extracts routes that declare a contentType', () => {
    const routes = readMyAccountCmsRoutes(
      path.join(fixturesDir, 'navigation-with-cms.ts')
    )

    expect(routes).toEqual([
      {
        route: '/pvt/account/wishlist',
        title: 'Wishlist',
        contentType: 'myAccountWishlist',
      },
    ])
  })

  it('returns an empty list when no route declares contentType', () => {
    const routes = readMyAccountCmsRoutes(
      path.join(fixturesDir, 'navigation-legacy-only.ts')
    )

    expect(routes).toEqual([])
  })

  it('returns an empty list when the file does not exist', () => {
    expect(readMyAccountCmsRoutes('/tmp/does-not-exist-navigation.ts')).toEqual(
      []
    )
  })

  it('returns empty and does not throw for unparseable input', () => {
    const tmp = path.join(os.tmpdir(), `nav-dynamic-${Date.now()}.ts`)
    fs.writeFileSync(
      tmp,
      `const routes = buildRoutes()\nexport default getMyAccountRoutes({ routes })\n`
    )

    try {
      expect(readMyAccountCmsRoutes(tmp)).toEqual([])
    } finally {
      fs.unlinkSync(tmp)
    }
  })
})

afterEach(() => {
  // no-op placeholder for symmetry with other suites
})
