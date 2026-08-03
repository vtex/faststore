import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { Kind } from 'graphql'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { getTypeDefsFromFolder } from './generate-types'

// creates <root>/src/graphql/thirdParty/typeDefs/hello.graphql in a fresh
// temp dir whose name starts with the given prefix
function makeFixture(prefix: string) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), prefix))

  const typeDefsDir = path.join(
    root,
    'src',
    'graphql',
    'thirdParty',
    'typeDefs'
  )
  fs.mkdirSync(typeDefsDir, { recursive: true })
  fs.writeFileSync(
    path.join(typeDefsDir, 'hello.graphql'),
    'extend type Query { hello: String! }'
  )

  return root
}

describe('getTypeDefsFromFolder', () => {
  // native separators on purpose — on Windows this produces backslashes,
  // which reproduces the bug where the globby pattern matched nothing
  let root: string
  // parentheses are glob-special characters, so a raw path.join pattern
  // matches nothing on POSIX too — this guards the regression on Linux CI
  let globSpecialRoot: string

  beforeAll(() => {
    root = makeFixture('faststore-typedefs-')
    globSpecialRoot = makeFixture('faststore-typedefs-(x86)-')
  })

  afterAll(() => {
    fs.rmSync(root, { recursive: true, force: true })
    fs.rmSync(globSpecialRoot, { recursive: true, force: true })
  })

  it('finds and parses custom typeDefs when root uses native path separators', async () => {
    const typeDefs = await getTypeDefsFromFolder(root, 'thirdParty')

    expect(typeDefs).toHaveLength(1)
    expect(typeDefs[0].kind).toBe(Kind.DOCUMENT)
  })

  it('finds custom typeDefs when the root path contains glob-special characters', async () => {
    const typeDefs = await getTypeDefsFromFolder(globSpecialRoot, 'thirdParty')

    expect(typeDefs).toHaveLength(1)
    expect(typeDefs[0].kind).toBe(Kind.DOCUMENT)
  })

  it('returns an empty array when the custom folder has no typeDefs', async () => {
    const typeDefs = await getTypeDefsFromFolder(root, 'vtex')

    expect(typeDefs).toHaveLength(0)
  })
})
