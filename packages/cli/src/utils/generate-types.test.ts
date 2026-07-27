import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { Kind } from 'graphql'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { getTypeDefsFromFolder } from './generate-types'

describe('getTypeDefsFromFolder', () => {
  let root: string

  beforeAll(() => {
    // native separators on purpose — on Windows this produces backslashes,
    // which reproduces the bug where the globby pattern matched nothing
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'faststore-typedefs-'))

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
  })

  afterAll(() => {
    fs.rmSync(root, { recursive: true, force: true })
  })

  it('finds and parses custom typeDefs when root uses native path separators', async () => {
    const typeDefs = await getTypeDefsFromFolder(root, 'thirdParty')

    expect(typeDefs).toHaveLength(1)
    expect(typeDefs[0].kind).toBe(Kind.DOCUMENT)
  })

  it('returns an empty array when the custom folder has no typeDefs', async () => {
    const typeDefs = await getTypeDefsFromFolder(root, 'vtex')

    expect(typeDefs).toHaveLength(0)
  })
})
